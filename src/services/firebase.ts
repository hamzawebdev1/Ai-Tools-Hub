import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  deleteUser,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
  AuthError
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore (handling custom database ID if present)
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export interface UserDocument {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  photo: string;
  photoURL: string;
  provider: string;
  createdAt: string;
  lastLogin: string;
  favorites: string[];
  history: Array<{
    id: string;
    toolId: string;
    toolName: string;
    prompt: string;
    output: string;
    timestamp: string;
    wordCount: number;
    executionTimeMs: number;
  }>;
  settings: {
    theme: "dark" | "light" | "system";
    notifications: boolean;
  };
  role: "user" | "admin";
  guestUsageCount: number;
  guestUsage: number;
  registeredStatus: boolean;
}

import { getStoredFavorites, getStoredHistory } from "./storageService";

/**
 * Creates or updates a user document in Firestore `users/{uid}`.
 */
export async function syncUserDocument(user: FirebaseUser, extraName?: string): Promise<UserDocument> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const now = new Date().toISOString();

  if (snap.exists()) {
    const existing = snap.data() as any;
    const nameVal = user.displayName || extraName || existing.name || existing.displayName || "User";
    const photoVal = user.photoURL || existing.photo || existing.photoURL || "";
    
    const updatedData = {
      lastLogin: now,
      name: nameVal,
      displayName: nameVal,
      photo: photoVal,
      photoURL: photoVal,
      email: user.email || existing.email || "",
    };
    await updateDoc(userRef, updatedData);
    return { ...existing, ...updatedData };
  } else {
    const localFavs = getStoredFavorites();
    const localHist = getStoredHistory();

    const nameVal = user.displayName || extraName || (user.email ? user.email.split("@")[0] : "User");
    const photoVal = user.photoURL || "";

    const newUserDoc: UserDocument = {
      uid: user.uid,
      name: nameVal,
      displayName: nameVal,
      email: user.email || "",
      photo: photoVal,
      photoURL: photoVal,
      provider: user.providerData[0]?.providerId || "password",
      createdAt: now,
      lastLogin: now,
      favorites: localFavs,
      history: localHist as any,
      settings: {
        theme: "system",
        notifications: true,
      },
      role: user.email === "admin@security.hub" || user.email?.endsWith("@aitoolshub.com") ? "admin" : "user",
      guestUsageCount: 0,
      guestUsage: 0,
      registeredStatus: true,
    };
    await setDoc(userRef, newUserDoc);
    return newUserDoc;
  }
}

/**
 * Converts Firebase Auth error codes to user-friendly messages.
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred.";
  const code = error.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "This email address is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled. Please contact support.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters with mixed numbers and letters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password combination.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please wait a few minutes before trying again.";
    case "auth/requires-recent-login":
      return "Security timeout. Please log out and log in again to complete this operation.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  deleteUser,
  signInWithRedirect,
  getRedirectResult,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
};
