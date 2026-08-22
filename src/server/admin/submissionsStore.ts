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
  createdAt: string;
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

let submissionsStore = {
  contactMessages: [] as ContactMessage[],
  bugReports: [] as ToolBugReport[],
  featureRequests: [] as FeatureRequest[],
  toolHealth: [] as ToolHealthRecord[],
};

export const getSubmissionsStore = () => submissionsStore;

export const addContactMessage = (data: Omit<ContactMessage, "id" | "referenceId" | "createdAt" | "read" | "status">) => {
  const newMessage: ContactMessage = {
    id: "msg_" + Date.now(),
    referenceId: "MSG-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };
  submissionsStore.contactMessages.unshift(newMessage);
  return newMessage;
};

export const addBugReport = (data: Omit<ToolBugReport, "id" | "referenceId" | "createdAt" | "read" | "status">) => {
  const newReport: ToolBugReport = {
    id: "rep_" + Date.now(),
    referenceId: "REP-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };
  submissionsStore.bugReports.unshift(newReport);
  return newReport;
};

export const addFeatureRequest = (data: Omit<FeatureRequest, "id" | "referenceId" | "createdAt" | "read" | "status" | "votes">) => {
  const newReq: FeatureRequest = {
    id: "req_" + Date.now(),
    referenceId: "REQ-" + Math.floor(10000 + Math.random() * 90000),
    ...data,
    votes: 1,
    status: "Open",
    read: false,
    createdAt: new Date().toISOString(),
  };
  submissionsStore.featureRequests.unshift(newReq);
  return newReq;
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
  return record;
};

