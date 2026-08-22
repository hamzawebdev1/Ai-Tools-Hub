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
  contactMessages: [
    {
      id: "msg_1",
      referenceId: "MSG-94281",
      name: "Marcus Vance",
      email: "marcus@enterprise.com",
      subject: "AdSense Integration Inquiry",
      category: "AdSense / Legal",
      message: "Great performance on Core Web Vitals. All ad zones render with zero CLS.",
      recaptchaVerified: true,
      status: "Open" as const,
      assignedAdmin: "Hamza (Super Admin)",
      notes: "High priority enterprise lead",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ] as ContactMessage[],

  bugReports: [
    {
      id: "rep_1",
      referenceId: "REP-48192",
      toolName: "AI Text Paraphraser",
      pageUrl: "/tools/ai-paraphrasing-tool",
      userEmail: "alex@example.com",
      issueType: "Wrong Output",
      description: "Returned summary instead of rephrasing text in certain languages.",
      status: "In Progress" as const,
      assignedAdmin: "Security Admin",
      notes: "Investigating prompt instruction tuning",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ] as ToolBugReport[],

  featureRequests: [
    {
      id: "req_1",
      referenceId: "REQ-10294",
      toolName: "Batch CSV Converter",
      description: "Convert multiple CSV files to JSON simultaneously.",
      category: "Developer Tools",
      priority: "High" as const,
      userEmail: "sarah@creator.io",
      votes: 42,
      status: "Planned" as const,
      assignedAdmin: "Hamza (Super Admin)",
      notes: "Scheduled for sprint release v2.6",
      read: true,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ] as FeatureRequest[],

  toolHealth: [
    { toolId: "json-formatter", toolName: "JSON Formatter & Validator", status: "Healthy" as const, successRate: 99.8, lastTested: new Date().toISOString(), totalExecutions: 1420, failedExecutions: 2 },
    { toolId: "pdf-compressor", toolName: "PDF Compressor Pro", status: "Healthy" as const, successRate: 100, lastTested: new Date().toISOString(), totalExecutions: 890, failedExecutions: 0 },
    { toolId: "image-compressor", toolName: "Smart Image Compressor", status: "Healthy" as const, successRate: 98.7, lastTested: new Date().toISOString(), totalExecutions: 2310, failedExecutions: 30 },
  ] as ToolHealthRecord[],
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

