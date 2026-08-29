import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { KeywordItem, SEO_KEYWORDS_DATA } from "../data/keywordsData";

const COLLECTION_NAME = "keywords";
const STORAGE_KEY = "mehzan_seo_keywords_db";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getKeywordsFromStorage(): KeywordItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEO_KEYWORDS_DATA));
      return SEO_KEYWORDS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Error reading keywords from local storage:", err);
  }
  return SEO_KEYWORDS_DATA;
}

export function saveKeywordsToStorage(keywords: KeywordItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
  } catch (err) {
    console.error("Error saving keywords to local storage:", err);
  }
}

/**
 * Seed initial SEO keywords dataset to Firestore if empty
 */
async function seedInitialKeywordsToFirestore(): Promise<KeywordItem[]> {
  const seededList: KeywordItem[] = [];
  for (const item of SEO_KEYWORDS_DATA) {
    try {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item, { merge: true });
      seededList.push(item);
    } catch (err) {
      console.warn(`Failed to seed keyword ${item.id} to Firestore:`, err);
    }
  }
  return seededList.length > 0 ? seededList : SEO_KEYWORDS_DATA;
}

/**
 * Fetch all keywords from Firestore database (with fallback to storage / seed)
 */
export async function fetchKeywordsFromDB(): Promise<KeywordItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      console.log("Firestore keywords collection empty. Seeding initial keywords...");
      const seeded = await seedInitialKeywordsToFirestore();
      saveKeywordsToStorage(seeded);
      return seeded;
    }

    const items: KeywordItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as KeywordItem);
    });

    saveKeywordsToStorage(items);
    return items;
  } catch (error) {
    console.error("Failed to fetch keywords from Firestore DB, falling back to local cache:", error);
    try {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    } catch (e) {
      // Return local cache on catch if needed
    }
    return getKeywordsFromStorage();
  }
}

/**
 * Real-time subscription to Firestore keywords collection
 */
export function subscribeToKeywordsDB(onUpdate: (items: KeywordItem[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      if (snapshot.empty) {
        // If snapshot is empty, seed initial data
        seedInitialKeywordsToFirestore().then((seeded) => onUpdate(seeded));
        return;
      }
      const items: KeywordItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as KeywordItem);
      });
      saveKeywordsToStorage(items);
      onUpdate(items);
    },
    (error) => {
      console.error("Firestore keyword subscription error:", error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    }
  );
}

/**
 * Add a new keyword item to Firestore database
 */
export async function addKeywordItem(item: Omit<KeywordItem, "id">): Promise<KeywordItem> {
  const newId = `kw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newItem: KeywordItem = {
    ...item,
    id: newId,
    suggestedPage: item.suggestedPage || (item.mappedToolSlug ? `/${item.mappedToolSlug}` : item.mappedArticleSlug ? `/blog/${item.mappedArticleSlug}` : "/"),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, newItem.id);
    await setDoc(docRef, newItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${newItem.id}`);
  }

  // Also update local storage cache
  const current = getKeywordsFromStorage();
  saveKeywordsToStorage([newItem, ...current.filter((k) => k.id !== newItem.id)]);

  return newItem;
}

/**
 * Update an existing keyword item in Firestore database
 */
export async function updateKeywordItem(id: string, updates: Partial<KeywordItem>): Promise<KeywordItem | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updatedPayload = {
    ...updates,
    suggestedPage: updates.suggestedPage || (updates.mappedToolSlug ? `/${updates.mappedToolSlug}` : updates.mappedArticleSlug ? `/blog/${updates.mappedArticleSlug}` : "/"),
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(docRef, updatedPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }

  // Update local storage cache
  const current = getKeywordsFromStorage();
  const idx = current.findIndex((k) => k.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...updatedPayload };
    saveKeywordsToStorage(current);
    return current[idx];
  }
  return null;
}

/**
 * Delete a keyword item from Firestore database
 */
export async function deleteKeywordItem(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }

  // Update local storage cache
  const current = getKeywordsFromStorage();
  const filtered = current.filter((k) => k.id !== id);
  saveKeywordsToStorage(filtered);
  return true;
}

/**
 * Bulk import keyword items into Firestore database
 */
export async function bulkImportKeywords(items: Partial<KeywordItem>[]): Promise<number> {
  const current = getKeywordsFromStorage();
  let importedCount = 0;

  for (const item of items) {
    if (!item.keyword?.trim()) continue;

    const exists = current.some((c) => c.keyword.toLowerCase().trim() === item.keyword!.toLowerCase().trim());
    if (exists) continue;

    const newId = `kw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: KeywordItem = {
      id: newId,
      keyword: item.keyword.trim(),
      category: item.category || "PDF Tools",
      searchIntent: item.searchIntent || "Transactional",
      keywordType: item.keywordType || "Primary",
      trendStatus: item.trendStatus || "STABLE",
      searchVolumeNote: item.searchVolumeNote || "Search volume not verified",
      contentOpportunity: item.contentOpportunity || "Tool page optimization",
      priority: item.priority || "Medium",
      status: item.status || "Active",
      mappedToolSlug: item.mappedToolSlug || "",
      mappedArticleSlug: item.mappedArticleSlug || "",
      suggestedPage: item.suggestedPage || (item.mappedToolSlug ? `/${item.mappedToolSlug}` : item.mappedArticleSlug ? `/blog/${item.mappedArticleSlug}` : "/"),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, COLLECTION_NAME, newId), newItem);
      importedCount++;
    } catch (err) {
      console.error(`Failed to bulk import item ${newItem.keyword}:`, err);
    }
  }

  // Sync back all keywords
  await fetchKeywordsFromDB();
  return importedCount;
}

/**
 * Calculate keyword analytics & stats
 */
export function getKeywordAnalyticsStats(list?: KeywordItem[]) {
  const keywords = list || getKeywordsFromStorage();

  const total = keywords.length;
  const trending = keywords.filter((k) => k.trendStatus === "TRENDING").length;
  const rising = keywords.filter((k) => k.trendStatus === "RISING").length;
  const stable = keywords.filter((k) => k.trendStatus === "STABLE").length;
  const unverified = keywords.filter((k) => k.searchVolumeNote?.toLowerCase().includes("not verified") || k.trendStatus === "UNKNOWN").length;
  const mappedToTools = keywords.filter((k) => !!k.mappedToolSlug).length;
  const mappedToArticles = keywords.filter((k) => !!k.mappedArticleSlug).length;

  return {
    total,
    trending,
    rising,
    stable,
    unverified,
    mappedToTools,
    mappedToArticles,
  };
}
