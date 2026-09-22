const ITEMS = [
  ["Precision Tooling", "精密模具"],
  ["Injection Molding", "注塑成型"],
  ["Metal Stamping", "金屬沖壓"],
  ["2K Overmolding", "雙色包膠"],
  ["Automated Assembly", "自動化組裝"],
  ["Micron Tolerance", "微米公差"],
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-[#0d0d0f] py-5" data-testid="editorial-marquee">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {row.map(([en, tc], i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-sm uppercase tracking-[0.3em] text-zinc-500">{en}</span>
            <span className="text-sm tracking-[0.3em] text-[#D4AF37]/70">{tc}</span>
            <span className="text-[10px] text-[#00F3FF]/60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
