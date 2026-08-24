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
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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
    name: "Guest User",
    email: "",
    plan: "Free Tier",
    dailyUsageLimit: 50,
    usageToday: 0,
    totalExecutions: 0,
    favoriteTools: [],
    memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
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

// Initial Community Feedback seed - empty by default (Real data only)
export const INITIAL_FEEDBACK: FeedbackItem[] = [];

export const getStoredFeedback = (): FeedbackItem[] => {
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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

// Tool suggestions seed - empty by default (Real data only)
export const INITIAL_SUGGESTIONS: ToolSuggestion[] = [];

export const getStoredSuggestions = (): ToolSuggestion[] => {
  try {
    const data = localStorage.getItem(SUGGESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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
