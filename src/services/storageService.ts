import { HistoryItem, UserProfile, FeedbackItem, ToolSuggestion } from "../types";

const HISTORY_KEY = "ai_tools_history";
const FAVORITES_KEY = "ai_tools_favorites";
const PROFILE_KEY = "ai_tools_user_profile";
const THEME_KEY = "ai_tools_theme_mode";
const FEEDBACK_KEY = "ai_tools_feedback_items";
const SUGGESTIONS_KEY = "ai_tools_tool_suggestions";

export const getStoredTheme = (): "dark" | "light" => {
  return getThemeMode();
};

export const toggleStoredFavorite = (toolId: string): string[] => {
  return toggleFavoriteTool(toolId);
};

export const getStoredHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveHistoryItem = (item: HistoryItem): HistoryItem[] => {
  const history = getStoredHistory();
  const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("LocalStorage full or disabled", e);
  }
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const removeHistoryItem = (id: string): HistoryItem[] => {
  const history = getStoredHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const getStoredFavorites = (): string[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : ["ai-paraphraser", "ai-code-assistant", "ai-text-summarizer"];
  } catch {
    return ["ai-paraphraser", "ai-code-assistant"];
  }
};

export const toggleFavoriteTool = (toolId: string): string[] => {
  const favorites = getStoredFavorites();
  const exists = favorites.includes(toolId);
  const updated = exists ? favorites.filter((id) => id !== toolId) : [...favorites, toolId];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update favorites", e);
  }
  return updated;
};

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Fallback
  }

  const defaultProfile: UserProfile = {
    name: "AI Power User",
    email: "user@aitoolshub.com",
    plan: "Free Tier",
    dailyUsageLimit: 50,
    usageToday: 4,
    totalExecutions: 28,
    favoriteTools: getStoredFavorites(),
    memberSince: "August 2026",
    theme: "dark",
  };
  return defaultProfile;
};

export const updateStoredProfile = (updatedProfile: Partial<UserProfile>): UserProfile => {
  const current = getStoredProfile();
  const merged = { ...current, ...updatedProfile };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  return merged;
};

export const getThemeMode = (): "dark" | "light" => {
  try {
    const mode = localStorage.getItem(THEME_KEY);
    if (mode === "dark" || mode === "light") return mode;
  } catch {
    // fallback
  }
  return "dark";
};

export const setThemeMode = (mode: "dark" | "light"): void => {
  localStorage.setItem(THEME_KEY, mode);
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initial Community Feedback seed
export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: "f1",
    title: "Add export to PDF for summarized articles",
    description: "It would be great if the AI Article Summarizer had a direct PDF download button with formatted typography.",
    category: "Feature Request",
    status: "In Progress",
    votes: 84,
    author: "DevPro_99",
    createdAt: "2 days ago",
  },
  {
    id: "f2",
    title: "Dark mode background contrast improvement",
    description: "The glass cards look amazing in dark mode, but consider making code blocks even higher contrast.",
    category: "UI Design",
    status: "Completed",
    votes: 112,
    author: "UI_Guru",
    createdAt: "5 days ago",
  },
  {
    id: "f3",
    title: "Support for custom prompt templates in Code Assistant",
    description: "Allow saving custom prompt presets like 'Generate React 19 Hook with TypeScript'.",
    category: "Feature Request",
    status: "Planned",
    votes: 49,
    author: "Sarah_Dev",
    createdAt: "1 week ago",
  },
];

export const getStoredFeedback = (): FeedbackItem[] => {
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    return data ? JSON.parse(data) : INITIAL_FEEDBACK;
  } catch {
    return INITIAL_FEEDBACK;
  }
};

export const addFeedbackItem = (title: string, description: string, category: string): FeedbackItem[] => {
  const items = getStoredFeedback();
  const newItem: FeedbackItem = {
    id: "f_" + Date.now(),
    title,
    description,
    category,
    status: "Under Review",
    votes: 1,
    author: "You",
    createdAt: "Just now",
  };
  const updated = [newItem, ...items];
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  return updated;
};

export const voteFeedback = (id: string): FeedbackItem[] => {
  const items = getStoredFeedback();
  const updated = items.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item));
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  return updated;
};

// Tool suggestions seed
export const INITIAL_SUGGESTIONS: ToolSuggestion[] = [
  {
    id: "s1",
    title: "AI YouTube Transcript Summarizer & Chapters",
    description: "Paste a YouTube video URL to extract transcript, key takeaways, and timestamped chapter markers.",
    category: "productivity",
    priority: "High",
    votes: 142,
    status: "Building",
    createdAt: "3 days ago",
  },
  {
    id: "s2",
    title: "Regex Pattern & Expression Generator",
    description: "Type plain English requirements (e.g. match valid international phone numbers) and get validated RegEx.",
    category: "coding",
    priority: "Medium",
    votes: 78,
    status: "Approved",
    createdAt: "6 days ago",
  },
];

export const getStoredSuggestions = (): ToolSuggestion[] => {
  try {
    const data = localStorage.getItem(SUGGESTIONS_KEY);
    return data ? JSON.parse(data) : INITIAL_SUGGESTIONS;
  } catch {
    return INITIAL_SUGGESTIONS;
  }
};

export const addToolSuggestion = (title: string, description: string, category: any, priority: any): ToolSuggestion[] => {
  const items = getStoredSuggestions();
  const newItem: ToolSuggestion = {
    id: "s_" + Date.now(),
    title,
    description,
    category,
    priority,
    votes: 1,
    status: "Pending",
    createdAt: "Just now",
  };
  const updated = [newItem, ...items];
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(updated));
  return updated;
};
