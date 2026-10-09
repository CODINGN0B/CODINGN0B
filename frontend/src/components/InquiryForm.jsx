import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { API, SERVICES } from "@/lib/site";

const ACCEPT = ".pdf,.dwg,.dxf,.step,.stp,.stl,.zip,.igs,.iges,.png,.jpg,.jpeg";
const ALLOWED = ["pdf", "dwg", "dxf", "step", "stp", "stl", "zip", "igs", "iges", "png", "jpg", "jpeg"];
const MAX_MB = 25;
const MAX_FILES = 8;

const EMPTY = {
  contact_name: "", company: "", email: "", phone: "",
  service: "", description: "", quantity: "", timeline: "", consent: false,
};

const fieldCls =
  "w-full rounded-sm border border-[color:var(--hairline-strong)] bg-white px-3.5 py-3 text-sm text-[color:var(--graphite)] placeholder:text-[color:var(--slate)]/60 transition-colors duration-200 focus:border-[color:var(--gold)] focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]";

const Field = ({ id, label, required, error, hint, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="label-tech !text-[color:var(--graphite-soft)]">
      {label} {required && <span className="text-[color:var(--gold-deep)]">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-[color:var(--slate)]">{hint}</p>}
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-[color:var(--destructive)]" role="alert" data-testid={`error-${id}`}>
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

export default function InquiryForm({ prefillService, onPrefillConsumed }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const inputRef = useRef(null);
  const serviceRef = useRef(null);

  useEffect(() => {
    if (!prefillService) return;
    setForm((f) => ({ ...f, service: prefillService }));
    setSubmitted(null);
    const t = setTimeout(() => {
      serviceRef.current?.focus({ preventScroll: true });
      onPrefillConsumed?.();
    }, 650);
    return () => clearTimeout(t);
  }, [prefillService, onPrefillConsumed]);

  const set = (k) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (form.contact_name.trim().length < 2) e.contact_name = "Contact name is required";
    if (!form.company.trim()) e.company = "Company name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = "Enter a valid business email address";
    if (!form.service) e.service = "Select the service you are interested in";
    if (form.description.trim().length < 10) e.description = "Please describe the project in at least 10 characters";
    if (!form.consent) e.consent = "Please confirm you consent to your details being processed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const uploadOne = (file) => {
    const tempId = `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setFiles((prev) => [...prev, { tempId, filename: file.name, size: file.size, progress: 0 }]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/inquiries/uploads`);
    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const pct = Math.round((ev.loaded / ev.total) * 100);
      setFiles((prev) => prev.map((f) => (f.tempId === tempId ? { ...f, progress: pct } : f)));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setFiles((prev) => prev.map((f) => (f.tempId === tempId ? { ...data, tempId } : f)));
      } else {
        let detail = "Upload failed";
        try { detail = JSON.parse(xhr.responseText).detail || detail; } catch { /* keep default */ }
        setFiles((prev) => prev.map((f) => (f.tempId === tempId ? { ...f, error: detail } : f)));
      }
    };
    xhr.onerror = () =>
      setFiles((prev) => prev.map((f) => (f.tempId === tempId ? { ...f, error: "Network error" } : f)));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  };

  const addFiles = (list) => {
    const rejected = [];
    for (const file of Array.from(list)) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED.includes(ext)) {
        rejected.push({ tempId: `${file.name}-type-${Date.now()}`, filename: file.name, size: file.size, error: "Unsupported file type" });
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        rejected.push({ tempId: `${file.name}-size-${Date.now()}`, filename: file.name, size: file.size, error: `Exceeds ${MAX_MB} MB limit` });
        continue;
      }
      if (files.length + rejected.length >= MAX_FILES) break;
      uploadOne(file);
    }
    if (rejected.length) setFiles((prev) => [...prev, ...rejected]);
  };

  const removeFile = (tempId) => setFiles((prev) => prev.filter((f) => f.tempId !== tempId));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return; // duplicate submission guard
    if (!validate()) return;
    if (files.some((f) => f.progress !== undefined && !f.file_id && !f.error)) {
      setErrors({ files: "Please wait until all files have finished uploading" });
      return;
    }
    setSending(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: "",
          file_ids: files.filter((f) => f.file_id).map((f) => f.file_id),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "We could not submit your inquiry. Your details have been kept — please try again."
        );
      }
      const data = await res.json();
      setSubmitted(data);
      setForm(EMPTY);
      setFiles([]);
    } catch (err) {
      // input is intentionally preserved so the visitor can retry
      setErrors({ submit: err.message });
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="border border-[color:var(--hairline)] bg-white p-9 shadow-card md:p-12"
        data-testid="inquiry-success"
      >
        <CheckCircle2 size={32} className="text-[color:var(--gold-deep)]" />
        <h3 className="mt-7 font-display text-2xl font-light tracking-tight text-[color:var(--graphite)]">
          Inquiry received
        </h3>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-[color:var(--slate)]">
          Thank you for contacting Yue Fung Metal Plastic Products Co. Ltd. Your inquiry has been
          saved and an acknowledgement has been sent to your email address. Our team will review your
          requirements and contact you shortly.
        </p>
        <div className="mt-8 border border-[color:var(--hairline)] bg-[color:var(--ivory)] p-5">
          <p className="label-tech">Reference ID</p>
          <p className="mt-2 font-tech text-lg text-[color:var(--gold-deep)]" data-testid="inquiry-reference-id">
            {submitted.id}
          </p>
          <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]">
            {submitted.service_label} · submitted {new Date(submitted.created_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setSubmitted(null)}
          data-testid="inquiry-new-btn"
          className="mt-8 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)] underline-offset-4 transition-colors hover:text-[color:var(--graphite)] hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      id="inquiry-form"
      onSubmit={submit}
      noValidate
      className="border border-[color:var(--hairline)] bg-white p-7 shadow-card md:p-10"
      data-testid="inquiry-form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact_name" label="Contact person" required error={errors.contact_name}>
          <input id="contact_name" name="contact_name" value={form.contact_name} onChange={set("contact_name")}
            aria-invalid={!!errors.contact_name} autoComplete="name" placeholder="Full name"
            data-testid="input-contact-name" className={fieldCls} />
        </Field>
        <Field id="company" label="Company name" required error={errors.company}>
          <input id="company" name="company" value={form.company} onChange={set("company")}
            aria-invalid={!!errors.company} autoComplete="organization" placeholder="Company Ltd."
            data-testid="input-company" className={fieldCls} />
        </Field>
        <Field id="email" label="Business email" required error={errors.email}>
          <input id="email" name="email" type="email" value={form.email} onChange={set("email")}
            aria-invalid={!!errors.email} autoComplete="email" placeholder="name@company.com"
            data-testid="input-email" className={fieldCls} />
        </Field>
        <Field id="phone" label="Phone number">
          <input id="phone" name="phone" value={form.phone} onChange={set("phone")}
            autoComplete="tel" placeholder="Optional" data-testid="input-phone" className={fieldCls} />
        </Field>
        <Field id="service" label="Interested service" required error={errors.service}>
          <select id="service" name="service" ref={serviceRef} value={form.service} onChange={set("service")}
            aria-invalid={!!errors.service} data-testid="select-service" className={fieldCls}>
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
            <option value="other">Other / Not sure yet</option>
          </select>
        </Field>
        <Field id="quantity" label="Approximate quantity">
          <input id="quantity" name="quantity" value={form.quantity} onChange={set("quantity")}
            placeholder="Optional — e.g. 5,000 pcs" data-testid="input-quantity" className={fieldCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="timeline" label="Target timeline">
            <input id="timeline" name="timeline" value={form.timeline} onChange={set("timeline")}
              placeholder="Optional — e.g. samples in 6 weeks" data-testid="input-timeline" className={fieldCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="description" label="Project description and requirements" required error={errors.description}>
            <textarea id="description" name="description" rows={5} value={form.description} onChange={set("description")}
              aria-invalid={!!errors.description} data-testid="input-description"
              className={`${fieldCls} resize-y`}
              placeholder="Part function, materials, finishing, tolerances if known, and anything else we should consider." />
          </Field>
        </div>
      </div>

      <div className="mt-9">
        <p className="label-tech !text-[color:var(--graphite-soft)]">Technical drawings</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          className={`mt-4 border border-dashed p-7 text-center transition-colors duration-300 ${
            dragging
              ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)]"
              : "border-[color:var(--hairline-strong)] bg-[color:var(--ivory)]"
          }`}
          data-testid="file-dropzone"
        >
          <UploadCloud size={21} className="mx-auto text-[color:var(--slate)]" />
          <p className="mt-4 text-sm text-[color:var(--slate)]">
            Drag &amp; drop drawings here, or{" "}
            <button type="button" onClick={() => inputRef.current?.click()} data-testid="file-browse-btn"
              className="text-[color:var(--gold-deep)] underline-offset-4 hover:underline">
              browse
            </button>
          </p>
          <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]/80">
            PDF · DWG · DXF · STEP · STL · ZIP · PNG/JPG · max {MAX_MB} MB · up to {MAX_FILES} files
          </p>
          <input ref={inputRef} type="file" multiple accept={ACCEPT} className="hidden" data-testid="file-input"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2" data-testid="file-list">
            {files.map((f) => (
              <li key={f.tempId} data-testid="file-item"
                className="flex items-center gap-3 border border-[color:var(--hairline)] bg-white px-4 py-3">
                <FileText size={14} className={f.error ? "text-[color:var(--destructive)]" : "text-[color:var(--slate)]"} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-[color:var(--graphite)]">{f.filename}</span>
                  {f.error ? (
                    <span className="mt-1 block text-[11px] text-[color:var(--destructive)]">{f.error}</span>
                  ) : f.file_id ? (
                    <span className="mt-1 block font-tech text-[10px] uppercase tracking-[0.14em] text-[color:var(--gold-deep)]">
                      Uploaded · {Math.max(1, Math.round((f.size || 0) / 1024))} KB
                    </span>
                  ) : (
                    <span className="mt-1.5 block h-1 w-full overflow-hidden bg-[color:var(--pale)]">
                      <span className="block h-full bg-[color:var(--gold)] transition-[width] duration-200"
                        style={{ width: `${f.progress || 0}%` }} />
                    </span>
                  )}
                </span>
                {!f.file_id && !f.error && <Loader2 size={13} className="animate-spin text-[color:var(--slate)]" />}
                <button type="button" onClick={() => removeFile(f.tempId)} aria-label={`Remove ${f.filename}`}
                  data-testid="file-remove-btn"
                  className="text-[color:var(--slate)] transition-colors hover:text-[color:var(--destructive)]">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {errors.files && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[color:var(--destructive)]" data-testid="error-files">
            <AlertCircle size={12} /> {errors.files}
          </p>
        )}
      </div>

      <div className="mt-9 border-t border-[color:var(--hairline)] pt-7">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
          <input id="consent" name="consent" type="checkbox" checked={form.consent} onChange={set("consent")}
            aria-invalid={!!errors.consent} data-testid="input-consent"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[color:var(--gold-deep)]" />
          <span className="text-xs leading-relaxed text-[color:var(--slate)]">
            I consent to Yue Fung Metal Plastic Products Co. Ltd. storing and processing the details
            and files submitted in this form in order to respond to my inquiry.{" "}
            <span className="text-[color:var(--gold-deep)]">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[color:var(--destructive)]" role="alert" data-testid="error-consent">
            <AlertCircle size={12} /> {errors.consent}
          </p>
        )}
      </div>

      {errors.submit && (
        <p className="mt-7 flex items-start gap-2 border border-[color:var(--destructive)]/30 bg-[color:var(--destructive)]/5 px-4 py-3 text-xs text-[color:var(--destructive)]"
          role="alert" data-testid="submit-error">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {errors.submit}
        </p>
      )}

      <button type="submit" disabled={sending} data-testid="submit-inquiry-btn"
        className="group mt-8 flex w-full items-center justify-center gap-2.5 rounded-sm bg-[color:var(--graphite)] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[color:var(--gold-deep)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {sending && <Loader2 size={14} className="animate-spin" />}
        {sending ? "Submitting" : "Submit Inquiry"}
        {!sending && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
