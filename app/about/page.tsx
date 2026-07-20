import { getServerSiteImages } from "@/lib/site-images-server"
import AboutPageClient from "./about-client"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const initialSiteImages = await getServerSiteImages()
  return <AboutPageClient initialSiteImages={initialSiteImages} />
}
