# Production Deployment Checklist & Guide

This document outlines the standard deployment checklist and operating procedures required to take AI Tools Hub from local development to a secure, highly-available production release on containerized infrastructure (such as **Google Cloud Run** or **AWS App Runner**).

---

## 1. Pre-Deployment Verification Checklist

Before pushing code changes to production, the release engineer must run and verify the following commands locally or in the CI/CD pipeline:

- [ ] **Typecheck and Lint Pass**:
  Ensure the linter passes with zero errors:
  ```bash
  npm run lint
  ```
- [ ] **Bundle Compilation Verification**:
  Compile both the React front-end bundles (via Vite) and the backend Express bundle (compiled to `dist/server.cjs` via `esbuild`):
  ```bash
  npm run build
  ```
- [ ] **Dependency Audit**:
  Verify that all active third-party packages are defined correctly and that no unused development packages leak into the production image:
  ```bash
  npm prune --production
  ```
- [ ] **Secret Scan**:
  Scan files to ensure no hardcoded developer secrets, Firebase API keys, or JWT keys remain in the source repository. All configurations must pull dynamically from environment variables.

---

## 2. Server & Container Hardening Guide

When creating a Docker container for AI Tools Hub, apply the following operational standards to enforce security bounds in accordance with OWASP recommendations:

### Container Security
1.  **Non-Root User execution**:
    Do not run the Node process inside the container as the root user. Set up a dedicated user in the `Dockerfile`:
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    COPY . .
    RUN npm run build
    USER node
    EXPOSE 3000
    CMD ["npm", "run", "start"]
    ```
2.  **Read-Only Root Filesystem**:
    Run the container with a read-only root filesystem where possible. Ensure that only the temporary files directory (`/tmp`) is mounted as a writable, in-memory volume (`tmpfs`) to support user uploads.
3.  **Port Standard**:
    Ensure the dev and production servers always bind exclusively to Port `3000` on interface `0.0.0.0` to match ingress configurations.

---

## 3. Step-by-Step Deployment Guide

Follow this sequence to deploy the application to **Google Cloud Run**:

### Step A: Provision Cloud Projects & Resources
1.  Initialize a project in the Google Cloud Console.
2.  Enable the **Cloud Run API**, **Artifact Registry API**, and **Secret Manager API**.
3.  Create an **Artifact Registry Docker Repository** in your target deployment region (e.g., `us-central1`).

### Step B: Store Secrets in Secret Manager
1.  Define your production secrets securely:
    -   `GEMINI_API_KEY`: Google Gemini Key.
    -   `JWT_SECRET`: A cryptographically secure 64-character random string for signing cookies and anti-CSRF headers.
2.  Grant the Cloud Run service account the `Secretmanager.SecretAccessor` role.

### Step C: Build and Push Docker Image
Run the following build script to package the compiled application and push it to Artifact Registry:
```bash
# Variables
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
REPO_NAME="ai-tools-hub"
IMAGE_NAME="app-server"
TAG="latest"

# Build the docker image locally (or via Cloud Build)
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$TAG .

# Authenticate docker to Artifact Registry
gcloud auth configure-docker $REGION-docker.pkg.dev

# Push the image
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$TAG
```

### Step D: Deploy to Cloud Run
Execute the deployment command, linking the environment variables and Secret Manager secrets directly to the container:
```bash
gcloud run deploy ai-tools-hub \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$TAG \
  --region=$REGION \
  --platform=managed \
  --port=3000 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi \
  --set-env-vars="APP_URL=https://aitoolshub.com,NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest"
```

---

## 4. Post-Deployment Verification Protocol

Once the build is active at the public URL, perform the following verification routines:

1.  **Check Ingress Headers**:
    Verify that the reverse proxy or Cloud Run service correctly injects the `X-Forwarded-For` and `X-Forwarded-Proto` headers, which the server relies on for dynamic rate-limiting calculations.
2.  **HTTPS Enforcement**:
    Navigate to `http://<your-domain>` and confirm that the server intercepts and performs an HTTP-to-HTTPS redirect (enforced at the reverse proxy or the Express middleware layer).
3.  **Liveness & Readiness Endpoints**:
    Query the API health route to verify container startup success:
    ```bash
    curl -I https://your-domain.com/api/health
    # Expect HTTP/2 200 OK
    ```
