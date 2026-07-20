import { supabase } from "@/lib/supabase"
import { DEFAULT_SITE_IMAGES } from "@/lib/site-images-shared"

export async function getServerSiteImages(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase.from("site_images").select("key, image_url")

    if (error || !data) {
      return DEFAULT_SITE_IMAGES
    }

    const map: Record<string, string> = { ...DEFAULT_SITE_IMAGES }
    for (const row of data) {
      if (row.key && row.image_url) map[row.key] = row.image_url
    }
    return map
  } catch {
    return DEFAULT_SITE_IMAGES
  }
}
