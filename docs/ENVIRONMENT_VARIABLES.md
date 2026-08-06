# Environment Variables Reference

This document maps all environment variables used by the AI Tools Hub application. It defines which variables are required, their purpose, security classifications, and validation constraints.

---

## 1. Master Variable Schema

| Variable Name | Environment Scope | Security Classification | Required? | Example Value | Description |
| --- | --- | --- | --- | --- | --- |
| `GEMINI_API_KEY` | Server-Side Only | **CRITICAL SECRET** | Yes (for AI features) | `AIzaSyA1...` | Key for authenticating backend proxy requests to the Google Gemini developer API. |
| `JWT_SECRET` | Server-Side Only | **CRITICAL SECRET** | Yes | `9a8f4c2e...` | Cryptographically secure 64-character hex string used to sign session JWTs and enforce anti-CSRF Double-Submit cookies. |
| `APP_URL` | Both (Client via API) | Non-Sensitive Config | Yes | `https://aitoolshub.com` | The canonical public host URL of your deployed application. Used for generating sitemaps and RSS links. |
| `NODE_ENV` | Both (Client via API)| Non-Sensitive Config | Yes | `production` | Execution mode. Controls dev logging, source maps, error verbosity, and Vite HMR proxy conditions. |

---

## 2. Server-Side Secret Handling Security Standards

### A. Strict Scope Isolation
*   **No `VITE_` Prefix for Secrets**: Never prefix `GEMINI_API_KEY` or `JWT_SECRET` with `VITE_`. Doing so exposes these keys to the client-side JavaScript bundle during the build phase, rendering them visible via browser developer tools.
*   **Lazy Instantiation**: SDK clients (like the Firebase Admin SDK or Google Drive integrations) are initialized dynamically inside route handlers only when a request is made, preventing crash-loops during server startup if a secret is transiently unavailable.

### B. Input Sanitization on Load
On server boot, environment variables are parsed and validated to prevent execution with malformed config:
```ts
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn("WARNING: JWT_SECRET is not configured or too short. Falling back to a transient secret (non-persistent between restarts).");
}
if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is missing. AI-powered tools will fail gracefully with descriptive error prompts.");
}
```

---

## 3. Client-Side Variable Guidelines

To pass configurations to the browser safely, the React application uses **Vite environment variables**:

1.  **Prefix Requirement**: Any client-bound parameter (e.g., public analytics tags, theme defaults, or Firebase API credentials if using client Firestore SDK) must be prefixed with `VITE_`.
2.  **Usage**: Accessible via `import.meta.env.VITE_VARIABLE_NAME`.
3.  **Client-Side Safety**: Never place sensitive database connection strings, write access passwords, or API keys inside client-side configurations. All write operations must route through server-side endpoints which enforce role-based and rate-limited boundaries.
