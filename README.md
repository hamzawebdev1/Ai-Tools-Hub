# AI Tools Hub - Production Deployment & Reference Documentation

AI Tools Hub is an enterprise-grade, high-performance web platform that hosts over 50 client-side development, design, and productivity tools. Built on a robust full-stack architecture with **Express, Vite, React 18, and TypeScript**, the application is optimized for speed, reliability, SEO visibility, and strict compliance with the **OWASP Top 10** security standard and **Google AdSense policies**.

This documentation outlines the structural mechanics, security features, configuration variables, and operational strategies necessary to run AI Tools Hub in a high-availability production environment.

---

## Architecture Overview

The system utilizes a split execution model: heavy file processing and AI utilities are handled client-side in sandboxed browser threads, while authentication, administrative controls, file orchestration, and secure integrations are proxied through a hardened Node.js Express server.

### System Topology Diagram

```text
                  +--------------------------------------------+
                  |               Client Browser               |
                  +---------------------+----------------------+
                                        |
                                        | HTTPS / WebSockets
                                        v
                  +---------------------+----------------------+
                  |        Reverse Proxy / Ingress Layer       |
                  |     (nginx / Cloud Run GCLB on Port 3000)  |
                  +---------------------+----------------------+
                                        |
                                        v
                  +---------------------+----------------------+
                  |          Express Full-Stack Server         |
                  |     - Helmet Security Headers / CSP        |
                  |     - Tiered IP Rate Limiting / XSS        |
                  |     - Dynamic Sitemap & RSS Endpoints      |
                  |     - API Gateway & Proxy Controller       |
                  +----------+---------------------+-----------+
                             |                     |
                             | Internal API        | Secure Auth / Sync
                             v                     v
                  +----------+----------+  +-------+-----------+
                  |  Google Drive API   |  | Firebase Auth     |
                  |  - Encrypted Pools  |  | Firebase Firestore|
                  |  - 24hr Auto-Purge  |  | - Fortress Rules  |
                  +---------------------+  +-------------------+
```

---

## Technical Documentation Index

To ensure modularity and ease of maintenance, the platform's production and development guidelines are split into dedicated, exhaustive reference sheets. Please consult the corresponding files below:

### Operational & Configuration Guides
*   **[Production Deployment Checklist](./docs/PRODUCTION_CHECKLIST.md)**: A step-by-step checklist to prepare, verify, build, and deploy the application to cloud platforms (such as Google Cloud Run or AWS App Runner).
*   **[Environment Variables List](./docs/ENVIRONMENT_VARIABLES.md)**: Detailed schema of all required, optional, client-side, and server-side environment parameters, along with security boundaries.
*   **[Firebase Configuration & Security Guide](./docs/FIREBASE_GUIDE.md)**: Operational setup for Firebase Authentication and our locked-down, zero-trust Firestore "Fortress Rules".
*   **[Google Drive & Storage Configuration](./docs/GOOGLE_DRIVE_GUIDE.md)**: Architecture of the stateless temporary storage pool, in-transit encryption scheme, and the 24-hour cron automated deletion queue.
*   **[Google Search Console, Analytics, & AdSense Integration](./docs/GOOGLE_INTEGRATIONS.md)**: Detailed setup guides for SEO validation, event tracking, and AdSense layout compliance to maximize monetization without impacting UX.

### Engineering & Developer References
*   **[Developer & Folder Reference](./docs/DEVELOPER_DOCS.md)**: Source directory mapping, dependency trees, API routing maps, TypeScript compilation configurations, and local development start instructions.
*   **[Admin Dashboard & Management Guide](./docs/ADMIN_DOCS.md)**: Technical operational workflows for the enterprise-grade administrator dashboard, including system health monitoring and security backups.
*   **[User Reference & Feature Manual](./docs/USER_DOCS.md)**: Direct user guides explaining the difference between Guest limits and Registered tiers, tool categories, and local histories.
*   **[Final Production Readiness & QA Audit](./docs/PRODUCTION_AUDIT.md)**: Our verified QA audit proving zero mock stubs, complete test passes, Lighthouse target metrics, and total OWASP compliance.

---

## Quick-Start Commands

For immediate local testing or containerized execution, use the following command loops:

### Developer Setup
```bash
# 1. Install required workspace dependencies
npm install

# 2. Run the developer loop (Vite hot-reloading proxy integrated inside tsx server)
npm run dev
```

### Production Build & Launch
```bash
# 1. Typecheck and lint full codebase
npm run lint

# 2. Bundle frontend assets (Vite) and compile server files (esbuild)
npm run build

# 3. Start standalone production instance on Port 3000
npm run start
```

---

## System Health & Contacts

The platform is designed to run in a completely stateless manner, auto-scaling on demand inside containerized environments. For any operational escalations, refer to the **Disaster Recovery Plan** or reach out to the project administrator.
