import { Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const STATUSES = ["new", "reviewing", "quoted", "closed"];

const Row = ({ label, value }) => (
  <div className="border-b border-white/5 py-3">
    <p className="label-tech">{label}</p>
    <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-200">{value || "—"}</p>
  </div>
);

export const QuoteDetail = ({ quote, isAdmin, onClose, onStatus, onDownload }) => (
  <Sheet open={!!quote} onOpenChange={(o) => !o && onClose()}>
    <SheetContent
      side="right"
      className="w-full overflow-y-auto border-white/10 bg-[#0b0d0f] text-zinc-100 sm:max-w-lg"
      data-testid="quote-detail-panel"
    >
      {quote && (
        <>
          <SheetHeader>
            <SheetTitle className="font-display text-xl font-semibold uppercase tracking-tight text-white">
              {quote.id}
            </SheetTitle>
          </SheetHeader>

          {isAdmin && (
            <div className="mt-6 flex flex-wrap gap-2" data-testid="quote-status-actions">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(quote.id, s)}
                  data-testid={`status-btn-${s}`}
                  className={`rounded border px-3 py-1.5 font-tech text-[9px] uppercase tracking-[0.16em] transition-colors ${
                    quote.status === s
                      ? "border-[color:var(--steel)] bg-[color:var(--steel-soft)] text-[color:var(--steel)]"
                      : "border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Row label="Company" value={quote.company} />
            <Row label="Contact" value={quote.contact_name} />
            <Row label="Email" value={quote.email} />
            <Row label="Phone" value={quote.phone} />
            <Row label="Project" value={quote.project} />
            <Row label="Quantity" value={quote.quantity} />
            <Row label="Material" value={quote.material} />
            <Row label="Manufacturing requirements" value={quote.requirements} />
            <Row label="Additional requirements" value={quote.message} />
            <Row label="Received" value={new Date(quote.created_at).toLocaleString()} />
            <Row label="Notification email" value={quote.email_status} />
          </div>

          <div className="mt-6">
            <p className="label-tech">Attachments</p>
            {quote.files?.length ? (
              <ul className="mt-3 space-y-2">
                {quote.files.map((f) => (
                  <li
                    key={f.file_id}
                    className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/[0.02] px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-xs text-zinc-300">{f.filename}</span>
                    {isAdmin && (
                      <button
                        onClick={() => onDownload(f)}
                        data-testid={`download-file-${f.file_id}`}
                        className="flex items-center gap-1.5 font-tech text-[10px] uppercase tracking-[0.14em] text-[color:var(--steel)] hover:underline"
                      >
                        <Download size={12} /> Download
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">No files attached</p>
            )}
          </div>
        </>
      )}
    </SheetContent>
  </Sheet>
);

export default QuoteDetail;
