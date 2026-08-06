import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithRedirect,
  getRedirectResult,
  syncUserDocument,
  getFriendlyAuthErrorMessage,
  UserDocument,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "../services/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userDoc: UserDocument | null;
  loading: boolean;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  loginWithEmail: (email: string, pass: string, remember?: boolean) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
  addHistoryItem: (item: UserDocument["history"][0]) => Promise<void>;
  updateSettings: (settings: Partial<UserDocument["settings"]>) => Promise<void>;
  updateUserProfileName: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sync auth state listener
  useEffect(() => {
    // Process Google redirect sign-in result if applicable
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          try {
            const docData = await syncUserDocument(result.user);
            setUserDoc(docData);
          } catch (err) {
            console.error("Failed to sync Firestore user document from redirect:", err);
          }
        }
      })
      .catch((err) => {
        console.error("Error checking redirect login result:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docData = await syncUserDocument(user);
          setUserDoc(docData);
        } catch (err) {
          console.error("Failed to sync Firestore user document:", err);
        }
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserDoc = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserDoc(snap.data() as UserDocument);
      }
    } catch (err) {
      console.error("Error refreshing user document:", err);
    }
  };

  const loginWithEmail = async (email: string, pass: string, remember: boolean = true) => {
    try {
      setLoading(true);
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const docData = await syncUserDocument(res.user);
      setUserDoc(docData);
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        // Send email verification
        try {
          await sendEmailVerification(res.user);
        } catch (vErr) {
          console.warn("Could not send email verification link automatically:", vErr);
        }
        const docData = await syncUserDocument(res.user, name);
        setUserDoc(docData);
      }
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const docData = await syncUserDocument(res.user);
        setUserDoc(docData);
      }
    } catch (err: any) {
      // If popup fails because popup is blocked, automatically fallback to signInWithRedirect
      if (
        err.code === "auth/popup-blocked" ||
        err.code === "auth/cancelled-popup-request" ||
        err.message?.toLowerCase()?.includes("popup")
      ) {
        console.warn("Popup blocked or closed, falling back to Redirect Authentication...");
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr: any) {
          throw new Error(getFriendlyAuthErrorMessage(redirectErr));
        }
      }
      throw new Error(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const sendResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserDoc(null);
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    }
  };

  const toggleFavorite = async (toolId: string) => {
    if (!currentUser || !userDoc) return;
    const isFav = userDoc.favorites?.includes(toolId);
    const userRef = doc(db, "users", currentUser.uid);

    try {
      if (isFav) {
        await updateDoc(userRef, {
          favorites: arrayRemove(toolId)
        });
        setUserDoc({
          ...userDoc,
          favorites: userDoc.favorites.filter((id) => id !== toolId)
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(toolId)
        });
        setUserDoc({
          ...userDoc,
          favorites: [...(userDoc.favorites || []), toolId]
        });
      }
    } catch (err) {
      console.error("Failed to update favorites in Firestore:", err);
    }
  };

  const addHistoryItem = async (item: UserDocument["history"][0]) => {
    if (!currentUser || !userDoc) return;
    const userRef = doc(db, "users", currentUser.uid);
    try {
      // Keep last 50 history items
      const updatedHistory = [item, ...(userDoc.history || [])].slice(0, 50);
      await updateDoc(userRef, {
        history: updatedHistory
      });
      setUserDoc({
        ...userDoc,
        history: updatedHistory
      });
    } catch (err) {
      console.error("Failed to add history item in Firestore:", err);
    }
  };

  const updateSettings = async (settings: Partial<UserDocument["settings"]>) => {
    if (!currentUser || !userDoc) return;
    const userRef = doc(db, "users", currentUser.uid);
    const newSettings = { ...userDoc.settings, ...settings };
    try {
      await updateDoc(userRef, { settings: newSettings });
      setUserDoc({
        ...userDoc,
        settings: newSettings
      });
    } catch (err) {
      console.error("Failed to update user settings:", err);
    }
  };

  const updateUserProfileName = async (name: string) => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, { displayName: name });
      if (userDoc) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { name });
        setUserDoc({ ...userDoc, name });
      }
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    try {
      const uid = currentUser.uid;
      // 1. Delete Firestore User Document if exists
      try {
        const userRef = doc(db, "users", uid);
        await deleteDoc(userRef);
      } catch (fErr) {
        console.warn("Firestore document deletion error:", fErr);
      }
      // 2. Delete Firebase Auth User
      await deleteUser(currentUser);
      setCurrentUser(null);
      setUserDoc(null);
    } catch (err: any) {
      throw new Error(getFriendlyAuthErrorMessage(err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDoc,
        loading,
        rememberMe,
        setRememberMe,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        sendResetEmail,
        sendVerificationEmail,
        logout,
        toggleFavorite,
        addHistoryItem,
        updateSettings,
        updateUserProfileName,
        deleteAccount,
        refreshUserDoc
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
