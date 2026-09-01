import { Router } from "express";
import { fetchReviewsByTool, submitReview } from "./admin/reviewsStore.js";

const router = Router();

router.get("/:toolId/reviews", async (req, res) => {
  try {
    const reviews = await fetchReviewsByTool(req.params.toolId);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

router.post("/:toolId/reviews", async (req, res) => {
  try {
    const { reviewerName, reviewerEmail, rating, text } = req.body;
    if (!reviewerName || !rating || !text || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: "Invalid review data" });
    }
    const review = await submitReview({
      toolId: req.params.toolId,
      reviewerName,
      reviewerEmail,
      rating,
      text,
    });
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit review" });
  }
});

export default router;
