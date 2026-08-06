export type ToolCategory =
  | "pdf"
  | "image"
  | "qr"
  | "text"
  | "developer"
  | "seo"
  | "writing"
  | "coding"
  | "media"
  | "social"
  | "productivity"
  | "utilities"
  | "business";

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
  iconName: string;
  tags: string[];
  isTrending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
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
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  image: string;
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
