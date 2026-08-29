import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, LogOut, ArrowLeft, Loader2, Lock } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  onOpenAuthModal?: () => void;
  onNavigateHome?: () => void;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  onOpenAuthModal,
  onNavigateHome,
}) => {
  const { currentUser, userDoc, loading, logout } = useAuth();

  // Allow admins, managers, editors, super_admins, or default dev admin email
  const isAdmin = React.useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.email === "admin@security.hub") return true;

    const role = (userDoc?.role || "").toLowerCase();
    return ["super_admin", "admin", "manager", "editor"].includes(role);
  }, [currentUser, userDoc]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <h2 className="text-lg font-bold text-white">Verifying Admin Permissions...</h2>
          <p className="text-xs text-slate-400">
            Checking session credentials and authenticating database authorization rules.
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Admin Authentication Required
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Mehzan Digital Administration Console is restricted to authorized personnel. Please log in with an administrator account to continue.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal()}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              Log In to Admin Console
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Public Website
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized State (Logged in as standard non-admin user)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-rose-500 selection:text-white">
        <div className="bg-slate-900 border border-rose-900/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              403 Forbidden
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white pt-1">
              Access Denied: Admin Access Required
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account (<strong className="text-slate-200">{currentUser.email}</strong>) is currently registered with the role{" "}
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                {userDoc?.role || "user"}
              </span>.
              Administrative endpoints are restricted to Super Admin and Manager roles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left space-y-2">
            <p className="text-xs font-bold text-slate-300">How to request administrative access:</p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Contact the primary site owner at <span className="text-indigo-400">admin@mehzandigital.com</span></li>
              <li>Or log in with an authorized Super Admin account</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Website
              </button>
            )}

            <button
              onClick={() => logout()}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Switch User
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin
  return <>{children}</>;
};
