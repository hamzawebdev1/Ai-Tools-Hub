import fs from "fs";
import path from "path";
import { persistDocument, removeDocument, fetchCollectionDocs } from "../firebaseServer.js";

export interface ContactMessage {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  attachmentName?: string;
  recaptchaVerified: boolean;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedAdmin?: string;
  notes?: string;
  read: boolean;
  replies?: Array<{
    sender: string;
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  ip?: string;
  userAgent?: string;
}

export interface ToolBugReport {
  id: string;
  referenceId: string;
  toolName: string;
  pageUrl: string;
  userEmail: string;
  issueType: "Tool Not Working" | "Wrong Output" | "Download Failed" | "Upload Failed" | "Bug" | "Suggestion" | "Other";
  description: string;
  screenshotName?: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedAdmin?: string;
  notes?: string;
  read: boolean;
  createdAt: string;
  ip?: string;
}

export type BugReport = ToolBugReport;

export interface FeatureRequest {
  id: string;
  referenceId: string;
  toolName: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  userEmail: string;
  votes: number;
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Planned";
  assignedAdmin?: string;
  notes?: string;
  read: boolean;
  createdAt: string;
}

export interface ToolHealthRecord {
  toolId: string;
  toolName: string;
  status: "Healthy" | "Warning" | "Broken";
  successRate: number;
  lastTested: string;
  totalExecutions: number;
  failedExecutions: number;
  lastError?: string;
}

const STORAGE_FILE = path.join(process.cwd(), "storage", "submissions_store.json");

function ensureDirectoryExists() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
}

interface SubmissionsData {
  contactMessages: ContactMessage[];
  bugReports: ToolBugReport[];
  featureRequests: FeatureRequest[];
  toolHealth: ToolHealthRecord[];
}

let submissionsStore: SubmissionsData = (() => {
  ensureDirectoryExists();
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.contactMessages)) {
        return parsed;
      }
    } catch (e) {}
  }
  return {
    contactMessages: [],
    bugReports: [],
    featureRequests: [],
    toolHealth: [],
  };
})();

function saveSubmissions() {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(submissionsStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write local backup submissions store:", e);
  }
}

// Asynchronously sync with Firestore on server startup
export async function syncSubmissionsFromFirestore() {
  try {
    const contactDocs = await fetchCollectionDocs("contact_submissions", 500);
    const inboxDocs = await fetchCollectionDocs("inbox", 500);
    const bugDocs = await fetchCollectionDocs("bug_reports", 500);
    const featureDocs = await fetchCollectionDocs("feature_requests", 500);

    const mergedContactsMap = new Map<string, ContactMessage>();

    // Put existing local items first
    submissionsStore.contactMessages.forEach((m) => mergedContactsMap.set(m.id, m));
    contactDocs.forEach((d: any) => mergedContactsMap.set(d.id, d as ContactMessage));
    inboxDocs.forEach((d: any) => {
      if (d.name && d.email && d.message) {
        mergedContactsMap.set(d.id, d as ContactMessage);
      }
    });

    submissionsStore.contactMessages = Array.from(mergedContactsMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const mergedBugsMap = new Map<string, ToolBugReport>();
    submissionsStore.bugReports.forEach((b) => mergedBugsMap.set(b.id, b));
    bugDocs.forEach((d: any) => mergedBugsMap.set(d.id, d as ToolBugReport));
    submissionsStore.bugReports = Array.from(mergedBugsMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const mergedFeaturesMap = new Map<string, FeatureRequest>();
    submissionsStore.featureRequests.forEach((f) => mergedFeaturesMap.set(f.id, f));
    featureDocs.forEach((d: any) => mergedFeaturesMap.set(d.id, d as FeatureRequest));
    submissionsStore.featureRequests = Array.from(mergedFeaturesMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    saveSubmissions();
    console.log(
      `📥 Synced with Firestore: ${submissionsStore.contactMessages.length} contacts, ${submissionsStore.bugReports.length} bug reports, ${submissionsStore.featureRequests.length} feature requests.`
    );
  } catch (err) {
    console.error("⚠️ Error synchronizing submissions from Firestore:", err);
  }
}

// Initial async sync attempt
setTimeout(() => {
  syncSubmissionsFromFirestore();
}, 1000);

export const getSubmissionsStore = () => submissionsStore;

export const addContactMessage = async (
  data: Omit<ContactMessage, "id" | "referenceId" | "createdAt" | "read" | "status"> & { ip?: string; userAgent?: string }
): Promise<ContactMessage> => {
  const refCode = "MSG-" + Math.floor(10000 + Math.random() * 90000);
  const docId = "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const newMessage: ContactMessage = {
    id: docId,
    referenceId: refCode,
    ...data,
    status: "Open",
    read: false,
    replies: [],
    createdAt: new Date().toISOString(),
  };

  submissionsStore.contactMessages.unshift(newMessage);
  saveSubmissions();

  // Persist directly to Firestore collections: contact_submissions AND inbox
  try {
    await persistDocument("contact_submissions", docId, newMessage);
    await persistDocument("inbox", docId, newMessage);
    console.log(`✅ [CONTACT SUBMISSION] Stored in Firestore with ID ${docId} (Ref: ${refCode}) from ${data.email}`);
  } catch (err) {
    console.error("⚠️ Failed to write contact message to Firestore:", err);
  }

  return newMessage;
};

export const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
  const msg = submissionsStore.contactMessages.find((m) => m.id === id || m.referenceId === id);
  if (!msg) return null;
  Object.assign(msg, updates, { updatedAt: new Date().toISOString() });
  saveSubmissions();

  // Update in Firestore
  try {
    await persistDocument("contact_submissions", msg.id, msg);
    await persistDocument("inbox", msg.id, msg);
  } catch (e) {}

  return msg;
};

export const deleteContactMessage = async (id: string) => {
  const idx = submissionsStore.contactMessages.findIndex((m) => m.id === id || m.referenceId === id);
  if (idx === -1) return false;
  const removed = submissionsStore.contactMessages.splice(idx, 1)[0];
  saveSubmissions();

  // Remove from Firestore
  try {
    await removeDocument("contact_submissions", removed.id);
    await removeDocument("inbox", removed.id);
  } catch (e) {}

  return true;
};

export const replyContactMessage = async (id: string, sender: string, replyText: string) => {
  const msg = submissionsStore.contactMessages.find((m) => m.id === id || m.referenceId === id);
  if (!msg) return null;
  if (!msg.replies) msg.replies = [];
  msg.replies.push({
    sender,
    message: replyText,
    timestamp: new Date().toISOString(),
  });
  msg.status = "Resolved";
  msg.read = true;
  msg.updatedAt = new Date().toISOString();
  saveSubmissions();

  // Persist update in Firestore
  try {
    await persistDocument("contact_submissions", msg.id, msg);
    await persistDocument("inbox", msg.id, msg);
  } catch (e) {}

  return msg;
};

export const addBugReport = async (
  data: Omit<ToolBugReport, "id" | "referenceId" | "createdAt" | "read" | "status"> & { ip?: string }
): Promise<ToolBugReport> => {
  const refCode = "REP-" + Math.floor(10000 + Math.random() * 90000);
  const docId = "rep_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const newReport: ToolBugReport = {
    id: docId,
    referenceId: refCode,
    ...data,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };

  submissionsStore.bugReports.unshift(newReport);
  saveSubmissions();

  try {
    await persistDocument("bug_reports", docId, newReport);
    console.log(`✅ [BUG REPORT] Stored in Firestore with ID ${docId} (Ref: ${refCode}) for tool: ${data.toolName}`);
  } catch (err) {
    console.error("⚠️ Failed to write bug report to Firestore:", err);
  }

  return newReport;
};

export const updateBugReport = async (id: string, updates: Partial<ToolBugReport>) => {
  const rep = submissionsStore.bugReports.find((r) => r.id === id || r.referenceId === id);
  if (!rep) return null;
  Object.assign(rep, updates);
  saveSubmissions();

  try {
    await persistDocument("bug_reports", rep.id, rep);
  } catch (e) {}

  return rep;
};

export const deleteBugReport = async (id: string) => {
  const idx = submissionsStore.bugReports.findIndex((r) => r.id === id || r.referenceId === id);
  if (idx === -1) return false;
  const removed = submissionsStore.bugReports.splice(idx, 1)[0];
  saveSubmissions();

  try {
    await removeDocument("bug_reports", removed.id);
  } catch (e) {}

  return true;
};

export const addFeatureRequest = async (
  data: Omit<FeatureRequest, "id" | "referenceId" | "createdAt" | "read" | "status" | "votes">
): Promise<FeatureRequest> => {
  const refCode = "REQ-" + Math.floor(10000 + Math.random() * 90000);
  const docId = "req_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const newReq: FeatureRequest = {
    id: docId,
    referenceId: refCode,
    ...data,
    votes: 1,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };

  submissionsStore.featureRequests.unshift(newReq);
  saveSubmissions();

  try {
    await persistDocument("feature_requests", docId, newReq);
    console.log(`✅ [FEATURE REQUEST] Stored in Firestore with ID ${docId} (Ref: ${refCode})`);
  } catch (err) {
    console.error("⚠️ Failed to write feature request to Firestore:", err);
  }

  return newReq;
};

export const updateFeatureRequest = async (id: string, updates: Partial<FeatureRequest>) => {
  const req = submissionsStore.featureRequests.find((r) => r.id === id || r.referenceId === id);
  if (!req) return null;
  Object.assign(req, updates);
  saveSubmissions();

  try {
    await persistDocument("feature_requests", req.id, req);
  } catch (e) {}

  return req;
};

export const deleteFeatureRequest = async (id: string) => {
  const idx = submissionsStore.featureRequests.findIndex((r) => r.id === id || r.referenceId === id);
  if (idx === -1) return false;
  const removed = submissionsStore.featureRequests.splice(idx, 1)[0];
  saveSubmissions();

  try {
    await removeDocument("feature_requests", removed.id);
  } catch (e) {}

  return true;
};

export const recordToolExecution = async (toolId: string, toolName: string, success: boolean, lastError?: string) => {
  let record = submissionsStore.toolHealth.find((t) => t.toolId === toolId);
  if (!record) {
    record = {
      toolId,
      toolName,
      status: "Healthy",
      successRate: 100,
      lastTested: new Date().toISOString(),
      totalExecutions: 0,
      failedExecutions: 0,
    };
    submissionsStore.toolHealth.push(record);
  }

  record.totalExecutions += 1;
  if (!success) {
    record.failedExecutions += 1;
    if (lastError) record.lastError = lastError;
  }
  record.lastTested = new Date().toISOString();
  const successful = record.totalExecutions - record.failedExecutions;
  record.successRate = Number(((successful / record.totalExecutions) * 100).toFixed(1));
  record.status = record.successRate >= 95 ? "Healthy" : record.successRate >= 80 ? "Warning" : "Broken";
  saveSubmissions();

  return record;
};
