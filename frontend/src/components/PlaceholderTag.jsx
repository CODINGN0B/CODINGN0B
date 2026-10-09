import { Info } from "lucide-react";

/**
 * Marks content that has NOT been confirmed by the company and must be replaced
 * or removed by the owner before launch.
 */
export const PlaceholderTag = ({ className = "", absolute = true, label = "Placeholder — for owner review" }) => (
  <span
    data-testid="placeholder-tag"
    className={`inline-flex items-center gap-1.5 border border-[color:var(--gold)]/60 bg-white/95 px-2 py-1 font-tech text-[9px] uppercase tracking-[0.16em] text-[color:var(--gold-deep)] shadow-card backdrop-blur-sm ${
      absolute ? "absolute right-4 top-4 z-10" : ""
    } ${className}`}
  >
    <Info size={10} strokeWidth={2} /> {label}
  </span>
);

export default PlaceholderTag;
