import { supabase } from "@/lib/supabase"

export type ServerCollection = { id: string; name: string; imageUrl: string }

export async function getServerCollections(): Promise<ServerCollection[]> {
  try {
    const { data, error } = await supabase
      .from("collections")
      .select("id, name, image_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error || !data) {
      return []
    }

    return data.map((row) => ({ id: row.id, name: row.name, imageUrl: row.image_url }))
  } catch {
    return []
  }
}
