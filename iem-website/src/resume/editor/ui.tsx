"use client";

/**
 * Small form primitives, styled with the site's own tokens so the builder
 * reads as part of the department site rather than a bolted-on tool.
 */

import {
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const control =
  "w-full rounded-lg border border-primary/15 bg-white px-3 py-2 text-[15px] text-foreground " +
  "placeholder:text-text-muted/60 focus:border-primary-light focus:outline-none " +
  "focus:ring-2 focus:ring-primary-light/25 transition-colors";

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] uppercase tracking-[0.09em] text-text-muted"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-snug text-text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input id={id} className={control} {...props} />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  rows = 3,
  ...props
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea id={id} rows={rows} className={`${control} resize-y leading-relaxed`} {...props} />
    </Field>
  );
}

export function Select({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <select id={id} className={`${control} cursor-pointer`} {...props}>
        {children}
      </select>
    </Field>
  );
}

type ButtonTone = "primary" | "quiet" | "danger";

const tones: Record<ButtonTone, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  quiet: "border border-primary/20 bg-white text-primary hover:border-primary/50 hover:bg-surface",
  danger: "text-accent hover:bg-accent/10",
};

export function Button({
  tone = "quiet",
  className = "",
  children,
  ...props
}: { tone?: ButtonTone; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium " +
        "transition-colors disabled:cursor-not-allowed disabled:opacity-45 " +
        `${tones[tone]} ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  title,
  children,
  className = "",
  ...props
}: { title: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={
        "grid h-7 w-7 place-items-center rounded-md text-text-muted transition-colors " +
        `hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
}

export function Chevron({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform ${down ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function Cross() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Grip() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${up ? "" : "rotate-180"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
