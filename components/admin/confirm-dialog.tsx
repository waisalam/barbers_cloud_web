"use client";

import { useRef, useEffect, useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  dangerLevel?: "warning" | "danger";
  requireReason?: boolean;
  confirmLabel?: string;
  onConfirm: (reason?: string) => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  dangerLevel = "danger",
  requireReason = false,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setReason("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [loading, onCancel]);

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) return;
    setLoading(true);
    try {
      await onConfirm(reason.trim() || undefined);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isDanger = dangerLevel === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isDanger ? "bg-red-500/15" : "bg-amber-500/15"
            )}>
              <AlertTriangle className={cn("h-5 w-5", isDanger ? "text-red-400" : "text-amber-400")} />
            </div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm text-zinc-400">{description}</p>

          {requireReason && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                ref={inputRef}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Describe the reason for this action…"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors resize-none"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (requireReason && !reason.trim())}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              isDanger
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-black"
            )}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
