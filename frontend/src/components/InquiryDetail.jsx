import { Download, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const STATUSES = ["new", "reviewing", "quoted", "closed"];

const Row = ({ label, value }) => (
  <div className="border-b border-[color:var(--hairline)] py-3">
    <p className="label-tech">{label}</p>
    <p className="mt-1.5 whitespace-pre-wrap text-sm text-[color:var(--graphite)]">{value || "—"}</p>
  </div>
);

export const InquiryDetail = ({ inquiry, isAdmin, onClose, onStatus, onDownload, onResend }) => (
  <Sheet open={!!inquiry} onOpenChange={(o) => !o && onClose()}>
    <SheetContent
      side="right"
      className="w-full overflow-y-auto border-[color:var(--hairline)] bg-[color:var(--surface)] sm:max-w-lg"
      data-testid="inquiry-detail-panel"
    >
      {inquiry && (
        <>
          <SheetHeader>
            <SheetTitle className="font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
              {inquiry.id}
            </SheetTitle>
          </SheetHeader>

          {isAdmin && (
            <div className="mt-6 flex flex-wrap gap-2" data-testid="inquiry-status-actions">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(inquiry.id, s)}
                  data-testid={`status-btn-${s}`}
                  className={`border px-3 py-1.5 font-tech text-[9px] uppercase tracking-[0.16em] transition-colors ${
                    inquiry.status === s
                      ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)] text-[color:var(--gold-deep)]"
                      : "border-[color:var(--hairline-strong)] text-[color:var(--slate)] hover:border-[color:var(--gold)] hover:text-[color:var(--graphite)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Row label="Company" value={inquiry.company} />
            <Row label="Contact person" value={inquiry.contact_name} />
            <Row label="Email" value={inquiry.email} />
            <Row label="Phone" value={inquiry.phone} />
            <Row label="Interested service" value={inquiry.service_label} />
            <Row label="Approximate quantity" value={inquiry.quantity} />
            <Row label="Target timeline" value={inquiry.timeline} />
            <Row label="Project description" value={inquiry.description} />
            <Row label="Consent to processing" value={inquiry.consent ? "Given" : "Not given"} />
            <Row label="Received" value={new Date(inquiry.created_at).toLocaleString()} />
            <Row label="Notification email" value={inquiry.email_status} />
            {inquiry.email_error && <Row label="Delivery error" value={inquiry.email_error} />}
          </div>

          {isAdmin && (
            <button
              onClick={() => onResend(inquiry.id)}
              data-testid="resend-notification-btn"
              className="btn-press mt-5 flex items-center gap-2 border border-[color:var(--hairline-strong)] px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--graphite)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)]"
            >
              <Send size={12} /> Resend notification
            </button>
          )}

          <div className="mt-6">
            <p className="label-tech">Attachments</p>
            {inquiry.files?.length ? (
              <ul className="mt-3 space-y-2">
                {inquiry.files.map((f) => (
                  <li
                    key={f.file_id}
                    className="flex items-center justify-between gap-3 border border-[color:var(--hairline)] bg-[color:var(--ivory)] px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-xs text-[color:var(--graphite)]">{f.filename}</span>
                    {isAdmin && (
                      <button
                        onClick={() => onDownload(f)}
                        data-testid={`download-file-${f.file_id}`}
                        className="flex items-center gap-1.5 font-tech text-[10px] uppercase tracking-[0.14em] text-[color:var(--gold-deep)] hover:underline"
                      >
                        <Download size={12} /> Download
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[color:var(--slate)]">No files attached</p>
            )}
          </div>
        </>
      )}
    </SheetContent>
  </Sheet>
);

export default InquiryDetail;
