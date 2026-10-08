import { useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud, ArrowRight, AlertCircle } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { API } from "@/lib/site";

const ACCEPT = ".pdf,.dwg,.dxf,.step,.stp,.stl,.zip,.igs,.iges";
const ALLOWED = ["pdf", "dwg", "dxf", "step", "stp", "stl", "zip", "igs", "iges"];
const MAX_MB = 25;
const MAX_FILES = 8;

const EMPTY = {
  company: "", contact_name: "", email: "", phone: "",
  project: "", quantity: "", material: "", requirements: "", message: "",
};

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors duration-200 focus:border-[color:var(--steel)] focus:outline-none focus:ring-1 focus:ring-[color:var(--steel)]";

const Field = ({ id, label, required, error, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="label-tech">
      {label} {required && <span className="text-[color:var(--steel)]">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-red-400" data-testid={`error-${id}`}>
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

export default function QuoteForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]); // {file_id, filename, size} | {tempId, filename, progress, error}
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const inputRef = useRef(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.contact_name.trim()) e.contact_name = "Contact name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.project.trim()) e.project = "Product or project is required";
    if (!form.quantity.trim()) e.quantity = "Quantity is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const uploadOne = (file) => {
    const tempId = `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setFiles((prev) => [...prev, { tempId, filename: file.name, size: file.size, progress: 0 }]);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/quote-requests/uploads`);
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
    xhr.onerror = () => {
      setFiles((prev) => prev.map((f) => (f.tempId === tempId ? { ...f, error: "Network error" } : f)));
    };
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  };

  const addFiles = (list) => {
    const incoming = Array.from(list);
    const next = [];
    for (const file of incoming) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED.includes(ext)) {
        next.push({ tempId: `${file.name}-bad`, filename: file.name, size: file.size, error: "Unsupported file type" });
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        next.push({ tempId: `${file.name}-big`, filename: file.name, size: file.size, error: `Exceeds ${MAX_MB} MB limit` });
        continue;
      }
      if (files.length + next.length >= MAX_FILES) break;
      uploadOne(file);
    }
    if (next.length) setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (tempId) => setFiles((prev) => prev.filter((f) => f.tempId !== tempId));

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("#quote-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (files.some((f) => f.progress !== undefined && !f.file_id && !f.error)) {
      setErrors({ files: "Please wait until all files have finished uploading" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/quote-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, file_ids: files.filter((f) => f.file_id).map((f) => f.file_id) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : "Submission failed");
      }
      const data = await res.json();
      setSubmitted(data);
      setForm(EMPTY);
      setFiles([]);
    } catch (err) {
      setErrors({ submit: err.message || "Submission failed. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="quote" className="relative border-t border-white/5 bg-[#0a0c0e] py-24 md:py-32" data-testid="quote-section">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionLabel index="06">Quotation</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl">
              Request a Quote
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-zinc-400">
              Send your drawings, specifications and quantities. Each submission receives a reference
              ID and is reviewed by our engineering team.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-5 border-t border-white/8 pt-8">
              {[
                ["Accepted files", "PDF, DWG, DXF, STEP, STL, ZIP, IGES"],
                ["File limit", `${MAX_MB} MB per file · up to ${MAX_FILES} files`],
                ["Response", "Reviewed and answered by our engineering team"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label-tech">{k}</dt>
                  <dd className="mt-1.5 text-sm text-zinc-400">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          {submitted ? (
            <div
              className="surface-card flex h-full flex-col items-start justify-center rounded-lg p-9 md:p-12"
              data-testid="quote-success"
            >
              <CheckCircle2 size={34} className="text-[color:var(--steel)]" />
              <h3 className="mt-7 font-display text-2xl font-semibold uppercase tracking-tight text-white">
                Quote Request Received
              </h3>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-400">
                Thank you for contacting Yue Fung Metal Plastic Products Co. Ltd. Your request has been
                successfully submitted. Our team will review your requirements and contact you shortly.
              </p>
              <div className="mt-8 w-full rounded-md border border-white/10 bg-white/[0.03] p-5">
                <p className="label-tech">Reference ID</p>
                <p className="mt-2 font-tech text-lg text-[color:var(--steel)]" data-testid="quote-reference-id">
                  {submitted.id}
                </p>
                <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Submitted {new Date(submitted.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSubmitted(null)}
                data-testid="quote-new-request-btn"
                className="mt-8 font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              id="quote-form"
              onSubmit={submit}
              noValidate
              className="surface-card rounded-lg p-7 md:p-10"
              data-testid="quote-form"
            >
              <fieldset className="border-0 p-0">
                <legend className="label-tech !text-zinc-300">Company Information</legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="company" label="Company Name" required error={errors.company}>
                    <input id="company" name="company" value={form.company} onChange={set("company")}
                      aria-invalid={!!errors.company} data-testid="input-company" className={inputCls}
                      placeholder="Company Ltd." autoComplete="organization" />
                  </Field>
                  <Field id="contact_name" label="Contact Name" required error={errors.contact_name}>
                    <input id="contact_name" name="contact_name" value={form.contact_name} onChange={set("contact_name")}
                      aria-invalid={!!errors.contact_name} data-testid="input-contact-name" className={inputCls}
                      placeholder="Full name" autoComplete="name" />
                  </Field>
                  <Field id="email" label="Email" required error={errors.email}>
                    <input id="email" name="email" type="email" value={form.email} onChange={set("email")}
                      aria-invalid={!!errors.email} data-testid="input-email" className={inputCls}
                      placeholder="name@company.com" autoComplete="email" />
                  </Field>
                  <Field id="phone" label="Phone">
                    <input id="phone" name="phone" value={form.phone} onChange={set("phone")}
                      data-testid="input-phone" className={inputCls} placeholder="+852 0000 0000" autoComplete="tel" />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-10 border-0 p-0">
                <legend className="label-tech !text-zinc-300">Project Information</legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field id="project" label="Product / Project" required error={errors.project}>
                    <input id="project" name="project" value={form.project} onChange={set("project")}
                      aria-invalid={!!errors.project} data-testid="input-project" className={inputCls}
                      placeholder="e.g. Stamped bracket assembly" />
                  </Field>
                  <Field id="quantity" label="Quantity" required error={errors.quantity}>
                    <input id="quantity" name="quantity" value={form.quantity} onChange={set("quantity")}
                      aria-invalid={!!errors.quantity} data-testid="input-quantity" className={inputCls}
                      placeholder="e.g. 25,000 pcs / year" />
                  </Field>
                  <Field id="material" label="Material">
                    <input id="material" name="material" value={form.material} onChange={set("material")}
                      data-testid="input-material" className={inputCls} placeholder="If specified" />
                  </Field>
                  <Field id="requirements" label="Manufacturing Requirements">
                    <input id="requirements" name="requirements" value={form.requirements} onChange={set("requirements")}
                      data-testid="input-requirements" className={inputCls} placeholder="Finish, tolerance, standards" />
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-10 border-0 p-0">
                <legend className="label-tech !text-zinc-300">Drawings &amp; Files</legend>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                  className={`mt-6 rounded-md border border-dashed p-7 text-center transition-colors duration-300 ${
                    dragging ? "border-[color:var(--steel)] bg-[color:var(--steel-soft)]" : "border-white/15 bg-white/[0.02]"
                  }`}
                  data-testid="file-dropzone"
                >
                  <UploadCloud size={22} className="mx-auto text-zinc-500" />
                  <p className="mt-4 text-sm text-zinc-400">
                    Drag &amp; drop files here, or{" "}
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      data-testid="file-browse-btn"
                      className="text-[color:var(--steel)] underline-offset-4 hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                    PDF · DWG · DXF · STEP · STL · ZIP · max {MAX_MB} MB
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPT}
                    className="hidden"
                    data-testid="file-input"
                    onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                  />
                </div>

                {files.length > 0 && (
                  <ul className="mt-4 space-y-2" data-testid="file-list">
                    {files.map((f) => (
                      <li
                        key={f.tempId}
                        className="flex items-center gap-3 rounded-md border border-white/8 bg-white/[0.02] px-4 py-3"
                        data-testid="file-item"
                      >
                        <FileText size={14} className={f.error ? "text-red-400" : "text-zinc-500"} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs text-zinc-300">{f.filename}</span>
                          {f.error ? (
                            <span className="mt-1 block text-[11px] text-red-400">{f.error}</span>
                          ) : f.file_id ? (
                            <span className="mt-1 block font-tech text-[10px] uppercase tracking-[0.14em] text-[color:var(--steel)]">
                              Uploaded · {Math.max(1, Math.round((f.size || 0) / 1024))} KB
                            </span>
                          ) : (
                            <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                              <span
                                className="block h-full bg-[color:var(--steel)] transition-[width] duration-200"
                                style={{ width: `${f.progress || 0}%` }}
                              />
                            </span>
                          )}
                        </span>
                        {!f.file_id && !f.error && <Loader2 size={13} className="animate-spin text-zinc-500" />}
                        <button
                          type="button"
                          onClick={() => removeFile(f.tempId)}
                          aria-label={`Remove ${f.filename}`}
                          data-testid="file-remove-btn"
                          className="text-zinc-600 transition-colors hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {errors.files && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400" data-testid="error-files">
                    <AlertCircle size={12} /> {errors.files}
                  </p>
                )}
              </fieldset>

              <fieldset className="mt-10 border-0 p-0">
                <legend className="label-tech !text-zinc-300">Additional Requirements</legend>
                <div className="mt-6">
                  <Field id="message" label="Details">
                    <textarea
                      id="message" name="message" rows={5} value={form.message} onChange={set("message")}
                      data-testid="input-message" className={`${inputCls} resize-y`}
                      placeholder="Tolerances, surface treatment, packaging, delivery expectations…"
                    />
                  </Field>
                </div>
              </fieldset>

              {errors.submit && (
                <p className="mt-7 flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300" data-testid="submit-error">
                  <AlertCircle size={14} /> {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                data-testid="submit-quote-btn"
                className="group mt-9 flex w-full items-center justify-center gap-2.5 rounded-md bg-[color:var(--steel)] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.2em] text-[#06080a] transition-colors duration-300 hover:bg-[#6aa4e6] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : null}
                {sending ? "Submitting" : "Submit Quote Request"}
                {!sending && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
