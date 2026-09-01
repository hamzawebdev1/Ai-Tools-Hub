import { persistDocument, removeDocument, fetchCollectionDocs } from "../firebaseServer.js";

export interface CMSReview {
  id: string;
  toolId: string;
  reviewerName: string;
  reviewerEmail: string; // Private
  rating: number; // 1-5
  text: string;
  status: "pending" | "approved" | "rejected" | "deleted" | "spam";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const REVIEWS_COLLECTION = "reviews";

export async function fetchReviews(): Promise<CMSReview[]> {
  return await fetchCollectionDocs(REVIEWS_COLLECTION) as CMSReview[];
}

export async function fetchReviewsByTool(toolId: string): Promise<CMSReview[]> {
  const allReviews = await fetchReviews();
  return allReviews.filter((r) => r.toolId === toolId && r.status === "approved");
}

export async function submitReview(review: Omit<CMSReview, "id" | "status" | "createdAt" | "updatedAt">): Promise<CMSReview> {
  const now = new Date().toISOString();
  const newReview: CMSReview = {
    ...review,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  await persistDocument(REVIEWS_COLLECTION, newReview.id, newReview);
  return newReview;
}

export async function updateReviewStatus(id: string, status: CMSReview["status"], adminNotes?: string): Promise<void> {
  const reviews = await fetchReviews();
  const review = reviews.find((r) => r.id === id);
  if (!review) throw new Error("Review not found");
  
  const updatedReview = {
    ...review,
    status,
    adminNotes,
    updatedAt: new Date().toISOString(),
  };
  await persistDocument(REVIEWS_COLLECTION, id, updatedReview);
}

export async function deleteReview(id: string): Promise<void> {
  await removeDocument(REVIEWS_COLLECTION, id);
}
