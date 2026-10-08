import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn, LogOut, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { API, COMPANY } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";
import QuoteDetail from "@/components/QuoteDetail";

const STATUS_STYLE = {
  new: "border-[color:var(--steel)]/40 text-[color:var(--steel)]",
  reviewing: "border-amber-500/40 text-amber-400",
  quoted: "border-emerald-500/40 text-emerald-400",
  closed: "border-white/15 text-zinc-500",
};

const Shell = ({ children }) => (
  <div className="min-h-screen bg-background text-zinc-100" data-testid="dashboard-page">
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">{children}</div>
  </div>
);

export default function Dashboard() {
  const { user, loading, signIn, signOut } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    const url = user.is_admin ? `${API}/quote-requests` : `${API}/quote-requests/mine`;
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Could not load quote requests");
      setQuotes(await res.json());
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
    const res = await fetch(`${API}/quote-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return toast.error("Could not update status");
    const updated = await res.json();
    setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    setSelected((s) => (s && s.id === id ? updated : s));
    toast.success(`Marked as ${status}`);
  };

  const download = async (file) => {
    try {
      const res = await fetch(`${API}/quote-requests/files/${file.file_id}`, { credentials: "include" });
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
          <Loader2 className="animate-spin text-zinc-600" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-md pt-24 text-center" data-testid="dashboard-signin">
          <p className="font-display text-xl font-semibold tracking-[0.2em] text-white">{COMPANY.short}</p>
          <h1 className="mt-8 font-display text-2xl font-semibold uppercase tracking-tight text-white">
            Sign in
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Sign in with Google to track the quote requests you submitted. Company administrators see
            all incoming requests.
          </p>
          <button
            onClick={signIn}
            data-testid="dashboard-google-signin-btn"
            className="mt-9 inline-flex items-center gap-2.5 rounded-md bg-[color:var(--steel)] px-7 py-3.5 font-tech text-[11px] uppercase tracking-[0.2em] text-[#06080a] transition-colors hover:bg-[#6aa4e6]"
          >
            <LogIn size={14} /> Continue with Google
          </button>
          <Link
            to="/"
            className="mt-8 flex items-center justify-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-zinc-500 hover:text-white"
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
      <header className="flex flex-col gap-5 border-b border-white/8 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            data-testid="dashboard-back-home"
          >
            <ArrowLeft size={12} /> {COMPANY.short}
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-white">
            {user.is_admin ? "Quote Requests" : "My Quote Requests"}
          </h1>
          <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600" data-testid="dashboard-user">
            {user.email} {user.is_admin && "· Administrator"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            data-testid="dashboard-refresh-btn"
            className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={signOut}
            data-testid="dashboard-signout-btn"
            className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      {busy ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin text-zinc-600" />
        </div>
      ) : quotes.length === 0 ? (
        <p className="mt-16 text-sm text-zinc-500" data-testid="dashboard-empty">
          No quote requests yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-white/8" data-testid="quotes-table">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02]">
                {["Reference", "Company", "Project", "Quantity", "Files", "Status", "Received"].map((h) => (
                  <th key={h} className="label-tech px-5 py-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => setSelected(q)}
                  data-testid={`quote-row-${q.id}`}
                  className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4 font-tech text-xs text-[color:var(--steel)]">{q.id}</td>
                  <td className="px-5 py-4 text-zinc-200">{q.company}</td>
                  <td className="px-5 py-4 text-zinc-400">{q.project}</td>
                  <td className="px-5 py-4 text-zinc-400">{q.quantity}</td>
                  <td className="px-5 py-4 text-zinc-400">{q.files?.length || 0}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded border px-2.5 py-1 font-tech text-[9px] uppercase tracking-[0.16em] ${STATUS_STYLE[q.status] || STATUS_STYLE.closed}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-tech text-[11px] text-zinc-500">
                    {new Date(q.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <QuoteDetail
        quote={selected}
        isAdmin={user.is_admin}
        onClose={() => setSelected(null)}
        onStatus={setStatus}
        onDownload={download}
      />
    </Shell>
  );
}
