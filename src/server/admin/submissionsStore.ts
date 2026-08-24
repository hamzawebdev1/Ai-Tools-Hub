import fs from "fs";
import path from "path";

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
    console.error("Failed to write submissions store:", e);
  }
}

export const getSubmissionsStore = () => submissionsStore;

export const addContactMessage = (data: Omit<ContactMessage, "id" | "referenceId" | "createdAt" | "read" | "status">) => {
  const newMessage: ContactMessage = {
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    referenceId: "MSG-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    status: "Open",
    read: false,
    replies: [],
    createdAt: new Date().toISOString(),
  };
  submissionsStore.contactMessages.unshift(newMessage);
  saveSubmissions();
  return newMessage;
};

export const updateContactMessage = (id: string, updates: Partial<ContactMessage>) => {
  const msg = submissionsStore.contactMessages.find((m) => m.id === id || m.referenceId === id);
  if (!msg) return null;
  Object.assign(msg, updates, { updatedAt: new Date().toISOString() });
  saveSubmissions();
  return msg;
};

export const deleteContactMessage = (id: string) => {
  const idx = submissionsStore.contactMessages.findIndex((m) => m.id === id || m.referenceId === id);
  if (idx === -1) return false;
  submissionsStore.contactMessages.splice(idx, 1);
  saveSubmissions();
  return true;
};

export const replyContactMessage = (id: string, sender: string, replyText: string) => {
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
  return msg;
};

export const addBugReport = (data: Omit<ToolBugReport, "id" | "referenceId" | "createdAt" | "read" | "status">) => {
  const newReport: ToolBugReport = {
    id: "rep_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    referenceId: "REP-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };
  submissionsStore.bugReports.unshift(newReport);
  saveSubmissions();
  return newReport;
};

export const updateBugReport = (id: string, updates: Partial<ToolBugReport>) => {
  const rep = submissionsStore.bugReports.find((r) => r.id === id || r.referenceId === id);
  if (!rep) return null;
  Object.assign(rep, updates);
  saveSubmissions();
  return rep;
};

export const deleteBugReport = (id: string) => {
  const idx = submissionsStore.bugReports.findIndex((r) => r.id === id || r.referenceId === id);
  if (idx === -1) return false;
  submissionsStore.bugReports.splice(idx, 1);
  saveSubmissions();
  return true;
};

export const addFeatureRequest = (data: Omit<FeatureRequest, "id" | "referenceId" | "createdAt" | "read" | "status" | "votes">) => {
  const newReq: FeatureRequest = {
    id: "req_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    referenceId: "REQ-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    votes: 1,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };
  submissionsStore.featureRequests.unshift(newReq);
  saveSubmissions();
  return newReq;
};

export const updateFeatureRequest = (id: string, updates: Partial<FeatureRequest>) => {
  const req = submissionsStore.featureRequests.find((r) => r.id === id || r.referenceId === id);
  if (!req) return null;
  Object.assign(req, updates);
  saveSubmissions();
  return req;
};

export const deleteFeatureRequest = (id: string) => {
  const idx = submissionsStore.featureRequests.findIndex((r) => r.id === id || r.referenceId === id);
  if (idx === -1) return false;
  submissionsStore.featureRequests.splice(idx, 1);
  saveSubmissions();
  return true;
};

export const recordToolExecution = (toolId: string, toolName: string, success: boolean, lastError?: string) => {
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
  record.status = record.successRate > 95 ? "Healthy" : record.successRate > 80 ? "Warning" : "Broken";
  saveSubmissions();
  return record;
};
