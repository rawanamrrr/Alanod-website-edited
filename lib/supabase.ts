import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Next.js patches the global fetch() to cache requests by default in
// production builds — including ones made internally by supabase-js.
// Without this, reads can silently return stale, build-time-cached data
// regardless of any route-level "force-dynamic" setting.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" })

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // We handle auth with JWT
    },
    global: {
      fetch: noStoreFetch,
    },
  }
)

// Server-side client (if you need service role key for admin operations)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
        global: {
          fetch: noStoreFetch,
        },
      }
    )
  : null

