import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "enterprise-super-secure-jwt-secret-key-512bit";
const SALT_ROUNDS = 12;

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  passwordHash?: string;
  isEmailVerified: boolean;
  googleId?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  failedLoginAttempts: number;
  lockoutUntil?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  type: "FAILED_LOGIN_LOCKOUT" | "SUSPICIOUS_IP" | "XSS_ATTEMPT" | "CSRF_MISMATCH" | "UNAUTHORIZED_ADMIN_ACCESS";
  severity: "HIGH" | "CRITICAL" | "MEDIUM";
  details: string;
  ip: string;
  userEmail?: string;
}

// In-memory User Database & Security Log
const userStore: Map<string, User> = new Map(); // email -> User
const resetTokenStore: Map<string, { email: string; expiresAtMs: number }> = new Map(); // token -> email
const securityAlerts: SecurityAlert[] = [];

// Seed default Admin Account securely
async function initDefaultAdmin() {
  const adminEmail = "admin@security.hub";
  if (!userStore.has(adminEmail)) {
    const defaultPasswordHash = await bcrypt.hash("AdminSecret2026!#", SALT_ROUNDS);
    userStore.set(adminEmail, {
      id: "usr_admin_001",
      email: adminEmail,
      name: "Security Admin",
      role: "ADMIN",
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString(),
    });
  }
}
initDefaultAdmin();

export function createSecurityAlert(
  type: SecurityAlert["type"],
  severity: SecurityAlert["severity"],
  details: string,
  ip: string,
  userEmail?: string
) {
  const alert: SecurityAlert = {
    id: "alt_" + crypto.randomBytes(8).toString("hex"),
    timestamp: new Date().toISOString(),
    type,
    severity,
    details,
    ip,
    userEmail,
  };
  securityAlerts.unshift(alert);
  if (securityAlerts.length > 200) securityAlerts.pop();
  console.warn(`[SECURITY ALERT] [${alert.severity}] [${alert.type}] ${details} (IP: ${ip})`);
}

export function getSecurityAlerts(): SecurityAlert[] {
  return securityAlerts;
}

/**
 * Register a new user with strong password complexity check
 */
export async function registerUser(
  email: string,
  name: string,
  password: string,
  ip: string
): Promise<{ success: boolean; user?: Omit<User, "passwordHash">; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  if (userStore.has(cleanEmail)) {
    return { success: false, error: "An account with this email address already exists." };
  }

  // Strong Password Complexity Check (OWASP Authentication Guidelines)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      error: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special symbol.",
    };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = "usr_" + crypto.randomBytes(12).toString("hex");

  const newUser: User = {
    id: userId,
    email: cleanEmail,
    name,
    role: "USER",
    passwordHash,
    isEmailVerified: true,
    twoFactorEnabled: false, // Disable OTP 2FA
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  userStore.set(cleanEmail, newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

/**
 * Login user directly
 */
export async function authenticateLogin(
  email: string,
  password: string,
  ip: string
): Promise<{
  success: boolean;
  user?: Omit<User, "passwordHash">;
  token?: string;
  error?: string;
}> {
  const cleanEmail = email.toLowerCase().trim();
  const user = userStore.get(cleanEmail);

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  // Check Account Lockout
  if (user.lockoutUntil) {
    const lockoutEnd = new Date(user.lockoutUntil).getTime();
    if (Date.now() < lockoutEnd) {
      const remainingMins = Math.ceil((lockoutEnd - Date.now()) / (1000 * 60));
      createSecurityAlert("FAILED_LOGIN_LOCKOUT", "HIGH", `Attempted login during account lockout.`, ip, cleanEmail);
      return {
        success: false,
        error: `Account is locked due to multiple failed login attempts. Try again in ${remainingMins} minutes.`,
      };
    } else {
      // Clear expired lockout
      user.lockoutUntil = undefined;
      user.failedLoginAttempts = 0;
    }
  }

  if (!user.passwordHash) {
    return { success: false, error: "Please log in using Google OAuth." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Lock for 15 mins
      createSecurityAlert(
        "FAILED_LOGIN_LOCKOUT",
        "CRITICAL",
        `Account locked: 5 consecutive failed login attempts detected.`,
        ip,
        cleanEmail
      );
      return {
        success: false,
        error: "Account locked for 15 minutes due to 5 consecutive failed login attempts.",
      };
    }
    return { success: false, error: `Invalid email or password. (${5 - user.failedLoginAttempts} attempts remaining)` };
  }

  // Reset failed login counter on success
  user.failedLoginAttempts = 0;
  user.lastLoginAt = new Date().toISOString();

  // Issue JWT Token directly (2FA disabled completely)
  const token = generateAccessToken(user);
  const { passwordHash: _, ...safeUser } = user;
  return { success: true, user: safeUser, token };
}

/**
 * Google Sign-In or Google OAuth Payload Handler
 */
export async function authenticateGoogleUser(
  googleId: string,
  email: string,
  name: string,
  ip: string
): Promise<{ success: boolean; user: Omit<User, "passwordHash">; token: string }> {
  const cleanEmail = email.toLowerCase().trim();
  let user = userStore.get(cleanEmail);

  if (!user) {
    user = {
      id: "usr_g_" + crypto.randomBytes(10).toString("hex"),
      email: cleanEmail,
      name,
      role: "USER",
      googleId,
      isEmailVerified: true,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    userStore.set(cleanEmail, user);
  } else {
    user.googleId = googleId;
    user.lastLoginAt = new Date().toISOString();
  }

  const token = generateAccessToken(user);
  const { passwordHash: _, ...safeUser } = user;
  return { success: true, user: safeUser, token };
}

/**
 * Password Reset Workflow
 */
export function requestPasswordReset(email: string): { success: boolean; message: string; demoToken?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const user = userStore.get(cleanEmail);

  if (!user) {
    // OWASP: Do not reveal whether user exists
    return { success: true, message: "If an account exists for this email, password reset instructions have been issued." };
  }

  const resetToken = "rst_" + crypto.randomBytes(24).toString("hex");
  resetTokenStore.set(resetToken, {
    email: cleanEmail,
    expiresAtMs: Date.now() + 15 * 60 * 1000, // 15 mins
  });

  return {
    success: true,
    message: "Password reset link issued. Use token within 15 minutes.",
    demoToken: resetToken,
  };
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const tokenData = resetTokenStore.get(token);
  if (!tokenData || Date.now() > tokenData.expiresAtMs) {
    return { success: false, error: "Invalid or expired password reset token." };
  }

  const user = userStore.get(tokenData.email);
  if (!user) {
    return { success: false, error: "User account not found." };
  }

  // Password complexity check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return {
      success: false,
      error: "Password must be at least 8 characters long with uppercase, lowercase, number, and special character.",
    };
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.lockoutUntil = undefined;
  user.failedLoginAttempts = 0;
  resetTokenStore.delete(token);

  return { success: true };
}

/**
 * Generate signed JWT Token
 */
export function generateAccessToken(user: User): string {
  return jsonwebtoken.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h", algorithm: "HS256" }
  );
}

/**
 * Verify JWT Token
 */
export function verifyAccessToken(token: string): any {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (err) {
    return null;
  }
}

export function getUserByEmail(email: string): User | undefined {
  return userStore.get(email.toLowerCase().trim());
}
