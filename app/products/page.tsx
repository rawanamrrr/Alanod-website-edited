"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLocale } from "@/lib/locale-context"
import { useTranslation } from "@/lib/translations"
import { openWhatsAppWithMessage, getCollectionOrderMessage } from "@/lib/whatsapp"

type Collection = { id: string; name: string; imageUrl: string }

export default function ProductsPage() {
  const { settings } = useLocale()
  const t = useTranslation(settings.language)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loadingCollections, setLoadingCollections] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch("/api/collections", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return
        setCollections(data.map((c: any) => ({ id: c.id, name: c.name, imageUrl: c.imageUrl })))
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCollections(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCollectionClick = () => {
    openWhatsAppWithMessage("971502996885", getCollectionOrderMessage(settings.language))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <section className="pt-40 md:pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-6 font-engravers">
              {t("collections")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("collectionsDesc")}
            </p>
          </div>

          {loadingCollections ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("loadingProducts")}</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t("noProducts")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={handleCollectionClick}
                  className="group relative block h-[420px] md:h-[520px] overflow-hidden rounded-lg shadow-lg w-full text-left"
                >
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-light tracking-wider font-engravers mb-3">
                      {collection.name}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-sm font-medium border-b border-white/70 pb-1 group-hover:gap-3 transition-all">
                      {t("exploreCollections")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
