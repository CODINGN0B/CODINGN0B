import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn, LogOut, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { API, COMPANY } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";
import InquiryDetail from "@/components/InquiryDetail";

const STATUS_STYLE = {
  new: "border-[color:var(--gold)]/60 text-[color:var(--gold-deep)] bg-[color:var(--gold-soft)]",
  reviewing: "border-amber-400/60 text-amber-700 bg-amber-50",
  quoted: "border-emerald-400/60 text-emerald-700 bg-emerald-50",
  closed: "border-[color:var(--hairline-strong)] text-[color:var(--slate)] bg-[color:var(--pale)]",
};

const Shell = ({ children }) => (
  <div className="min-h-screen bg-background" data-testid="dashboard-page">
    <div className="mx-auto max-w-[1340px] px-5 py-10 sm:px-8">{children}</div>
  </div>
);

export default function Dashboard() {
  const { user, loading, signIn, signOut } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    const url = user.is_admin ? `${API}/inquiries` : `${API}/inquiries/mine`;
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Could not load inquiries");
      setInquiries(await res.json());
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading) load();
  }, [loading, load]);

  const setStatus = async (id, status) => {
    const res = await fetch(`${API}/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return toast.error("Could not update status");
    const updated = await res.json();
    setInquiries((prev) => prev.map((q) => (q.id === id ? updated : q)));
    setSelected((s) => (s && s.id === id ? updated : s));
    toast.success(`Marked as ${status}`);
  };

  const resend = async (id) => {
    const res = await fetch(`${API}/inquiries/${id}/resend-notification`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return toast.error("Could not resend the notification");
    const updated = await res.json();
    setInquiries((prev) => prev.map((q) => (q.id === id ? updated : q)));
    setSelected(updated);
    toast[updated.email_status === "sent" ? "success" : "error"](
      updated.email_status === "sent" ? "Notification sent" : `Delivery ${updated.email_status}`
    );
  };

  const download = async (file) => {
    try {
      const res = await fetch(`${API}/inquiries/files/${file.file_id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-[color:var(--slate)]" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-md pt-24 text-center" data-testid="dashboard-signin">
          <p className="font-display text-xl font-medium tracking-[0.26em] text-[color:var(--graphite)]">
            {COMPANY.short}
          </p>
          <h1 className="mt-8 font-display text-2xl font-light tracking-tight text-[color:var(--graphite)]">
            Internal sign in
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--slate)]">
            Sign in with Google to review project inquiries. Access to the full inquiry list is
            limited to authorised company addresses.
          </p>
          <button
            onClick={signIn}
            data-testid="dashboard-google-signin-btn"
            className="mt-9 inline-flex items-center gap-2.5 rounded-sm bg-[color:var(--graphite)] px-7 py-3.5 font-tech text-[11px] uppercase tracking-[0.18em] text-[color:var(--porcelain)] transition-colors hover:bg-[color:var(--gold-deep)]"
          >
            <LogIn size={14} /> Continue with Google
          </button>
          <Link
            to="/"
            className="mt-8 flex items-center justify-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)] hover:text-[color:var(--graphite)]"
            data-testid="dashboard-back-home"
          >
            <ArrowLeft size={12} /> Back to website
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="flex flex-col gap-5 border-b border-[color:var(--hairline)] pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)] transition-colors hover:text-[color:var(--gold-deep)]"
            data-testid="dashboard-back-home"
          >
            <ArrowLeft size={12} /> {COMPANY.short}
          </Link>
          <h1 className="mt-4 font-display text-2xl font-light tracking-tight text-[color:var(--graphite)]">
            {user.is_admin ? "Project Inquiries" : "My Inquiries"}
          </h1>
          <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]" data-testid="dashboard-user">
            {user.email} {user.is_admin && "· Administrator"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            data-testid="dashboard-refresh-btn"
            className="flex items-center gap-2 rounded-sm border border-[color:var(--hairline-strong)] px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--graphite)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)]"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={signOut}
            data-testid="dashboard-signout-btn"
            className="flex items-center gap-2 rounded-sm border border-[color:var(--hairline-strong)] px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--graphite)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)]"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      {busy ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin text-[color:var(--slate)]" />
        </div>
      ) : inquiries.length === 0 ? (
        <p className="mt-16 text-sm text-[color:var(--slate)]" data-testid="dashboard-empty">
          No inquiries yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-[color:var(--hairline)] bg-[color:var(--surface)]" data-testid="inquiries-table">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--hairline)] bg-[color:var(--ivory)]">
                {["Reference", "Company", "Service", "Quantity", "Files", "Status", "Received"].map((h) => (
                  <th key={h} className="label-tech px-5 py-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => setSelected(q)}
                  data-testid={`inquiry-row-${q.id}`}
                  className="cursor-pointer border-b border-[color:var(--hairline)] transition-colors hover:bg-[color:var(--ivory)]"
                >
                  <td className="px-5 py-4 font-tech text-xs text-[color:var(--gold-deep)]">{q.id}</td>
                  <td className="px-5 py-4 text-[color:var(--graphite)]">{q.company}</td>
                  <td className="px-5 py-4 text-[color:var(--slate)]">{q.service_label}</td>
                  <td className="px-5 py-4 text-[color:var(--slate)]">{q.quantity || "—"}</td>
                  <td className="px-5 py-4 text-[color:var(--slate)]">{q.files?.length || 0}</td>
                  <td className="px-5 py-4">
                    <span className={`border px-2.5 py-1 font-tech text-[9px] uppercase tracking-[0.16em] ${STATUS_STYLE[q.status] || STATUS_STYLE.closed}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-tech text-[11px] text-[color:var(--slate)]">
                    {new Date(q.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InquiryDetail
        inquiry={selected}
        isAdmin={user.is_admin}
        onClose={() => setSelected(null)}
        onStatus={setStatus}
        onDownload={download}
        onResend={resend}
      />
    </Shell>
  );
}
