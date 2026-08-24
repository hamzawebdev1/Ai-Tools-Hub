import { auth } from "./firebase";

export interface TrackToolOptions {
  toolId: string;
  toolSlug: string;
  toolName: string;
  category?: string;
  action: "VIEW" | "START" | "SUCCESS" | "ERROR" | "DOWNLOAD";
  durationMs?: number;
  errorMessage?: string;
  userId?: string;
  userEmail?: string;
  fileName?: string;
  fileSizeBytes?: number;
  outputSummary?: string;
}

// Generate persistent anonymous visitor and session IDs
function getVisitorId(): string {
  let vid = localStorage.getItem("_ut_vid");
  if (!vid) {
    vid = "vis_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem("_ut_vid", vid);
  }
  return vid;
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("_ut_sid");
  if (!sid) {
    sid = "ses_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem("_ut_sid", sid);
  }
  return sid;
}

/**
 * Centrally track all tool actions: VIEW, START, SUCCESS, ERROR, DOWNLOAD
 * Directly updates backend analytics database and synchronizes with user records.
 */
export async function trackToolAction(options: TrackToolOptions): Promise<void> {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const currentUser = auth.currentUser;
    const resolvedUserId = options.userId || currentUser?.uid || "";
    const resolvedUserEmail = options.userEmail || currentUser?.email || "";

    let eventType: "tool_view" | "tool_start" | "tool_complete" | "download" | "error" = "tool_view";
    if (options.action === "VIEW") eventType = "tool_view";
    else if (options.action === "START") eventType = "tool_start";
    else if (options.action === "SUCCESS") eventType = "tool_complete";
    else if (options.action === "ERROR") eventType = "error";
    else if (options.action === "DOWNLOAD") eventType = "download";

    const payload = {
      type: eventType,
      path: window.location.pathname,
      toolId: options.toolId,
      toolName: options.toolName,
      toolSlug: options.toolSlug,
      category: options.category || "utility",
      durationMs: options.durationMs,
      errorMessage: options.errorMessage,
      userId: resolvedUserId,
      userEmail: resolvedUserEmail,
      visitorId,
      sessionId,
      fileName: options.fileName,
      fileSizeBytes: options.fileSizeBytes,
    };

    // Send to backend database analytics tracking
    await fetch("/api/admin/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-visitor-id": visitorId,
        "x-session-id": sessionId,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Fail silently in UI, never break user workflow
    console.warn("Analytics event dispatch error:", err);
  }
}
