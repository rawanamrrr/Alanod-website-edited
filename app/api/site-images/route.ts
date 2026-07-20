import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { supabase, supabaseAdmin } from "@/lib/supabase"

// Expects a Supabase table `site_images` with columns:
//   key (text, primary key), image_url (text), updated_at (timestamptz)

export async function GET() {
  try {
    const { data, error } = await supabase.from("site_images").select("key, image_url")

    if (error) {
      console.error("Error fetching site images:", error)
      return NextResponse.json({}, { status: 200 })
    }

    const map: Record<string, string> = {}
    for (const row of data || []) {
      if (row.key && row.image_url) map[row.key] = row.image_url
    }

    const response = NextResponse.json(map)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    return response
  } catch (error) {
    console.error("Error fetching site images:", error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { key, imageUrl } = await request.json()

    if (!key || !imageUrl) {
      return NextResponse.json({ error: "key and imageUrl are required" }, { status: 400 })
    }

    const client = supabaseAdmin || supabase
    if (!supabaseAdmin) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not set, using anon key. RLS policies may block site image update.")
    }

    const { error } = await client
      .from("site_images")
      .upsert({ key, image_url: imageUrl, updated_at: new Date().toISOString() }, { onConflict: "key" })

    if (error) {
      console.error("Error updating site image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, key, imageUrl })
  } catch (error) {
    console.error("Update site image error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
