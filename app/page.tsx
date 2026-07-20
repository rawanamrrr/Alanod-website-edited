import { getServerSiteImages } from "@/lib/site-images-server"
import { getServerCollections } from "@/lib/collections-server"
import HomeClient from "./home-client"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [initialSiteImages, initialCollections] = await Promise.all([
    getServerSiteImages(),
    getServerCollections(),
  ])
  return <HomeClient initialSiteImages={initialSiteImages} initialCollections={initialCollections} />
}
