import { Router } from "express";
import { guestPostRateLimiter } from "./security/securityMiddleware.js";
import { getSiteSettings } from "./admin/cmsStore.js";
import { submitGuestPost } from "./admin/guestPostsStore.js";

const router = Router();

// Public: Get current Guest Posting guidelines & configuration
router.get("/settings", (req, res) => {
  try {
    const settings = getSiteSettings();
    const gp = settings.guestPostingSettings || {
      enabled: true,
      guidelines: "Submit original, high-quality technical articles, software tutorials, or digital marketing guides. Min 500 words. Promotional links must be relevant and safe.",
      minWordCount: 500,
      maxWordCount: 5000,
      allowedCategories: ["Web Development", "Digital Marketing", "SEO", "Developer Tools", "PDF Utilities", "Student Tools"],
      requireFeaturedImage: false,
      requireAuthorBio: true,
      moderationRequired: true,
      autoPublish: false,
    };

    return res.json({
      success: true,
      settings: gp,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch guest post configuration." });
  }
});

// Public: Submit Guest Article
router.post("/submit", guestPostRateLimiter, (req, res) => {
  try {
    const {
      authorName,
      authorEmail,
      authorWebsite,
      authorSocialUrl,
      authorBio,
      title,
      category,
      content,
      featuredImage,
      additionalNotes,
    } = req.body;

    // 1. Basic field checks
    if (!authorName || !authorEmail || !title || !content) {
      return res.status(400).json({
        success: false,
        error: "Required fields missing: Full Name, Email, Title, and Article Content are required.",
      });
    }

    // 2. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail.trim())) {
      return res.status(400).json({ success: false, error: "Please provide a valid email address." });
    }

    // 3. Title length check
    if (title.trim().length < 5 || title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        error: "Article Title must be between 5 and 150 characters.",
      });
    }

    // 4. URL format validation if optional links provided
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i;
    if (authorWebsite && authorWebsite.trim() && !urlRegex.test(authorWebsite.trim())) {
      return res.status(400).json({ success: false, error: "Please enter a valid website URL (e.g., https://example.com)." });
    }
    if (authorSocialUrl && authorSocialUrl.trim() && !urlRegex.test(authorSocialUrl.trim())) {
      return res.status(400).json({ success: false, error: "Please enter a valid social URL." });
    }

    const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const result = submitGuestPost(
      {
        authorName,
        authorEmail,
        authorWebsite,
        authorSocialUrl,
        authorBio,
        title,
        category,
        content,
        featuredImage,
        additionalNotes,
      },
      clientIp,
      userAgent
    );

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({
      success: true,
      message: "Your guest article submission has been received successfully! Our editorial team will review it shortly.",
      submissionId: result.submission?.id,
      slug: result.submission?.slug,
      status: result.submission?.status,
    });
  } catch (err: any) {
    console.error("Error submitting guest article:", err);
    return res.status(500).json({ success: false, error: "Server error submitting guest article. Please try again." });
  }
});

export default router;
