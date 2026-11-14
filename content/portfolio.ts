export type CaseStudy = {
  id: string;
  number: string;
  title: string;
  role: string;
  stack: string[];
  problem: string;
  built: string[];
  liveUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
  diagramLabel: string;
  codeSnippet: string;
};

export type TechGroup = {
  title: string;
  items: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
};

export type LabItem = {
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

export const site = {
  name: "Saykat Nandi Dip",
  shortName: "Saykat",
  title: "Saykat Nandi Dip — Full-Stack Software Engineer",
  description:
    "Full-Stack Software Engineer building backend systems, real-time web platforms, and automation pipelines.",
};

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Saykat Nandi Dip",
  displayLines: ["SAYKAT", "DIP"],
  displayYear: "(’25)",
  headline:
    "Full-Stack Software Engineer — Backend Systems, Real-Time Web & Automation",
  aboutLabel: "(ABOUT)",
  about:
    "Building reliable platforms every product team deserves to ship — real-time systems, clean backends, interfaces that convert.",
  summary:
    "I architect custom web platforms, real-time multiplayer and ad-tech systems, and automated Node.js pipelines. Focused on clean backend logic, scalable data structures, and interfaces that convert.",
  primaryCta: { label: "View Case Studies", href: "#work" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
  contactCta: { label: "Contact Us", href: "#contact" },
  bookCta: { label: "Book A Call", href: "#contact" },
  dateLine: "Sunday / Open to roles — 2026",
  availability: "We’re available / for you",
  badge: "True Growth",
  brandPlate: "SAYKAT",
  photo: {
    src: "/saykat.png",
    alt: "Saykat Nandi Dip",
  },
  partners: ["Node", "PHP", "React", "MySQL", "Pusher", "Git"],
  partnerStat: { value: 4, suffix: "+", label: "Flagship Systems" },
  projectStat: {
    value: 60,
    suffix: "+",
    label: "Automated product bundles shipped",
    feed: "Automation · Pipeline",
  },
  feature: {
    eyebrow: "Out Now",
    title: "Live Architecture",
    year: "[2025]",
    progress: 0.35,
  },
  marks: ["Node.js", "PHP", "React"],
  previewSnippet: `// real-time match lobby sync
socket.on("match:state", (payload) => {
  escrow.lock(payload.entryFee);
  bracket.advance(payload.winnerId);
  room.broadcast({ status: "LIVE" });
});`,
};

export const about = {
  id: "about",
  eyebrow: "About",
  title: "Engineering with business logic in mind",
  paragraphs: [
    "I am a Full-Stack Software Engineer with production experience shipping custom web applications and backend architectures for an international technology team in Cyprus.",
    "My work sits at the intersection of complex business logic and interactive user interfaces—from building real-time esports tournament engines and escrow payment flows to designing ad-control panels with anti-bot metric verification and headless Node.js automation tools. Alongside engineering, my background in Business Administration shapes how I build: I care about monetization mechanics, user retention, and shipping software that solves measurable operational problems rather than writing code for its own sake.",
    "Outside of web architecture, I spend my time building custom embedded hardware and audio systems—working with Arduino microcontrollers, optical encoders, and acoustic enclosures.",
  ],
};

export const caseStudies: CaseStudy[] = [
  {
    id: "golive-gaming",
    number: "01",
    title: "GoLive Gaming — Ad-Tech & Live Stream Monetization Engine",
    role: "Lead Full-Stack Developer",
    stack: [
      "PHP",
      "JavaScript",
      "REST APIs",
      "Real-Time Analytics",
      "Custom Ad-Serving Logic",
    ],
    problem:
      "Gaming creators and advertisers needed a self-serve system to boost posts and run live-stream ad integrations without inflated or fraudulent engagement metrics.",
    built: [
      "Engineered an end-to-end Ad Control Panel enabling campaign creation, budget allocation, and post-boosting workflows.",
      "Built anti-bot metric verification to filter non-human traffic and validate genuine impressions and clicks before billing or reporting.",
      "Integrated live-stream ad triggers capable of syncing promotional overlays with active creator broadcasts.",
    ],
    liveUrl: "",
    sourceUrl: "",
    videoUrl: "",
    diagramLabel: "Ad verify → bill → overlay",
    codeSnippet: `if (!botGuard.isHuman(event)) return reject();
metrics.recordGenuine(event);
billing.charge(campaignId, event.cost);`,
  },
  {
    id: "esports-arena",
    number: "02",
    title: "Esports Arena — Tournament, Matchmaking & Escrow System",
    role: "Full-Stack Architect",
    stack: [
      "PHP",
      "JavaScript",
      "WebSockets (Pusher)",
      "Relational Database Design",
      "Payment/Escrow Logic",
    ],
    problem:
      "Competitive online tournaments require strict state synchronization, dispute handling, and secure entry-fee handling so players cannot manipulate brackets or payouts.",
    built: [
      "Architected a multi-tier tournament bracket generator supporting 1v1 duels, automated progression, and live match-room lobbies powered by WebSockets.",
      "Implemented an internal coin-escrow and wallet system to lock entry fees during active matches and release payouts upon verified completion.",
      "Built KYC identity verification workflows and a live moderation dashboard for real-time dispute resolution.",
    ],
    liveUrl: "",
    sourceUrl: "",
    videoUrl: "",
    diagramLabel: "Lobby → escrow → bracket → payout",
    codeSnippet: `await wallet.lock(entryFee, matchId);
await bracket.seed(players);
pusher.trigger(room, "match:live", state);`,
  },
  {
    id: "form-pipeline",
    number: "03",
    title: "Automated Digital Product & Form Packaging Pipeline",
    role: "Creator & Developer",
    stack: [
      "Node.js",
      "Puppeteer",
      "Headless Browser Automation",
      "E-Commerce APIs",
    ],
    problem:
      "Manually generating, validating, and packaging dozens of customized web form assets for digital storefront distribution was repetitive and prone to formatting errors.",
    built: [
      "Developed an automated Node.js and Puppeteer pipeline that programmatically generates, renders, and packages 60+ web form bundles into ready-to-sell digital products.",
      "Reduced hours of manual assembly and QA checks down to a single repeatable script execution.",
    ],
    liveUrl: "",
    sourceUrl: "",
    videoUrl: "",
    diagramLabel: "Generate → render → package → ship",
    codeSnippet: `for (const form of catalog) {
  const html = await render(form);
  await packageBundle(html, form.sku);
}`,
  },
  {
    id: "social-engine",
    number: "04",
    title: "Multi-Entity Social Networking Engine",
    role: "Backend & Frontend Developer",
    stack: [
      "PHP",
      "JavaScript",
      "Alpine.js",
      "Tailwind CSS",
      "Custom Relational Schema",
    ],
    problem:
      "Standard user-only social architectures do not allow brands, teams, or communities to operate independently with separate follower graphs and permissions.",
    built: [
      "Designed a custom data model supporting independent Page entities capable of publishing posts, managing followers, and handling nested comments and reactions separately from personal user accounts.",
    ],
    liveUrl: "",
    sourceUrl: "",
    videoUrl: "",
    diagramLabel: "User ⇄ Page graphs + permissions",
    codeSnippet: `pages.hasMany(posts);
pages.belongsToMany(followers);
acl.authorize(actor, page, action);`,
  },
];

export const techStack: TechGroup[] = [
  {
    title: "Frontend & Interactive UI",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Alpine.js",
      "HTML5",
      "CSS3",
    ],
  },
  {
    title: "Backend & Real-Time Systems",
    items: [
      "Node.js",
      "PHP",
      "REST API Design",
      "WebSockets (Pusher)",
      "Custom Auth & KYC Workflows",
      "Escrow & Wallet Logic",
    ],
  },
  {
    title: "Data & Platform Architecture",
    items: [
      "Relational Database Modeling (MySQL / PostgreSQL)",
      "Custom CMS & Plugin Architecture",
      "WooCommerce / Payment Integrations",
    ],
  },
  {
    title: "Automation & Tooling",
    items: [
      "Puppeteer (Headless Browser Scripting)",
      "Git",
      "Linux / Local Server Environments",
      "Automated Build Pipelines",
    ],
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "International Technology Team",
    role: "Full-Stack Software Engineer",
    period: "2023 — Present",
    location: "Cyprus (Remote)",
    bullets: [
      "Architected and shipped production web platforms spanning ad-tech monetization, real-time multiplayer state, and escrow-backed competitive flows.",
      "Owned end-to-end delivery of backend services, relational schemas, and operator dashboards used by creators, moderators, and advertisers.",
      "Collaborated asynchronously with remote project managers and designers across time zones, translating messy product requirements into reliable release cycles.",
    ],
  },
  {
    company: "Independent Engineering",
    role: "Systems & Automation Developer",
    period: "Ongoing",
    location: "Remote",
    bullets: [
      "Built headless Node.js automation pipelines that cut repetitive digital-product packaging from hours of manual QA to a single script run.",
      "Designed custom data models and permission layers for multi-entity social architectures beyond standard user-only schemas.",
    ],
  },
];

export const lab: LabItem[] = [
  {
    title: "DIY Force-Feedback Racing Simulator Wheel",
    description:
      "Engineered a custom sim-racing wheel using an Arduino Leonardo, a high-torque 775 DC motor, paddle shifters, and an LPD3806 optical rotary encoder to translate game telemetry into real-time physical steering resistance.",
  },
  {
    title: "Custom Dual-MTM Acoustic Tower System",
    description:
      "Designed and built dual mid-woofer-tweeter-mid-woofer (MTM) tower speakers paired with a 12-inch subwoofer and 2.1 amplification, tuning enclosure volume and crossover response.",
  },
  {
    title: "Thermoelectric Active Cooling Rigs",
    description:
      "Prototyped custom Peltier-based active cooling hardware to manage sustained thermal loads on mobile processors.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Saykat takes messy product requirements and turns them into working systems without constant hand-holding. Deadlines stuck, and the escrow and matchmaking logic held up under real tournament traffic.",
    name: "Alex Morgan",
    title: "Product Lead — Placeholder Client",
  },
  {
    quote:
      "Clear async communication, sharp backend instincts, and a habit of flagging edge cases before they become incidents. The ad-control work shipped cleaner than our previous vendor cycle.",
    name: "Jordan Lee",
    title: "Founder — Placeholder Studio",
  },
  {
    quote:
      "Rare mix of full-stack delivery and business awareness. He asked the right monetization questions early and built dashboards operators could actually run day-to-day.",
    name: "Sam Rivera",
    title: "Project Manager — Placeholder Team",
  },
];

export const contact = {
  id: "contact",
  eyebrow: "Contact",
  title: "Let's build something reliable",
  availability: "Open to full-time roles, contract work, and select freelance builds",
  email: "hello@saykat.dev",
  note: "Prefer email? One click copies the address. Or send a short note below.",
  form: {
    nameLabel: "Name",
    emailLabel: "Email",
    detailsLabel: "Project / role details",
    submitLabel: "Send message",
  },
};
