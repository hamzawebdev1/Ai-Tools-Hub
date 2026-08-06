# Admin Dashboard & System Management Guide

This document explains the technical features, security configurations, and operational workflows of the administrator dashboard built into AI Tools Hub.

---

## 1. Role-Based Access Control (RBAC) Hierarchy

The administrative interfaces utilize a secure tiered authorization scheme. User roles are verified in real-time against Firestore document settings:

```text
  [Guest / Standard User]   ---> Read-only access to tools. Guest usage cap enforced.
            |
            v
  [Moderator Account]       ---> Access to feedback boards and tool suggestions.
            |
            v
  [Administrator Account]   ---> Full system monitoring, system backups, and logs.
```

-   **Role Modification Safety**: A user cannot modify their own role. Escalation to administrative privileges is managed by modifying the `admins/` document collection in Firestore directly, or by an existing Admin in the Admin Console.

---

## 2. Dashboard Features & Monitoring Panels

The Enterprise Admin Dashboard is accessible at `/admin` (or `/dashboard` if configured) for accounts flagged with `role: 'admin'`. It aggregates system telemetry into 4 key views:

### A. Real-Time System Telemetry
-   **Network Metrics**: Displays request frequencies, throughput, and memory consumption.
-   **Storage Monitor**: Tracks active temporary file counts and disk footprint inside `/tmp/uploads`.

### B. Security & Rate-Limiting Log
-   **Audit Logs**: Provides a searchable history of security blocks, unauthorized attempts, and suspicious activity.
-   **Rate-Limit Trigger Alerts**: Monitors IPs that trigger 429 warnings, allowing proactive defense against DDoS or brute-force crawling.

### C. Feedback & Suggestions Manager
-   **User Submissions**: Allows admins to review feedback submitted by users, approve proposed tools, and track suggestions.

---

## 3. Operational Troubleshooting Guide

### Issue: Admin cannot access the dashboard
*   **Root Cause**: The user's account is not flagged in the database or the session cookie is missing.
*   **Fix**:
    1.  Access the Firebase Console.
    2.  Navigate to Firestore -> `users` -> `<user_uid>`.
    3.  Confirm that `role` is set to `"admin"` and `registeredStatus` is `true`.
    4.  Verify that a document matching the `<user_uid>` exists in the `/admins` collection.

### Issue: Disk quota alert or temp directory full
*   **Root Cause**: The 24-hour automated deletion cron task failed to clear expired assets, or there was a sudden surge in massive file uploads.
*   **Fix**:
    1.  Force a manual execution of the purge worker using the system endpoint:
        ```bash
        curl -X POST -H "Authorization: Bearer <ADMIN_TOKEN>" https://aitoolshub.com/api/admin/force-purge
        ```
    2.  Check the container output logs to verify that all files in `/tmp/uploads/` are unlinked successfully.
