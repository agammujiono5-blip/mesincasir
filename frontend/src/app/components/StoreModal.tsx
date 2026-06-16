import { RetroModal } from "./RetroModal";

type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";

interface StoreModalProps {
  onClose: () => void;
  onNavigate: (s: Section) => void;
}

const STORE_INFO = [
  { label: "Store Name", val: "Dell Business Solutions — Jakarta Branch" },
  { label: "Address", val: "Jl. Jend. Sudirman Kav. 52-53, Jakarta 12190" },
  { label: "Phone", val: "021-500-3355" },
  { label: "Manager", val: "Bpk. Agus Wirawan" },
  { label: "Operating Hours", val: "Monday–Saturday, 08:00–21:00 WIB" },
  { label: "Total Cashiers", val: "8 active terminals" },
  { label: "POS Version", val: "Dell POS Enterprise v1.0" },
];

const SHORTCUTS: { label: string; desc: string; section: Section; bg: string }[] = [
  { label: "OPEN REGISTER", desc: "Mulai sesi kasir baru", section: "sales", bg: "#228800" },
  { label: "PRODUCT CATALOG", desc: "Lihat semua produk", section: "products", bg: "#0000aa" },
  { label: "CHECK INVENTORY", desc: "Status stok gudang", section: "inventory", bg: "#8e8a25" },
  { label: "VIEW CUSTOMERS", desc: "Database pelanggan", section: "customers", bg: "#005577" },
];

export function StoreModal({ onClose, onNavigate }: StoreModalProps) {
  const go = (s: Section) => { onNavigate(s); onClose(); };

  return (
    <RetroModal title="🏪 STORE — INFORMASI TOKO" onClose={onClose} headerBg="#8e8a25" headerColor="#ffffff" width="500px">
      <div style={{ padding: "14px" }}>

        {/* Store info */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#8e8a25", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            STORE PROFILE
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {STORE_INFO.map(({ label, val }) => (
                <tr key={label}>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", background: "#f0f0f0", width: "38%" }}>{label}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats today */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#fcc20f", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            TODAY'S ACTIVITY — 11 JUNE 1996
          </div>
          <div style={{ display: "flex" }}>
            {[
              { label: "SALES", val: "Rp 12.5M", bg: "#e6915d" },
              { label: "TRANSACTIONS", val: "250", bg: "#b3bd95" },
              { label: "CUSTOMERS", val: "187", bg: "#c0d4a7" },
              { label: "STAFF ON DUTY", val: "8", bg: "#9ab6c8" },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, borderRight: "1px solid #000", background: s.bg, padding: "8px", textAlign: "center", lastChild: { borderRight: "none" } } as any}>
                <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", letterSpacing: "0.5px" }}>{s.label}</div>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "16px", fontWeight: "900" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick shortcuts */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#444", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            QUICK ACCESS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#000" }}>
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => go(s.section)}
                style={{
                  background: s.bg,
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 10px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)")}
              >
                <div>{s.label}</div>
                <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px", fontWeight: "normal", opacity: 0.85 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: "#000000", color: "#ffffff", border: "2px solid #000", padding: "6px 20px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px" }}
        >
          CLOSE
        </button>
      </div>
    </RetroModal>
  );
}
