# Developer & Folder Reference Documentation

This document serves as the primary code reference, API index, and folder structural guide for developers working on the AI Tools Hub codebase.

---

## 1. Directory Structural Mapping

```text
/
├── .env.example                # Blueprint for development and production environment variables.
├── DEPLOYMENT.md               # Standard cloud deployment runbook.
├── firebase-blueprint.json     # Intermediate Schema Representation (IR) of database collections.
├── firestore.rules             # Production security rules for the Firebase Firestore database.
├── index.html                  # Core HTML template and viewport configuration.
├── package.json                # Project dependencies and operational scripts.
├── server.ts                   # Core entry point for Express full-stack routing and static asset proxying.
├── vite.config.ts              # Vite asset bundler configuration.
├── docs/                       # Exhaustive operational and system documentation.
└── src/                        # Main React + TypeScript application source code.
    ├── App.tsx                 # Master routing, context wrapping, and page layout configuration.
    ├── main.tsx                # Client-side initialization and DOM mount loader.
    ├── index.css               # Main Tailwind import file and system font pairings.
    ├── types.ts                # Consolidated TypeScript interfaces, enums, and types.
    ├── components/             # Reusable React visual elements.
    │   ├── admin/              # Admin dashboard metrics and data exporters.
    │   ├── auth/               # Google OAuth, Login, and Signup dialog controls.
    │   ├── layout/             # Header, Footer, Breadcrumbs, Navigation, and AdBanners.
    │   ├── security/           # Rate-limiting, CSP, and security log panels.
    │   ├── seo/                # Dynamic Meta, JSON-LD schemas, and dynamic tags.
    │   ├── storage/            # Upload drops, temporary files manager, and secure dropzones.
    │   └── tools/              # Visual runner widgets for over 50 specific productivity tools.
    ├── context/                # Global React context managers (e.g., AuthContext.tsx).
    ├── data/                   # JSON content seeds for blog items, categories, and static lists.
    ├── pages/                  # Top-level Page views (e.g., HomePage.tsx, ToolDetailPage.tsx, BlogPage.tsx).
    ├── server/                 # Full-stack backend middleware and route handlers.
    │   ├── admin/              # System backups, admin logs, and diagnostic endpoints.
    │   ├── security/           # Helmet configuration, rate-limiters, and token parsers.
    │   └── storage/            # Google Drive API wrappers and secure upload pipelines.
    └── services/               # Modular service endpoints.
        ├── firebase.ts         # Firebase initialization, DB connection verify, and auth bridges.
        ├── guestUsageService.ts# LocalStorage guest limit tracking engine.
        ├── seoService.ts       # Meta-tag and OpenGraph data orchestrator.
        └── storageService.ts   # Secure REST bridge to file APIs.
```

---

## 2. API Endpoint Specification

All API routes are served on port `3000` and prefixed with `/api`.

### A. Health & System Metrics
*   `GET /api/health`: Returns a 200 OK liveness packet to confirm container health.
*   `GET /api/seo/sitemap.xml`: Dynamically constructs a valid search-crawler sitemap.

### B. Storage & Upload Services (Stateless Loop)
*   `POST /api/storage/upload`: Handles file uploads (PDF, spreadsheet, image) up to 10MB. Run Byte-Sniff MIME checks, sanitizes the path, encrypts, and buffers.
*   `GET /api/storage/file/:fileId`: Downloads and decrypts a cached file within its 24-hour window.

### C. Admin & Security Diagnostic API
*   `GET /api/admin/system-logs`: Retrieves audit trail of system metrics, diagnostic failures, and blocked activities. (Requires authenticated Admin cookies).
*   `GET /api/admin/backup-export`: Exports systemic settings and metadata definitions as JSON files.

---

## 3. Strict Coding Conventions

To ensure the codebase remains clean, fast, and secure, developers must adhere to these structural policies:

1.  **Strict TypeScript Only**: No use of the `any` keyword. All components must declare precise interfaces for their props.
2.  **No Direct CSS**: Rely exclusively on **Tailwind CSS** class annotations. Inline `style` declarations are strictly banned except for dynamic position/dimension calculations.
3.  **No Client-Side Secrets**: All third-party endpoints requiring keys must be proxied through backend routes in `server.ts`.
4.  **Lucide Icons Standard**: All icons used throughout the system must be imported from `lucide-react`. Custom inline SVG blocks are prohibited to keep the DOM clean.
5.  **Dynamic Imports**: Large, complex client tools (e.g., complex chart visualizers or text comparisons) must use React’s `React.lazy()` or dynamic imports to keep the main bundle flat.
