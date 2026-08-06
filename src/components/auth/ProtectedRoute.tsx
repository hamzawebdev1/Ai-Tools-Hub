import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onOpenAuthModal?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onOpenAuthModal }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Authenticating secure session...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-6 shadow-xl">
        <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You must be logged in with a verified account to access this tool or page.
          </p>
        </div>
        <button
          onClick={() => onOpenAuthModal && onOpenAuthModal()}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Log In or Register Account
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
