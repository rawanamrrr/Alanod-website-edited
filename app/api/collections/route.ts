import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { supabase, supabaseAdmin } from "@/lib/supabase"

// Expects a Supabase table `collections` with columns:
//   id (uuid pk), name (text), image_url (text), display_order (int), is_active (bool),
//   created_at (timestamptz), updated_at (timestamptz)

interface Collection {
  id?: string
  name: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at?: Date
  updated_at?: Date
}

const transform = (row: any) => ({
  _id: row.id,
  id: row.id,
  name: row.name,
  imageUrl: row.image_url,
  displayOrder: row.display_order || 0,
  isActive: row.is_active === true,
  createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
})

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const includeInactive = url.searchParams.get("all") === "true"

    let query = supabase.from("collections").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true })
    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching collections:", error)
      return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
    }

    const response = NextResponse.json((data || []).map(transform))
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    return response
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { name, imageUrl, displayOrder } = await request.json()

    if (!name || !imageUrl) {
      return NextResponse.json({ error: "name and imageUrl are required" }, { status: 400 })
    }

    const newCollection: Omit<Collection, "id" | "created_at" | "updated_at"> = {
      name: name.trim(),
      image_url: imageUrl,
      display_order: Number(displayOrder) || 0,
      is_active: true,
    }

    const client = supabaseAdmin || supabase
    if (!supabaseAdmin) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not set, using anon key. RLS policies may block collection creation.")
    }

    const { data: result, error } = await client.from("collections").insert(newCollection).select().single()

    if (error) {
      console.error("Error creating collection:", error)
      return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
    }

    return NextResponse.json({ success: true, collection: transform(result) })
  } catch (error) {
    console.error("Create collection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 })
    }

    const { name, imageUrl, displayOrder, isActive } = await request.json()

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (imageUrl !== undefined) updateData.image_url = imageUrl
    if (displayOrder !== undefined) updateData.display_order = Number(displayOrder) || 0
    if (isActive !== undefined) updateData.is_active = isActive

    const client = supabaseAdmin || supabase
    if (!supabaseAdmin) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not set, using anon key. RLS policies may block collection update.")
    }

    const { data: updated, error } = await client
      .from("collections")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error || !updated) {
      console.error("Error updating collection:", error)
      return NextResponse.json({ error: error?.message || "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, collection: transform(updated) })
  } catch (error) {
    console.error("Update collection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 })
    }

    const client = supabaseAdmin || supabase
    if (!supabaseAdmin) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not set, using anon key. RLS policies may block collection deletion.")
    }

    const { error } = await client.from("collections").delete().eq("id", id)

    if (error) {
      console.error("Error deleting collection:", error)
      return NextResponse.json({ error: "Collection not found or failed to delete" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Collection deleted successfully" })
  } catch (error) {
    console.error("Delete collection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
