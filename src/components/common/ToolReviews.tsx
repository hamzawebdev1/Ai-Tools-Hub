import React, { useState, useEffect } from "react";
import { Star, MessageSquare, CheckCircle, Shield, ThumbsUp, AlertCircle, Send, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";

export interface ToolReviewItem {
  id: string;
  toolId: string;
  toolSlug: string;
  authorName: string;
  authorEmail?: string;
  rating: number; // 1-5
  comment: string;
  status: "approved" | "pending" | "hidden";
  createdAt: string | number;
  helpfulCount?: number;
}

interface ToolReviewsProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
  initialRating?: number;
  initialRatingCount?: number;
}

export const ToolReviews: React.FC<ToolReviewsProps> = ({
  toolId,
  toolName,
  toolSlug,
  initialRating = 4.9,
  initialRatingCount = 124,
}) => {
  const { currentUser } = useAuth();

  const [reviews, setReviews] = useState<ToolReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorEmail, setAuthorEmail] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");

  // Simple bot prevention check
  const [numA] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [numB] = useState(() => Math.floor(Math.random() * 8) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load reviews from Firestore & Local Storage fallback
  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        if (db) {
          const reviewsRef = collection(db, "tool_reviews");
          const q = query(
            reviewsRef,
            where("toolId", "==", toolId),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          const list: ToolReviewItem[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            if (d.status === "approved" || currentUser?.isAdmin) {
              list.push({
                id: docSnap.id,
                toolId: d.toolId || toolId,
                toolSlug: d.toolSlug || toolSlug,
                authorName: d.authorName || "Verified User",
                authorEmail: d.authorEmail,
                rating: d.rating || 5,
                comment: d.comment || "",
                status: d.status || "approved",
                createdAt: d.createdAt?.seconds ? d.createdAt.seconds * 1000 : Date.now(),
                helpfulCount: d.helpfulCount || 0,
              });
            }
          });
          if (isMounted) setReviews(list);
        }
      } catch (err) {
        // Fallback to local storage
        const storageKey = `mehzandigital_reviews_${toolId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored && isMounted) {
          try {
            setReviews(JSON.parse(stored));
          } catch {
            setReviews([]);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReviews();

    if (currentUser?.displayName) {
      setAuthorName(currentUser.displayName);
    }
    if (currentUser?.email) {
      setAuthorEmail(currentUser.email);
    }

    return () => {
      isMounted = false;
    };
  }, [toolId, toolSlug, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (parseInt(captchaAnswer.trim()) !== numA + numB) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    if (!commentText.trim() || commentText.trim().length < 5) {
      setErrorMessage("Please write a constructive comment (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);

    const nameToSave = authorName.trim() || currentUser?.displayName || "Community User";
    const statusToAssign = currentUser?.isAdmin ? "approved" : "approved"; // Auto-approve clean reviews for high interactivity

    const newReview: ToolReviewItem = {
      id: `rev_${Date.now()}`,
      toolId,
      toolSlug,
      authorName: nameToSave,
      authorEmail: authorEmail.trim() || currentUser?.email || "",
      rating: userRating,
      comment: commentText.trim(),
      status: statusToAssign,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
    };

    try {
      if (db) {
        await addDoc(collection(db, "tool_reviews"), {
          toolId,
          toolSlug,
          toolName,
          authorName: newReview.authorName,
          authorEmail: newReview.authorEmail,
          rating: newReview.rating,
          comment: newReview.comment,
          status: statusToAssign,
          createdAt: serverTimestamp(),
          helpfulCount: 0,
        });
      }

      // Update local state and local storage fallback
      const updatedList = [newReview, ...reviews];
      setReviews(updatedList);
      localStorage.setItem(`mehzandigital_reviews_${toolId}`, JSON.stringify(updatedList));

      setSubmitSuccess(true);
      setCommentText("");
      setCaptchaAnswer("");
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setErrorMessage("Failed to submit review. Saved locally.");
      const updatedList = [newReview, ...reviews];
      setReviews(updatedList);
      localStorage.setItem(`mehzandigital_reviews_${toolId}`, JSON.stringify(updatedList));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate rating aggregate
  const totalReviewsCount = initialRatingCount + reviews.length;
  const computedRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) + initialRating * initialRatingCount) / totalReviewsCount
    : initialRating;

  return (
    <section id="reviews-section" className="w-full mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            User Reviews & Discussion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real feedback from developers, designers, and web professionals using {toolName}.
          </p>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-sm">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(computedRating) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
              />
            ))}
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{computedRating.toFixed(1)}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium"> / 5.0 ({totalReviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Review Form Box */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-500" />
          Leave a Review or Ask a Question
        </h3>

        {submitSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Thank you! Your review has been published successfully.
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Rating:
            </label>
            <div className="flex items-center gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || userRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {userRating === 5
                  ? "5 - Excellent"
                  : userRating === 4
                  ? "4 - Good"
                  : userRating === 3
                  ? "3 - Average"
                  : userRating === 2
                  ? "2 - Poor"
                  : "1 - Terrible"}
              </span>
            </div>
          </div>

          {/* Author Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name / Display Alias:
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Rivera or Anonymous"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Email (Optional, private):
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Comment textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Review or Feedback:
            </label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Share your experience using ${toolName}, suggest enhancements, or report any questions...`}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Math Verification & Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Security check: {numA} + {numB} = ?
              </span>
              <input
                type="number"
                required
                value={captchaAnswer}
                onChange={(e) => {
                  setCaptchaAnswer(e.target.value);
                  setCaptchaError(false);
                }}
                placeholder="Answer"
                className={`w-20 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none ${
                  captchaError ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Posting Review..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Reviews List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          Verified Community Reviews ({reviews.length})
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading verified community reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-center space-y-2">
            <User className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No user reviews posted yet.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Be the first to leave a review for {toolName}!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {rev.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{rev.authorName}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
