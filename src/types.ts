export type ToolCategory =
  | "pdf"
  | "image"
  | "qr"
  | "text"
  | "developer"
  | "seo"
  | "website"
  | "network"
  | "security"
  | "calculators"
  | "writing"
  | "coding"
  | "media"
  | "social"
  | "productivity"
  | "utilities"
  | "business"
  | "student";

export type SEOPageType =
  | "PUBLIC_INDEXABLE"
  | "PUBLIC_NON_INDEXABLE"
  | "PRIVATE"
  | "NOT_FOUND"
  | "REDIRECT";

export type ToolStatus = "ACTIVE" | "DISABLED" | "BROKEN" | "NEEDS_REVIEW";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  count: number;
  color: string;
}

export interface ToolOptionsConfig {
  hasTone?: boolean;
  hasLength?: boolean;
  hasLanguage?: boolean;
  hasFormat?: boolean;
  hasTemperature?: boolean;
  customFields?: {
    id: string;
    label: string;
    type: "text" | "select" | "textarea";
    options?: string[];
    placeholder?: string;
    defaultValue?: string;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolSEOContent {
  metaTitle: string;
  metaDescription: string;
  overview: string;
  problemSolved?: string;
  targetAudience?: string;
  howItWorks?: string;
  outputExpectation?: string;
  commonMistakes?: string[];
  processingType?: "CLIENT_SIDE_BROWSER" | "SERVER_SIDE_AI";
  processingDetails?: string;
  useCases: string[];
  keyFeatures: string[];
  howToUseSteps: string[];
  faqs: FAQItem[];
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  subcategory?: string;
  iconName: string;
  tags: string[];
  isTrending?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  showOnHomepage?: boolean;
  isActive?: boolean;
  status?: ToolStatus;
  route?: string;
  searchKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  rating: number;
  ratingCount: number;
  usageCount: number;
  inputLabel: string;
  inputPlaceholder: string;
  defaultPrompt?: string;
  optionsConfig: ToolOptionsConfig;
  seoContent: ToolSEOContent;
}

export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  prompt: string;
  output: string;
  timestamp: string;
  wordCount: number;
  executionTimeMs: number;
  options?: Record<string, any>;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  category: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: "Informational" | "Commercial Investigation" | "Transactional / How-to";
  author: {
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  date: string;
  updatedDate?: string;
  readTime: string;
  tags: string[];
  image: string;
  faqs?: FAQItem[];
  relatedToolIds?: string[];
  relatedArticleSlugs?: string[];
}

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Under Review" | "In Progress" | "Completed" | "Planned";
  votes: number;
  author: string;
  createdAt: string;
}

export interface ToolSuggestion {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  priority: "Low" | "Medium" | "High";
  votes: number;
  status: "Pending" | "Approved" | "Building";
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: "Free Tier" | "Pro Pass" | "Enterprise";
  dailyUsageLimit: number;
  usageToday: number;
  totalExecutions: number;
  favoriteTools: string[];
  memberSince: string;
  theme: "dark" | "light" | "system";
}
