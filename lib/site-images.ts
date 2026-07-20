"use client"

import { useEffect, useState } from "react"

export {
  SITE_IMAGE_KEYS,
  DEFAULT_SITE_IMAGES,
  SITE_IMAGE_LABELS,
  type SiteImageKey,
} from "@/lib/site-images-shared"
import { DEFAULT_SITE_IMAGES, type SiteImageKey } from "@/lib/site-images-shared"

export function useSiteImages(initialImages?: Record<string, string>) {
  const [images, setImages] = useState<Record<string, string>>(
    initialImages ? { ...DEFAULT_SITE_IMAGES, ...initialImages } : DEFAULT_SITE_IMAGES,
  )
  const [loading, setLoading] = useState(!initialImages)

  useEffect(() => {
    let cancelled = false

    fetch("/api/site-images", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (cancelled) return
        setImages((prev) => ({ ...prev, ...data }))
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const getImage = (key: SiteImageKey) => images[key] || DEFAULT_SITE_IMAGES[key]

  return { images, getImage, loading }
}
