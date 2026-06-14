"use client";

import { useActionState } from "react";
import { useEffect, useRef } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ContactFormState = { status: "idle" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-500">{errors[0]}</p>;
}

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitContact, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {/* Success / Error banner */}
      {state.status === "success" && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
        </div>
      )}
      {state.status === "error" && !state.errors && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="name">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500",
              "transition-colors duration-200",
              state.errors?.name ? "border-red-500" : "border-border"
            )}
            placeholder="Your name"
          />
          <FieldError errors={state.errors?.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500",
              "transition-colors duration-200",
              state.errors?.email ? "border-red-500" : "border-border"
            )}
            placeholder="you@example.com"
          />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="subject">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500",
            "transition-colors duration-200",
            state.errors?.subject ? "border-red-500" : "border-border"
          )}
          defaultValue=""
        >
          <option value="" disabled>Select a subject…</option>
          <option value="general">General inquiry</option>
          <option value="shop-owner">I want to list my shop</option>
          <option value="support">Customer support</option>
          <option value="press">Press / media</option>
          <option value="other">Other</option>
        </select>
        <FieldError errors={state.errors?.subject} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="message">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500",
            "transition-colors duration-200",
            state.errors?.message ? "border-red-500" : "border-border"
          )}
          placeholder="Tell us what's on your mind…"
        />
        <FieldError errors={state.errors?.message} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full rounded-full py-3.5 text-sm font-semibold",
          "bg-amber-500 text-white hover:bg-amber-600",
          "transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
