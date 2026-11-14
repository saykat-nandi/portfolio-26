/**
 * Layout + decorative media for the Orvante-inspired remix.
 * Personal copy lives in content/portfolio.ts and is re-exported here.
 */
import {
  about,
  caseStudies,
  contact,
  experience,
  hero,
  lab,
  nav,
  site,
  techStack,
  testimonials,
} from "@/content/portfolio";

export const media = {
  /** Decorative only — hero portrait uses hero.photo.src (myphoto.jpg) */
  heroPhoto: hero.photo.src,
  cardCap:
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/a9d3641f-d629-46e5-8d2d-5f75386b803d.webp",
  feature:
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/9340eb08-877d-4d08-91fb-b70754541d98.webp",
  portrait:
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/addecc7d-666f-4342-8290-ed7f7cbbffd6.webp",
  avatars: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/300f41b1-3de5-4153-afde-06e15e753ad0.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/bfff4cdf-4fda-4491-ada6-62f3b6236492.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/943b121e-fe72-479f-93ae-aa8cd1650f69.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/c673306f-2b81-4c3d-a7d2-3df61d481abb.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2e4fcf11-d0fc-4f31-8f7a-dfe751777141.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/ab458fcd-4c2c-426f-8213-21cc3c7274be.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/c1fcd833-5ac9-41e9-9352-fead7e64fa24.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4c2b3307-e555-4633-949c-efd3b7e09d82.webp",
  ],
};

/** Manifesto lines taken from your about / summary voice */
export const statement = {
  lines: [
    "I care about monetization mechanics,",
    "user retention, and shipping software",
    "that solves measurable operational",
    "problems — rather than writing code",
    "for its own sake.",
  ],
  subline: [
    "Complex business logic meets interactive",
    "interfaces — from escrow flows to automation.",
  ],
  sublineMuted: about.title,
};

export const trust = {
  titleLines: ["Trusted for", "systems that", "actually", "ship"],
  paragraph: about.paragraphs[0],
  collabStat: {
    value: caseStudies.length,
    suffix: "+",
    label: "Flagship case studies",
  },
  awardStat: {
    value: lab.length,
    suffix: "",
    label: "Hardware lab builds",
  },
  awardNote: lab.map((l) => l.title.split(":")[0] || l.title).join(" · "),
  awardBadge: "LAB CRAFT 2026",
};

export {
  about,
  caseStudies,
  contact,
  experience,
  hero,
  lab,
  nav,
  site,
  techStack,
  testimonials,
};
