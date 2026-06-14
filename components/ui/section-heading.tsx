import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  center = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      {label && (
        <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-500 mb-4">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold lg:text-5xl text-foreground">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg text-muted-foreground leading-relaxed", center && "mx-auto max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
