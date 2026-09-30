import type { ReactNode } from "react";

export function cx(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Tag id={id} className={cx("rounded-xl border border-line bg-white", className)}>
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "text-xs font-medium tracking-[0.18em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

type PillTone = "sage" | "neutral" | "solid" | "outline";

const PILL_TONES: Record<PillTone, string> = {
  sage: "bg-sage-soft text-sage",
  neutral: "bg-mist text-body",
  solid: "bg-sage text-white",
  outline: "border border-line bg-white text-body",
};

export function Pill({
  children,
  tone = "sage",
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type IconTileSize = "md" | "lg" | "xl";
type IconTileTone = "soft" | "white";

const ICON_TILE_SIZES: Record<IconTileSize, string> = {
  md: "h-10 w-10",
  lg: "h-11 w-11",
  xl: "h-12 w-12",
};

const ICON_TILE_TONES: Record<IconTileTone, string> = {
  soft: "bg-sage-soft text-sage",
  white: "bg-white text-sage",
};

export function IconTile({
  children,
  size = "md",
  tone = "soft",
  rounded = "lg",
  shrink = true,
  className,
}: {
  children: ReactNode;
  size?: IconTileSize;
  tone?: IconTileTone;
  rounded?: "md" | "lg";
  shrink?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "grid place-items-center",
        ICON_TILE_SIZES[size],
        rounded === "lg" ? "rounded-lg" : "rounded-md",
        ICON_TILE_TONES[tone],
        shrink && "shrink-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "sage",
  className,
  label,
}: {
  value: number;
  tone?: "sage" | "light";
  className?: string;
  label?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <span
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cx(
        "block h-1.5 overflow-hidden rounded-full bg-sage-soft",
        className,
      )}
    >
      <span
        className={cx(
          "block h-full rounded-full transition-[width] duration-500",
          tone === "sage" ? "bg-sage" : "bg-sage/50",
        )}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}

export function ProgressRing({
  value,
  size = 112,
  thickness = 8,
  children,
}: {
  value: number;
  size?: number;
  thickness?: number;
  children?: ReactNode;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--color-sage) ${width * 3.6}deg, var(--color-sage-soft) 0deg)`,
      }}
      role="img"
      aria-label={`Progres ${width} persen`}
    >
      <div
        className="grid place-items-center rounded-full bg-white text-center"
        style={{ width: size - thickness * 2, height: size - thickness * 2 }}
      >
        {children}
      </div>
    </div>
  );
}

export function MacroRow({
  label,
  value,
  target,
  unit = "g",
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
}) {
  const percent = target > 0 ? Math.round((value / target) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink">{label}</span>
        <span className="text-xs text-body tabular-nums">
          <span className="font-semibold text-ink">
            {value}
            {unit}
          </span>{" "}
          / {target}
          {unit}
        </span>
      </div>
      <ProgressBar className="mt-2" value={percent} label={`${label} ${percent}%`} />
    </div>
  );
}

type FilterChipVariant = "mist" | "outline";

const FILTER_CHIP_INACTIVE: Record<FilterChipVariant, string> = {
  mist: "bg-mist text-body hover:text-sage",
  outline: "border border-line bg-white text-body hover:border-sage hover:text-sage",
};

export function FilterChip({
  active,
  onClick,
  variant = "mist",
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  variant?: FilterChipVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full px-3.5 py-1.5 text-xs transition-colors",
        active ? "bg-sage text-white" : FILTER_CHIP_INACTIVE[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

const BUTTON_VARIANTS = {
  primary:
    "bg-sage text-white hover:bg-sage-dark focus-visible:outline-sage",
  secondary:
    "border border-line bg-white text-ink hover:border-sage hover:text-sage focus-visible:outline-sage",
  ghost: "bg-mist text-ink hover:bg-stone focus-visible:outline-sage",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function buttonClass(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    BUTTON_VARIANTS[variant],
    className,
  );
}

export const fieldClass =
  "w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-sage focus:ring-2 focus:ring-sage/20";

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink">
        {children}
      </label>
      {hint}
    </div>
  );
}
