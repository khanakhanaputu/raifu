type LogoProps = {
  /** Tinggi block katakana dalam px; logotype menyesuaikan. */
  size?: "sm" | "md" | "lg";
  /** Varian terang untuk dipakai di atas background sage. */
  tone?: "dark" | "light";
  showKatakanaWordmark?: boolean;
};

const SIZES = {
  sm: { block: "h-6 w-3.5 text-[7px]", type: "text-lg" },
  md: { block: "h-8 w-[18px] text-[8px]", type: "text-2xl" },
  lg: { block: "h-11 w-6 text-[10px]", type: "text-3xl" },
} as const;

/**
 * Logo Raifu: block sage berisi katakana ライフ (vertikal) + logotype serif,
 * dengan titik huruf "i" diganti warna sage sesuai panduan branding.
 */
export function Logo({ size = "md", tone = "dark", showKatakanaWordmark = false }: LogoProps) {
  const s = SIZES[size];
  const isLight = tone === "light";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={`${s.block} flex flex-col items-center justify-center gap-[1px] rounded-[2px] font-jp leading-none tracking-tight ${
          isLight ? "bg-white text-sage" : "bg-sage text-white"
        }`}
      >
        <span>ラ</span>
        <span>イ</span>
        <span>フ</span>
      </span>

      <span
        className={`font-serif font-semibold tracking-tight ${s.type} ${
          isLight ? "text-white" : "text-ink"
        }`}
      >
        Ra
        {/* Aksen sage pada huruf "i" — penanda yang menyatukan logotype
            dengan block katakana, sesuai panduan branding Raifu. */}
        <span aria-hidden className={isLight ? "text-sage-soft" : "text-sage"}>
          i
        </span>
        fu
      </span>

      {showKatakanaWordmark && (
        <span
          aria-hidden
          className={`hidden font-jp text-xs tracking-[0.2em] sm:inline ${isLight ? "text-white/70" : "text-muted"}`}
        >
          ライフ
        </span>
      )}
      <span className="sr-only">Raifu</span>
    </span>
  );
}
