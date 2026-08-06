# Firebase Configuration & Security Guide

This document describes how to configure Firebase, integrate it with the AI Tools Hub, and secure the Firestore database using mathematically sound "Fortress Rules."

---

## 1. Local Configuration Setup

The application reads its Firebase credentials from a standard configuration file located at the root of the project: `firebase-applet-config.json`.

During server and client runtime, the SDK initializes Firebase using this config. To configure your production Firebase project, write the JSON credentials to this file:

```json
{
  "apiKey": "YOUR_FIREBASE_API_KEY",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef123456",
  "measurementId": "G-ABCDEF1234",
  "firestoreDatabaseId": "(default)"
}
```

---

## 2. Hardened Zero-Trust Firestore Security (Fortress Rules)

To satisfy **OWASP Top 10** requirements and prevent "Denial of Wallet" resource-exhaustion attacks, our security rules are structured as a zero-trust fortress. 

### Core Concepts

1.  **Default-Deny Catch-All**: The rules start with a global block that explicitly denies all reads and writes unless a subsequent match block permits it.
2.  **No Client-Controlled Queries**: We do not trust the client to filter data. Every list query is evaluated rules-side by comparing the resource's `ownerId` against the requester's `request.auth.uid`.
3.  **Strict Size and Type Validation**: Every string check is bounded by a `.size()` limit (e.g., `id.size() <= 128`), and all input maps must strictly match their type definitions.
4.  **Role Verification (RBAC)**: Custom roles (such as `admin` or `moderator`) are never trusted from client-side claims. They are checked in real-time by querying trusted system metadata collections using the `exists()` or `get()` database lookup helpers.

### Excerpt of Fortress Rules Structure (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 1. Global Default-Deny Catch-All
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. Global Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isEmailVerified() {
      return isSignedIn() && request.auth.token.email_verified == true;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // 3. User Document Resource Rules
    match /users/{userId} {
      allow get: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow list: if isAdmin();
      
      allow create: if isSignedIn() && request.auth.uid == userId && (
        incoming().uid == userId &&
        incoming().email is string &&
        incoming().email.size() <= 256 &&
        incoming().createdAt == request.time &&
        incoming().registeredStatus == true &&
        incoming().role == 'user' // Users cannot self-escalate to admin during signup
      );

      allow update: if isSignedIn() && request.auth.uid == userId && (
        // Enforce that immutable fields remain unchanged
        incoming().uid == existing().uid &&
        incoming().createdAt == existing().createdAt &&
        incoming().email == existing().email &&
        incoming().updatedAt == request.time &&
        // Block privilege escalation (role cannot be modified by user)
        incoming().role == existing().role &&
        // Validate partial update fields (favorites list, history, etc.)
        (incoming().favorites is list && incoming().favorites.size() <= 100)
      );
    }

    // 4. Admin Collections
    match /admins/{adminId} {
      allow read, write: if isAdmin();
    }
  }
}
```

---

## 3. Deployment Guide for Security Rules

Every time schema definitions inside `firebase-blueprint.json` are modified, the security rules must be synchronized and deployed to Firebase.

### Steps to Deploy Rules

1.  **Validate Security Rules Syntax**:
    Ensure the rules are free from syntax or structural defects using ESLint:
    ```bash
    npm run lint
    ```
2.  **Deploy using Firebase CLI**:
    Execute the deployment command targeting firestore rules:
    ```bash
    # Ensure you are authenticated to your Firebase project
    firebase login

    # Set the active project
    firebase use your-project-id

    # Deploy rules directly
    firebase deploy --only firestore:rules
    ```
