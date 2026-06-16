import { useState } from "react";

interface LoginProps {
  onLogin: (username: string, role: string, employee_id: string, employee_name: string) => void;
}

const USERS = [
  { username: "admin",   password: "admin123", role: "Administrator", name: "Admin Utama" },
  { username: "kasir1",  password: "kasir123", role: "Head Cashier",  name: "Agus Wirawan" },
  { username: "kasir2",  password: "kasir456", role: "Cashier",       name: "Rina Safitri" },
  { username: "manager", password: "mgr2024",  role: "Store Manager", name: "Yunita Sari" },
];

const BG_URL = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80";

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "http://localhost:8080/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login gagal");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("employee_id", data.user.employee_id || "");
    localStorage.setItem("employee_name", data.user.employee_name || "");
    localStorage.setItem("role", data.user.role || "");

    onLogin(
      data.user.username,
      data.user.role,
      data.user.employee_id || "",
      data.user.employee_name || ""
    );

  } catch (err) {
    console.error(err);
    setError("Tidak dapat terhubung ke server");
  }

  setLoading(false);
};
  return (
    <div style={{ minHeight: "100vh", width: "100%", position: "relative", fontFamily: "Times New Roman, Times, serif" }}>

      {/* ── FULL SCREEN BMW PHOTO BACKGROUND ── */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat",
        zIndex: 0,
      }} />

      {/* Dark overlay */}
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(10,15,30,0.82) 50%, rgba(0,0,0,0.70) 100%)",
        zIndex: 1,
      }} />

      {/* Scanline CRT effect */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* ── TOP BAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
        background: "rgba(0,0,0,0.88)", borderBottom: "2px solid #e91d2a",
        padding: "5px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 18, fontWeight: 900, color: "#e91d2a", letterSpacing: "-1px" }}>
          DELL
        </div>
        <div style={{ fontFamily: "Courier New, monospace", fontSize: 10, color: "#555" }}>
          DELL POS ENTERPRISE v1.0 &nbsp;—&nbsp; © 1996 Dell Computer Corporation
        </div>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", color: "#228800" }}>
          ● SECURE CONNECTION
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 5, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "64px 16px 24px", boxSizing: "border-box",
      }}>

        {/* Login card */}
        <div style={{
          width: "100%", maxWidth: 480,
          border: "4px solid #000", background: "#ffffff",
          boxShadow: "10px 10px 0px rgba(0,0,0,0.9), 0 0 60px rgba(233,29,42,0.25), 0 0 120px rgba(0,0,0,0.5)",
        }}>

          {/* Card header */}
          <div style={{
            background: "#e91d2a", padding: "10px 14px", borderBottom: "3px solid #000",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>
              DELL
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "1px" }}>
                POINT OF SALE ENTERPRISE
              </div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, color: "#ffcccc", letterSpacing: "2px" }}>
                SYSTEM LOGIN — v1.0
              </div>
            </div>
            <div style={{
              background: "#fcc20f", color: "#000",
              fontFamily: "Arial Black, Arial, sans-serif", fontSize: 9, fontWeight: 900,
              padding: "3px 6px", border: "2px solid #000", transform: "rotate(-4deg)", letterSpacing: "0.5px",
            }}>
              SECURE!
            </div>
          </div>

          {/* Black info banner */}
          <div style={{
            background: "#000", color: "#fcc20f",
            fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold",
            padding: "4px 10px", letterSpacing: "1px", textAlign: "center", borderBottom: "1px solid #333",
          }}>
            ★ AUTHORIZED PERSONNEL ONLY — DELL COMPUTER CORPORATION © 1996 ★
          </div>

          {/* Lock icon area */}
          <div style={{ background: "#f0f0f0", borderBottom: "2px solid #000", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>🔐</div>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 15, fontWeight: 900, color: "#000", letterSpacing: "1px" }}>
              SYSTEM AUTHENTICATION
            </div>
            <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#555", marginTop: 3 }}>
              Please enter your credentials to access the POS system.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "14px 16px" }}>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fff0f0", border: "2px solid #cc0000",
                padding: "7px 10px", marginBottom: 10,
                fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, fontWeight: "bold", color: "#cc0000",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Username */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
                USER ID / USERNAME
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your user ID..."
                autoFocus
                required
                style={{
                  width: "100%", border: "2px solid #000", borderTop: "none",
                  padding: "8px 10px", fontFamily: "Courier New, monospace", fontSize: 14,
                  background: "#fffff0", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
                PASSWORD
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  required
                  style={{
                    width: "100%", border: "2px solid #000", borderTop: "none",
                    padding: "8px 44px 8px 10px", fontFamily: "Courier New, monospace", fontSize: 14,
                    background: "#fffff0", outline: "none", boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
                    background: "#ddd", border: "none", borderLeft: "2px solid #000",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: loading ? "#666" : "#000", color: "#fff",
                border: "2px solid #000", padding: "10px",
                fontFamily: "Arial Black, Arial, sans-serif", fontSize: 14, fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer", letterSpacing: "2px", marginBottom: 6,
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#e91d2a"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#000"; }}
            >
              {loading ? "⏳ AUTHENTICATING..." : "🔓 LOGIN TO SYSTEM"}
            </button>

            <button
              type="button"
              onClick={() => { setUsername(""); setPassword(""); setError(""); }}
              style={{
                width: "100%", background: "#cccccc", color: "#000",
                border: "2px solid #000", padding: "5px",
                fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, fontWeight: "bold", cursor: "pointer",
              }}
            >
              ↺ CLEAR FORM
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ margin: "0 16px 14px", border: "1px solid #ccc", background: "#f8f8f8", padding: "8px" }}>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", color: "#555", marginBottom: 4, letterSpacing: "0.5px" }}>
              DEMO CREDENTIALS — klik baris untuk auto-fill:
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["USERNAME", "PASSWORD", "ROLE"].map((h) => (
                    <th key={h} style={{ border: "1px solid #ccc", padding: "2px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, background: "#333", color: "#fff", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map((u, i) => (
                  <tr
                    key={u.username}
                    style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5", cursor: "pointer" }}
                    onClick={() => { setUsername(u.username); setPassword(u.password); setError(""); }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#ffffcc")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "#fff" : "#f5f5f5")}
                  >
                    <td style={{ border: "1px solid #ccc", padding: "3px 6px", fontFamily: "Courier New, monospace", fontSize: 11 }}>{u.username}</td>
                    <td style={{ border: "1px solid #ccc", padding: "3px 6px", fontFamily: "Courier New, monospace", fontSize: 11 }}>{u.password}</td>
                    <td style={{ border: "1px solid #ccc", padding: "3px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: 11 }}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card footer */}
          <div style={{ background: "#000", color: "#555", fontFamily: "Times New Roman, Times, serif", fontSize: 10, padding: "5px 10px", textAlign: "center", fontStyle: "italic" }}>
            This system is best viewed with Netscape Navigator 3.0+ at 800×600 resolution.
          </div>
        </div>
      </div>

      {/* Bottom watermark */}
      <div style={{
        position: "fixed", bottom: 8, left: 0, right: 0,
        textAlign: "center", zIndex: 10,
        fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10,
        color: "rgba(255,255,255,0.22)", letterSpacing: "2px", pointerEvents: "none",
      }}>
        DELL COMPUTER CORPORATION — ROUND ROCK, yogyakarta — © 2026
      </div>
    </div>
  );
}