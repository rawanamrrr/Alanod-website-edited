import { getServerSiteImages } from "@/lib/site-images-server"
import CustomizePageClient from "./customize-client"

export const dynamic = "force-dynamic"

export default async function CustomizePage() {
  const initialSiteImages = await getServerSiteImages()
  return <CustomizePageClient initialSiteImages={initialSiteImages} />
}
