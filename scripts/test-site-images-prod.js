// One-off diagnostic script. Run locally with:
//   node scripts/test-site-images-prod.js https://yourdomain.com
//
// It reads JWT_SECRET from your local .env.local (same one deployed to the
// server), signs a temporary admin token, then PUTs a test image URL and
// immediately GETs it back from your LIVE deployed site to see whether the
// write actually persists there.

require("dotenv").config({ path: ".env.local" })
const jwt = require("jsonwebtoken")

const baseUrl = process.argv[2]
if (!baseUrl) {
  console.error("Usage: node scripts/test-site-images-prod.js https://yourdomain.com")
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET not found in .env.local — this must match the one on your server.")
  process.exit(1)
}

const token = jwt.sign({ id: "diag", email: "diag@test.com", role: "admin" }, process.env.JWT_SECRET, {
  expiresIn: "10m",
})

const testUrl = `https://example.com/diagnostic-${Date.now()}.jpg`

async function main() {
  console.log("1) Reading current value from LIVE site...")
  const before = await fetch(`${baseUrl}/api/site-images`, { cache: "no-store" }).then((r) => r.json())
  console.log("   home_hero before:", before.home_hero)

  console.log("\n2) Writing a test value to LIVE site via PUT...")
  const putRes = await fetch(`${baseUrl}/api/site-images`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ key: "home_hero", imageUrl: testUrl }),
  })
  console.log("   PUT status:", putRes.status)
  console.log("   PUT body:", await putRes.text())

  console.log("\n3) Reading it back immediately...")
  const after = await fetch(`${baseUrl}/api/site-images`, { cache: "no-store" }).then((r) => r.json())
  console.log("   home_hero after:", after.home_hero)

  if (after.home_hero === testUrl) {
    console.log("\n✅ WRITE PERSISTED — the API + database write path works correctly on your live server.")
    console.log("   Restoring original value...")
    await fetch(`${baseUrl}/api/site-images`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key: "home_hero", imageUrl: before.home_hero }),
    })
    console.log("   Restored.")
  } else {
    console.log("\n❌ WRITE DID NOT PERSIST — the PUT reported success but the value never actually changed.")
    console.log("   This confirms the write is being silently blocked (most likely RLS on the server,")
    console.log("   meaning SUPABASE_SERVICE_ROLE_KEY isn't actually active in your deployed Node process).")
  }
}

main().catch((e) => {
  console.error("Script failed:", e)
  process.exit(1)
})
