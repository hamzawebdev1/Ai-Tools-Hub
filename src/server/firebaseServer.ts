import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Firestore,
} from "firebase/firestore";
import fs from "fs";
import path from "path";

let dbInstance: Firestore | null = null;

export function getServerFirestore(): Firestore | null {
  if (dbInstance) return dbInstance;

  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(raw);
      if (config.apiKey && config.projectId) {
        const app = !getApps().length ? initializeApp(config) : getApp();
        dbInstance =
          config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
            ? getFirestore(app, config.firestoreDatabaseId)
            : getFirestore(app);
        console.log("✅ Firestore server connection initialized successfully.");
        return dbInstance;
      }
    }
  } catch (err) {
    console.error("⚠️ Failed to initialize Server Firestore:", err);
  }
  return null;
}

export async function persistDocument(collectionName: string, docId: string, data: any): Promise<boolean> {
  const db = getServerFirestore();
  if (!db) return false;
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
    return true;
  } catch (err) {
    console.error(`⚠️ Error writing document to Firestore [${collectionName}/${docId}]:`, err);
    return false;
  }
}

export async function fetchCollectionDocs(collectionName: string, maxLimit = 100): Promise<any[]> {
  const db = getServerFirestore();
  if (!db) return [];
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, limit(maxLimit));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach((d) => {
      results.push({ id: d.id, ...d.data() });
    });
    return results;
  } catch (err) {
    console.error(`⚠️ Error fetching collection from Firestore [${collectionName}]:`, err);
    return [];
  }
}

export async function removeDocument(collectionName: string, docId: string): Promise<boolean> {
  const db = getServerFirestore();
  if (!db) return false;
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (err) {
    console.error(`⚠️ Error deleting document from Firestore [${collectionName}/${docId}]:`, err);
    return false;
  }
}
