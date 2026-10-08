import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const sessionId = new URLSearchParams(window.location.hash.replace("#", "")).get("session_id");
    const finish = async () => {
      try {
        const res = await fetch(`${API}/auth/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) throw new Error("session exchange failed");
        setUser(await res.json());
        window.history.replaceState(null, "", "/dashboard");
        navigate("/dashboard", { replace: true });
      } catch {
        window.history.replaceState(null, "", "/");
        navigate("/", { replace: true });
      }
    };
    finish();
  }, [navigate, setUser]);

  return <div className="min-h-screen bg-background" data-testid="auth-callback" />;
}
