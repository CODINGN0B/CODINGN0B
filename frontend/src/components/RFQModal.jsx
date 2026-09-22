import { useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICES = ["Precision Mold Making 精密模具", "Metal Stamping 金屬沖壓", "2K / Overmolding 雙色包膠", "Automated Assembly 自動化組裝"];
const MATERIALS = ["ABS", "PC", "PC+ABS", "PA66-GF30", "PBT", "TPU", "SPCC Steel", "SUS304 Stainless", "Aluminum 5052", "Copper C1100"];
const TOLERANCES = ["±0.05 mm (Standard)", "±0.01 mm (Precision)", "±0.005 mm (High)", "±0.001 mm (Micron)"];
const VOLUMES = ["Prototype / EVT", "1,000 – 10,000", "10,000 – 100,000", "100,000+ / year"];

const fieldCls = "glass rounded-lg border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#D4AF37]/50";
const labelCls = "font-tech text-[10px] uppercase tracking-[0.22em] text-zinc-500";

const Field = ({ label, children, id }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={labelCls}>{label}</label>
    {children}
  </div>
);

export default function RFQModal({ open, onOpenChange }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", service: "", material: "", tolerance: "", volume: "", message: "" });
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInput = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const addFiles = (list) => {
    const next = [...files];
    for (const f of list) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 10 MB limit`);
        continue;
      }
      next.push({ name: f.name, size: f.size });
    }
    setFiles(next.slice(0, 5));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service) {
      toast.error("Please fill in name, email and service 請填寫姓名、電郵及服務");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/rfq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, files: files.map((f) => f.name) }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`RFQ ${data.id} received 已收到報價請求`, {
        description: "Our engineering team will respond within 24 hours. 工程團隊將於24小時內回覆。",
      });
      setForm({ name: "", company: "", email: "", service: "", material: "", tolerance: "", volume: "", message: "" });
      setFiles([]);
      onOpenChange(false);
    } catch {
      toast.error("Submission failed. Please try again. 提交失敗，請重試。");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass-deep metallic-edge max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border-white/10 p-0 text-zinc-100 sm:rounded-2xl"
        data-testid="rfq-modal"
      >
        <div className="border-b border-white/5 p-7 md:p-9">
          <DialogHeader>
            <p className="font-tech text-[10px] uppercase tracking-[0.35em] text-[#00F3FF]">Request for Quotation</p>
            <DialogTitle className="font-display mt-2 text-2xl font-semibold uppercase tracking-tight text-zinc-100 md:text-3xl">
              Tell us what you're <span className="text-[#D4AF37]">building</span>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-zinc-500">
              Engineering response within 24 hours. 工程團隊將於24小時內回覆。
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={submit} className="grid gap-5 p-7 md:grid-cols-2 md:p-9" data-testid="rfq-form">
          <Field label="Name 姓名 *" id="rfq-name">
            <Input id="rfq-name" data-testid="rfq-name-input" value={form.name} onChange={set("name")} placeholder="Ada Wong" className={fieldCls} />
          </Field>
          <Field label="Company 公司" id="rfq-company">
            <Input id="rfq-company" data-testid="rfq-company-input" value={form.company} onChange={set("company")} placeholder="Apex Automotive GmbH" className={fieldCls} />
          </Field>
          <Field label="Email 電郵 *" id="rfq-email">
            <Input id="rfq-email" data-testid="rfq-email-input" type="email" value={form.email} onChange={set("email")} placeholder="ada@apex-auto.com" className={fieldCls} />
          </Field>
          <Field label="Service 服務 *" id="rfq-service">
            <Select value={form.service} onValueChange={set("service")}>
              <SelectTrigger id="rfq-service" data-testid="rfq-service-select" className={fieldCls}>
                <SelectValue placeholder="Select service 選擇服務" />
              </SelectTrigger>
              <SelectContent className="glass-deep border-white/10 text-zinc-200">
                {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Material 材料" id="rfq-material">
            <Select value={form.material} onValueChange={set("material")}>
              <SelectTrigger id="rfq-material" data-testid="rfq-material-select" className={fieldCls}>
                <SelectValue placeholder="Select material 選擇材料" />
              </SelectTrigger>
              <SelectContent className="glass-deep border-white/10 text-zinc-200">
                {MATERIALS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tolerance 公差" id="rfq-tolerance">
            <Select value={form.tolerance} onValueChange={set("tolerance")}>
              <SelectTrigger id="rfq-tolerance" data-testid="rfq-tolerance-select" className={fieldCls}>
                <SelectValue placeholder="Select tolerance 選擇公差" />
              </SelectTrigger>
              <SelectContent className="glass-deep border-white/10 text-zinc-200">
                {TOLERANCES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Annual Volume 年產量" id="rfq-volume">
            <Select value={form.volume} onValueChange={set("volume")}>
              <SelectTrigger id="rfq-volume" data-testid="rfq-volume-select" className={fieldCls}>
                <SelectValue placeholder="Select volume 選擇產量" />
              </SelectTrigger>
              <SelectContent className="glass-deep border-white/10 text-zinc-200">
                {VOLUMES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className={labelCls}>Drawings / Specs 圖紙規格</span>
            <div
              role="button"
              tabIndex={0}
              data-testid="rfq-dropzone"
              onClick={() => fileInput.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInput.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              className={`glass flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-dashed px-6 py-8 transition-all duration-300 ${
                dragging ? "border-[#00F3FF]/60 shadow-[0_0_24px_rgba(0,243,255,0.15)]" : "hover:border-[#D4AF37]/40"
              }`}
            >
              <UploadCloud size={26} className={dragging ? "text-[#00F3FF]" : "text-[#D4AF37]"} />
              <p className="text-sm text-zinc-400">Drop STEP / PDF / DWG files, or <span className="text-[#D4AF37] underline underline-offset-4">browse</span></p>
              <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-600">Max 5 files · 10 MB each</p>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept=".step,.stp,.pdf,.dwg,.dxf,.iges,.igs,.zip,.png,.jpg"
                className="hidden"
                data-testid="rfq-file-input"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
              />
            </div>
            {files.length > 0 && (
              <ul className="flex flex-col gap-2" data-testid="rfq-file-list">
                {files.map((f, i) => (
                  <li key={i} className="glass flex items-center justify-between rounded-lg px-4 py-2.5" data-testid={`rfq-file-chip-${i}`}>
                    <span className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <FileText size={14} className="text-[#00F3FF]" />
                      {f.name}
                      <span className="font-tech text-[10px] text-zinc-600">{(f.size / 1024).toFixed(0)} KB</span>
                    </span>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-zinc-500 hover:text-red-400" data-testid={`rfq-file-remove-${i}`} aria-label="Remove file">
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-2">
            <Field label="Project Details 項目詳情" id="rfq-message">
              <Textarea id="rfq-message" data-testid="rfq-message-input" value={form.message} onChange={set("message")} rows={4} placeholder="Part function, critical dimensions, target launch date…" className={fieldCls} />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-4 md:col-span-2">
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-600">NDA available on request 可簽保密協議</p>
            <button
              type="submit"
              disabled={sending}
              data-testid="rfq-submit-btn"
              className="gold-glow flex items-center gap-2.5 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37] px-8 py-3.5 font-tech text-xs font-bold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {sending && <Loader2 size={15} className="animate-spin" />}
              {sending ? "Sending…" : "Submit RFQ 提交"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
