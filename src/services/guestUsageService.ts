// Guest usage tracking service with daily rotation per tool
const GUEST_STORAGE_KEY = "ai_tools_guest_usage_v1";
export const MAX_GUEST_DAILY_PER_TOOL = 3;

interface GuestUsageData {
  date: string;
  tools: Record<string, number>;
}

const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getStoredGuestData = (): GuestUsageData => {
  const today = getTodayString();
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      const parsed: GuestUsageData = JSON.parse(raw);
      if (parsed.date === today && parsed.tools && typeof parsed.tools === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse guest usage storage", e);
  }
  return { date: today, tools: {} };
};

const saveGuestData = (data: GuestUsageData): void => {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write guest usage storage", e);
  }
};

/**
 * Gets the number of operations used by a guest user for a specific tool today.
 */
export const getGuestUsageCount = (toolId: string): number => {
  const data = getStoredGuestData();
  return data.tools[toolId] || 0;
};

/**
 * Gets the remaining guest operations allowed for a specific tool today.
 * Returns Infinity if user is logged in.
 */
export const getRemainingGuestUsage = (toolId: string, isLoggedIn: boolean): number => {
  if (isLoggedIn) return Infinity;
  const count = getGuestUsageCount(toolId);
  return Math.max(0, MAX_GUEST_DAILY_PER_TOOL - count);
};

/**
 * Checks whether a guest can execute the specified tool.
 * Logged in users always return true (unlimited).
 */
export const canGuestExecute = (toolId: string, isLoggedIn: boolean): boolean => {
  if (isLoggedIn) return true;
  return getGuestUsageCount(toolId) < MAX_GUEST_DAILY_PER_TOOL;
};

/**
 * Increments the guest usage counter for a specific tool.
 * Returns the new usage count for that tool today.
 */
export const incrementGuestUsage = (toolId: string, isLoggedIn: boolean): number => {
  if (isLoggedIn) return 0;
  const data = getStoredGuestData();
  const current = data.tools[toolId] || 0;
  const updatedCount = current + 1;
  data.tools[toolId] = updatedCount;
  saveGuestData(data);
  return updatedCount;
};
