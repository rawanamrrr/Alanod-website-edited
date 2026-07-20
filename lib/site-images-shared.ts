export const SITE_IMAGE_KEYS = {
  homeHero: "home_hero",
  homeArtOfCouture: "home_art_of_couture",
  customizeHero: "customize_hero",
  aboutHero: "about_hero",
} as const

export type SiteImageKey = (typeof SITE_IMAGE_KEYS)[keyof typeof SITE_IMAGE_KEYS]

export const DEFAULT_SITE_IMAGES: Record<SiteImageKey, string> = {
  [SITE_IMAGE_KEYS.homeHero]: "/Alanod-bg.jpeg",
  [SITE_IMAGE_KEYS.homeArtOfCouture]: "/Alanod-bg.jpeg",
  [SITE_IMAGE_KEYS.customizeHero]: "/Alanod-bg.jpeg",
  [SITE_IMAGE_KEYS.aboutHero]: "/about.jpeg",
}

export const SITE_IMAGE_LABELS: Record<SiteImageKey, string> = {
  [SITE_IMAGE_KEYS.homeHero]: "Home Page — Hero Background",
  [SITE_IMAGE_KEYS.homeArtOfCouture]: "Home Page — The Art of Couture Section",
  [SITE_IMAGE_KEYS.customizeHero]: "Customize Page — Hero Background",
  [SITE_IMAGE_KEYS.aboutHero]: "Robe Image",
}
