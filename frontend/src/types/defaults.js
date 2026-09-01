export const DEFAULT_SIGNATURE = {
  title: "My Professional Signature",
  full_name: "Alex Morgan",
  job_title: "Head of Product Security",
  department: "Security & Compliance",
  company: "Endor Labs",
  email: "alex.morgan@endorlabs.com",
  phone: "+1 (415) 555-0142",
  mobile: "+1 (415) 555-0199",
  website: "https://endorlabs.com",
  address: "702 Marshall St, Redwood City, CA",
  
  template_id: "modern_horizon",
  primary_color: "#0284c7", // Endor Blue
  secondary_color: "#475569",
  font_family: "Arial, Helvetica, sans-serif",
  
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  logo_url: "/logos/endor-labs-logo-2.png",
  banner_url: "",
  
  social_links: JSON.stringify({
    linkedin: "https://linkedin.com/company/endor-labs",
    twitter: "https://x.com/endorlabs",
    github: "https://github.com/endorlabs",
    youtube: "",
    instagram: "",
  }),
  
  disclaimer: "Confidentiality Note: The information contained in this email is legally privileged and strictly confidential.",
  custom_cta_text: "Schedule a Demo",
  custom_cta_url: "https://endorlabs.com/demo",
};

export const TEMPLATES = [
  {
    id: "modern_horizon",
    name: "Modern Horizon",
    description: "Sleek horizontal layout with accent bar, photo, logo and inline social icons.",
    badge: "Popular"
  },
  {
    id: "corporate_classic",
    name: "Corporate Classic",
    description: "Standard 2-column table layout with vertical divider, high compatibility with all Outlook versions.",
    badge: "Enterprise"
  },
  {
    id: "minimal_clean",
    name: "Minimalist Clean",
    description: "Compact, text-driven design without clutter for clean everyday communication.",
    badge: "Simple"
  },
  {
    id: "branded_card",
    name: "Branded Card",
    description: "Card-style framing with company logo header and highlighted CTA link button.",
    badge: "Creative"
  },
  {
    id: "compact_pro",
    name: "Compact Pro",
    description: "Space-saving single line layout perfect for email reply chains and mobile devices.",
    badge: "Compact"
  }
];

export const COLOR_PALETTES = [
  { name: "Endor Blue", hex: "#0284c7" },
  { name: "Indigo Tech", hex: "#4f46e5" },
  { name: "Cyber Emerald", hex: "#059669" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Amber Gold", hex: "#d97706" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Slate Dark", hex: "#1e293b" },
  { name: "Charcoal", hex: "#334155" },
];

export const FONT_OPTIONS = [
  { label: "Arial (Recommended for Email)", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Lucida Sans Unicode, sans-serif" },
  { label: "Georgia (Serif)", value: "Georgia, Times New Roman, serif" },
  { label: "Tahoma", value: "Tahoma, Verdana, sans-serif" },
  { label: "Courier New (Monospace)", value: "'Courier New', Courier, monospace" },
];
