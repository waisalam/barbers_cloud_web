"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.enum(["general", "shop-owner", "support", "press", "other"]).refine(
    (v) => v !== undefined,
    { message: "Please select a subject" }
  ),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string[]>>;
};

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors as ContactFormState["errors"],
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    // TODO: replace with your database call, e.g.:
    // await db.insert(contactSubmissions).values({ name, email, subject, message, createdAt: new Date() });

    // Placeholder: log to console in development
    console.log("[Contact submission]", { name, email, subject, message, at: new Date().toISOString() });

    // Optional: send to your existing backend API
    if (process.env.NEXT_PUBLIC_API_URL) {
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, { method: "POST", ... })
    }

    return {
      status: "success",
      message: `Thanks ${name}! We received your message and will get back to you within 24 hours.`,
    };
  } catch (err) {
    console.error("[Contact submission error]", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
