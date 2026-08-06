# Backup, Disaster Recovery & Monitoring Plan

This plan describes how to monitor AI Tools Hub in production, secure backups, and restore operations in the event of an infrastructure outage or database corruption.

---

## 1. Backup Strategy & Restore Strategy

Although AI Tools Hub runs as a stateless container, user preferences and account states reside in Firebase Firestore. 

### A. Firestore Backups
1.  **Automated Daily Backups**:
    Firestore database exports are scheduled daily using **Google Cloud Scheduler** and **Cloud Functions**, writing backup images to a locked-down, multi-regional **Cloud Storage (GCS) Bucket**.
2.  **Retention Period**:
    Backups are retained for 30 days utilizing GCS lifecycle rules, ensuring a balance between audit requirements and storage cost optimization.

### B. Manual Configuration Export (Admin API)
The platform includes administrative endpoints to back up system-level configuration profiles and metrics:
```bash
# Query current configuration backup via admin API
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
     https://aitoolshub.com/api/admin/backup-export \
     > ai_tools_hub_backup_$(date +%F).json
```

### C. Step-by-Step Restore Procedure
In the event of accidental data deletion or schema corruption, execute this recovery process:
1.  **Authorize CLI Access**:
    ```bash
    gcloud auth login
    gcloud config set project your-project-id
    ```
2.  **Restore Firestore Database**:
    Trigger an import operation pointing to the latest validated daily backup folder in Cloud Storage:
    ```bash
    gcloud firestore import gs://your-backup-bucket/2026-08-06T12:00:00_XYZ/
    ```
3.  **Deploy Rules and Index definitions**:
    Synchronize the security bounds to match the restored dataset:
    ```bash
    firebase deploy --only firestore
    ```

---

## 2. Disaster Recovery Plan (DRP)

### A. Scenario: Regional Outage of Container Host
If the deployment zone (e.g., `us-central1` for Cloud Run) suffers a complete blackout:
1.  **DNS Failover Switch**:
    Update the domain’s canonical DNS A/AAAA records or Cloudflare traffic routes to point to a pre-warmed replica cluster running in an alternate, geographic region (e.g., `europe-west1`).
2.  **Stateless Launch**:
    Because the application containers are built stateless and pull secrets dynamically, the replica spins up within seconds, connecting to the global multi-region Firebase Firestore pool.

### B. Scenario: Compromised Admin Token
If an administrator's credentials are lost or hijacked:
1.  **Revoke Active Sessions**:
    In the Firebase Console, invalidate all active user/admin tokens.
2.  **Rotated JWT Secret**:
    Immediately regenerate and update the `JWT_SECRET` inside GCP Secret Manager. This invalidates all issued cookie payloads across every active browser instance in real-time, forcing a complete sign-in challenge.

---

## 3. Monitoring & Alerting Strategy

We track application health using Google Cloud Monitoring (or Prometheus/Grafana if deploying to Kubernetes):

-   **Uptime Checkers**: Configured to ping `/api/health` every 1 minute from 5 global locations. Trigger pager alerts if response is non-200 for > 3 consecutive probes.
-   **Core Web Vitals Telemetry**: Monitor browser real-user-monitoring (RUM) performance directly. Pay special attention to:
    -   `TBT` (Total Blocking Time): Targeted below **200ms**.
    -   `CLS` (Cumulative Layout Shift): Targeted below **0.1**.
-   **API Error Rate Spike**: Trigger incident alerts if HTTP 5xx codes exceed 1% of total queries over a 5-minute rolling window.

---

## 4. Structured Logging Strategy

AI Tools Hub practices strict privacy-preserving logging standards:

1.  **No PII Leakage**: The logging framework strips email addresses, IP addresses, full user names, and passwords before printing events to stdout.
2.  **Structured JSON Logs**: Production logs are printed in JSON format, facilitating instantaneous parsing by automated tools like Cloud Logging, Datadog, or ELK stacks:
    ```json
    {
      "timestamp": "2026-08-06T12:00:00.123Z",
      "severity": "INFO",
      "message": "Tool executed successfully",
      "context": {
        "toolId": "percentage-calculator",
        "durationMs": 45
      }
    }
    ```

---

## 5. Software Update Strategy

To roll out enhancements and security patches with zero downtime:

-   **Blue-Green / Canary Deployments**: Cloud Run is configured to direct only **5%** of incoming public traffic to the newly deployed container version initially. Once health metrics and error telemetry confirm stability after 15 minutes, traffic is scaled to 100%.
-   **Atomic Container Swaps**: Node.js completes active Express event-loop cycles before terminating when receiving a standard `SIGTERM` signal, ensuring no incomplete file processing runs or aborted downloads.
