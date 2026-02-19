import { Category, Product, Review } from "@/lib/types";

const nowIso = new Date().toISOString();

const categoryDefinitions: Array<Omit<Category, "id" | "created_at"> & { id: string; titleSeed: string }> = [
  {
    id: "cat-social-media-assets",
    name: "Social Media Assets",
    slug: "social-media-assets",
    description: "Luxury social media packs engineered to maximize engagement and authority.",
    accent: "#8b5cf6",
    titleSeed: "Social Media Vault"
  },
  {
    id: "cat-e-books",
    name: "E-books",
    slug: "e-books",
    description: "Persuasive, high-converting digital books for creators and operators.",
    accent: "#f5c451",
    titleSeed: "Knowledge Blueprint"
  },
  {
    id: "cat-business-templates",
    name: "Business Templates",
    slug: "business-templates",
    description: "Executive-grade templates to help founders launch and scale faster.",
    accent: "#6d28d9",
    titleSeed: "Business Framework"
  },
  {
    id: "cat-programming-scripts",
    name: "Programming Scripts",
    slug: "programming-scripts",
    description: "Production-ready scripts and automations built for modern teams.",
    accent: "#f59e0b",
    titleSeed: "Code Accelerator"
  },
  {
    id: "cat-graphic-design",
    name: "Graphic Design",
    slug: "graphic-design",
    description: "Premium design resources crafted for brand impact and speed.",
    accent: "#a855f7",
    titleSeed: "Design Prestige Kit"
  }
];

const titleLeads = [
  "Elite",
  "Imperial",
  "Royal",
  "Prestige",
  "Signature",
  "Prime",
  "Apex",
  "Noble",
  "Founders'",
  "Executive",
  "Infinite",
  "Velocity",
  "Growth",
  "Authority",
  "Platinum",
  "Command",
  "Legacy",
  "Momentum",
  "Quantum",
  "Visionary"
];

const titleClosers = [
  "Master Suite",
  "Conversion Edition",
  "Revenue Kit",
  "Launch Collection",
  "Scale Pack",
  "Authority Bundle",
  "Premium System",
  "Pro Toolkit",
  "Performance Stack",
  "Monetization Engine",
  "Accelerator Vault",
  "Luxury Bundle",
  "Executive Blueprint",
  "Profit Sprint",
  "Creator Arsenal",
  "High-Ticket Formula",
  "Impact Framework",
  "Growth Engine",
  "Domination Pack",
  "Smart Asset Vault"
];

const paragraphHooks = [
  "Built for ambitious operators, this product gives you a polished foundation that instantly elevates brand perception.",
  "Every element was crafted to look premium out of the box, so you can launch with confidence and skip low-quality guesswork.",
  "Designed for digital entrepreneurs, this asset combines aesthetics and conversion psychology in a single ready-to-use package.",
  "If you want to move faster while maintaining a luxury brand image, this resource becomes your unfair advantage from day one.",
  "Engineered for modern creators, it transforms scattered ideas into a clear, profitable system that is easy to execute."
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildDescription(title: string, categoryName: string, index: number): string {
  const hook = paragraphHooks[index % paragraphHooks.length];
  const second = `Inside "${title}", you get structured components that reduce production time, improve visual consistency, and help your ${categoryName.toLowerCase()} workflow feel enterprise-ready. Instead of rebuilding from scratch, you deploy a refined system that supports higher pricing and stronger customer trust.`;
  const third = `Use it as your plug-and-play growth layer: deploy quickly, customize the details, and position your offer like a premium brand. The result is faster execution, cleaner delivery, and a storefront experience that feels worthy of a 10,000 SAR build budget.`;

  return `${hook}\n\n${second}\n\n${third}`;
}

const generatedProducts: Product[] = categoryDefinitions.flatMap((category, categoryIndex) => {
  return Array.from({ length: 20 }, (_, index) => {
    const title = `${titleLeads[index]} ${category.titleSeed} ${titleClosers[(index + categoryIndex * 3) % titleClosers.length]}`;
    const slugBase = slugify(`${category.slug}-${title}-${index + 1}`);
    const price = 50 + ((categoryIndex * 67 + index * 29) % 451);
    return {
      id: `prod-${category.slug}-${String(index + 1).padStart(2, "0")}`,
      category_id: category.id,
      category_slug: category.slug,
      slug: slugBase,
      title,
      description: buildDescription(title, category.name, index),
      price_sar: price,
      download_link: `https://downloads.vanguard-digital.com/${category.slug}/${slugBase}.zip`,
      image_url: `https://picsum.photos/seed/vanguard-${category.slug}-${index + 1}/1280/860`,
      featured: index < 3 || index % 9 === 0,
      created_at: nowIso
    };
  });
});

export const seedCategories: Category[] = categoryDefinitions.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  accent: category.accent,
  created_at: nowIso
}));

export const seedProducts: Product[] = generatedProducts;

export const seedReviews: Review[] = [
  {
    id: "review-1",
    name: "Lina Al-Mutairi",
    title: "Founder, Noor Studio",
    rating: 5,
    quote: "Vanguard Digital made our launch feel like a luxury brand debut. The templates paid for themselves in less than a week."
  },
  {
    id: "review-2",
    name: "Omar Bennett",
    title: "Growth Consultant",
    rating: 5,
    quote: "The assets are conversion-focused and visually elite. My clients immediately noticed the difference in perceived value."
  },
  {
    id: "review-3",
    name: "Sara Haddad",
    title: "E-commerce Strategist",
    rating: 5,
    quote: "Clean systems, premium visuals, and zero fluff. This is what a professional digital marketplace should feel like."
  }
];

export const simulatedBuyerNames = [
  "Amal from Riyadh",
  "Khalid from Jeddah",
  "Noura from Dammam",
  "Faisal from Makkah",
  "Yasmin from Dubai",
  "Hassan from Abu Dhabi",
  "Mariam from Doha",
  "Tariq from Kuwait City"
];
