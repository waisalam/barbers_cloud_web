"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createAdminToken, setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/admin-rate-limit";
import { addAuditEntry } from "@/lib/admin-audit";
import { headers } from "next/headers";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = (formData.get("email")    as string | null)?.trim()    ?? "";
  const password = (formData.get("password") as string | null)?.trim()    ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Rate limit by IP — prevents brute-force attacks
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rl = checkRateLimit(`admin-login:${ip}`);

  if (!rl.allowed) {
    const mins = Math.ceil(rl.resetInMs / 60_000);
    return { error: `Too many attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.` };
  }

  // Constant-time credential check — never reveal which field is wrong
  const adminEmail    = process.env.ADMIN_EMAIL ?? "";
  const passwordHash  = process.env.ADMIN_PASSWORD_HASH ?? "";

console.log("DEBUG email match:", adminEmail === email);
console.log("DEBUG adminEmail:", JSON.stringify(adminEmail));
console.log("DEBUG entered email:", JSON.stringify(email));
console.log("DEBUG hash exists:", !!passwordHash);
console.log("DEBUG hash value:", passwordHash?.substring(0, 10));


  const emailMatch    = adminEmail    === email;
  // Always run bcrypt even if email is wrong (prevents timing attacks)
  const passwordMatch = passwordHash
    ? await bcrypt.compare(password, passwordHash)
    : false;

  if (!emailMatch || !passwordMatch) {
    return { error: "Invalid credentials." };
  }

  // Issue session token and set HTTP-only cookie
  const token = await createAdminToken(email);
  await setAdminCookie(token);

  addAuditEntry(email, "LOGIN", email, "Successful login");

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}
