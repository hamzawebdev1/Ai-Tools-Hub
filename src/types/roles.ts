export type Role =
  | "super_admin"
  | "admin"
  | "manager"
  | "editor"
  | "moderator"
  | "support"
  | "user"
  | "guest";

export interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  color: string;
  allowedTabs: string[];
  permissions: {
    manageAdmins: boolean;
    manageUsers: boolean;
    deleteUsers: boolean;
    manageRoles: boolean;
    manageTools: boolean;
    manageCategories: boolean;
    manageBlog: boolean;
    manageInbox: boolean;
    manageReports: boolean;
    manageFeatures: boolean;
    manageNewsletter: boolean;
    manageMedia: boolean;
    manageSEO: boolean;
    manageSettings: boolean;
    manageSecurity: boolean;
    exportBackup: boolean;
  };
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  super_admin: {
    id: "super_admin",
    label: "Super Admin",
    description: "Full system authority. Manages Admins, Roles, Security & Settings.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    allowedTabs: [
      "overview",
      "analytics",
      "users",
      "tools",
      "categories",
      "blog",
      "inbox",
      "newsletter",
      "settings",
      "audit-logs",
    ],
    permissions: {
      manageAdmins: true,
      manageUsers: true,
      deleteUsers: true,
      manageRoles: true,
      manageTools: true,
      manageCategories: true,
      manageBlog: true,
      manageInbox: true,
      manageReports: true,
      manageFeatures: true,
      manageNewsletter: true,
      manageMedia: true,
      manageSEO: true,
      manageSettings: true,
      manageSecurity: true,
      exportBackup: true,
    },
  },
  admin: {
    id: "admin",
    label: "Admin",
    description: "Manages users, tools, blog, SEO, reports, and newsletter.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    allowedTabs: [
      "overview",
      "analytics",
      "users",
      "tools",
      "categories",
      "blog",
      "inbox",
      "newsletter",
      "settings",
      "audit-logs",
    ],
    permissions: {
      manageAdmins: false,
      manageUsers: true,
      deleteUsers: true,
      manageRoles: false,
      manageTools: true,
      manageCategories: true,
      manageBlog: true,
      manageInbox: true,
      manageReports: true,
      manageFeatures: true,
      manageNewsletter: true,
      manageMedia: true,
      manageSEO: true,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  manager: {
    id: "manager",
    label: "Manager",
    description: "Views analytics, manages newsletter, reports, and support tickets.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    allowedTabs: ["overview", "analytics", "users", "inbox", "newsletter", "audit-logs"],
    permissions: {
      manageAdmins: false,
      manageUsers: true,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: false,
      manageBlog: false,
      manageInbox: true,
      manageReports: true,
      manageFeatures: true,
      manageNewsletter: true,
      manageMedia: false,
      manageSEO: false,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  editor: {
    id: "editor",
    label: "Editor",
    description: "Creates and publishes blog posts, pages, categories, and media.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    allowedTabs: ["overview", "blog", "categories"],
    permissions: {
      manageAdmins: false,
      manageUsers: false,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: true,
      manageBlog: true,
      manageInbox: false,
      manageReports: false,
      manageFeatures: false,
      manageNewsletter: false,
      manageMedia: true,
      manageSEO: true,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  moderator: {
    id: "moderator",
    label: "Moderator",
    description: "Moderates blog comments, support tickets, and community posts.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    allowedTabs: ["overview", "blog", "inbox"],
    permissions: {
      manageAdmins: false,
      manageUsers: false,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: false,
      manageBlog: true,
      manageInbox: true,
      manageReports: true,
      manageFeatures: true,
      manageNewsletter: false,
      manageMedia: false,
      manageSEO: false,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  support: {
    id: "support",
    label: "Support Agent",
    description: "Handles user contact messages, bug reports, and feature requests.",
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    allowedTabs: ["overview", "inbox"],
    permissions: {
      manageAdmins: false,
      manageUsers: false,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: false,
      manageBlog: false,
      manageInbox: true,
      manageReports: true,
      manageFeatures: true,
      manageNewsletter: false,
      manageMedia: false,
      manageSEO: false,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  user: {
    id: "user",
    label: "User",
    description: "Standard registered user account. No administrative access.",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
    allowedTabs: [],
    permissions: {
      manageAdmins: false,
      manageUsers: false,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: false,
      manageBlog: false,
      manageInbox: false,
      manageReports: false,
      manageFeatures: false,
      manageNewsletter: false,
      manageMedia: false,
      manageSEO: false,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
  guest: {
    id: "guest",
    label: "Guest",
    description: "Unauthenticated guest visitor.",
    color: "bg-slate-400/10 text-slate-400 border-slate-400/30",
    allowedTabs: [],
    permissions: {
      manageAdmins: false,
      manageUsers: false,
      deleteUsers: false,
      manageRoles: false,
      manageTools: false,
      manageCategories: false,
      manageBlog: false,
      manageInbox: false,
      manageReports: false,
      manageFeatures: false,
      manageNewsletter: false,
      manageMedia: false,
      manageSEO: false,
      manageSettings: false,
      manageSecurity: false,
      exportBackup: false,
    },
  },
};
