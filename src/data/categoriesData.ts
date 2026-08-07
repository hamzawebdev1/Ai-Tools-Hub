import { CategoryInfo } from "../types";
import { getCategoryCounts } from "../services/toolRegistryService";

export const RAW_CATEGORIES: CategoryInfo[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge, split, compress, convert, unlock, protect, rotate, crop, and OCR PDF documents client-side.",
    iconName: "FileText",
    count: 40,
    color: "from-red-500 to-rose-600",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image-tools",
    description: "Resize, compress, crop, rotate, flip, filter, watermark, convert formats, pick colors, and generate icons.",
    iconName: "Image",
    count: 70,
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "text",
    name: "Text & String Tools",
    slug: "text-string-tools",
    description: "Count words, convert case, generate lorem ipsum, clean formatting, hash, encode/decode, and analyze text.",
    iconName: "Type",
    count: 67,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Format JSON, XML, SQL, YAML, minify code, test Regex, decode JWTs, convert timestamps, and test APIs.",
    iconName: "Code",
    count: 75,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "seo",
    name: "SEO & SERP Tools",
    slug: "seo-serp-tools",
    description: "Generate meta tags, Open Graph cards, Schema.org markup, robots.txt, sitemaps, analyze keyword density.",
    iconName: "TrendingUp",
    count: 43,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "website",
    name: "Website & Webmaster Tools",
    slug: "website-tools",
    description: "Inspect website status, validate URLs, check SSL certificates, test HTTP headers, analyze performance.",
    iconName: "Globe",
    count: 21,
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "network",
    name: "Network & IP Tools",
    slug: "network-tools",
    description: "Subnet calculator, IP address inspector, ping test, DNS lookup, WHOIS query, port checker.",
    iconName: "Wifi",
    count: 18,
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "security",
    name: "Security & Cryptography",
    slug: "security-tools",
    description: "Generate hashes (SHA-256/512, MD5, HMAC), encrypt/decrypt, test passwords, generate UUIDs & keys.",
    iconName: "Shield",
    count: 16,
    color: "from-rose-500 to-red-600",
  },
  {
    id: "calculators",
    name: "Calculators & Converters",
    slug: "calculators-converters",
    description: "Age, BMI, EMI loan, mortgage, financial, unit conversion, scientific, date difference, tax, and fuel calculators.",
    iconName: "Calculator",
    count: 129,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "qr",
    name: "QR & Barcode Tools",
    slug: "qr-barcode-tools",
    description: "Generate and scan custom high-resolution QR codes, WiFi credentials, vCards, and barcodes instantly.",
    iconName: "QrCode",
    count: 17,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "utilities",
    name: "File & Data Utilities",
    slug: "file-data-utilities",
    description: "Inspect file metadata, checksums, base64 encoding, ZIP archives, CSV/JSON/XML converters, and document utilities.",
    iconName: "Archive",
    count: 19,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "media",
    name: "Audio, Video & Media Tools",
    slug: "audio-video-media-tools",
    description: "Convert, trim, cut, merge, compress, adjust volume, extract frames, create GIFs, analyze metadata & waveforms browser-side.",
    iconName: "Video",
    count: 68,
    color: "from-fuchsia-500 to-rose-600",
  },
];

// Returns dynamically counted category list
export function getDynamicCategories(): CategoryInfo[] {
  const liveCounts = getCategoryCounts();
  return RAW_CATEGORIES.map((cat) => ({
    ...cat,
    count: liveCounts[cat.id] || 0,
  }));
}

export const CATEGORIES_DATA: CategoryInfo[] = getDynamicCategories();
