import { RetroModal } from "./RetroModal";

interface UpgradeModalProps { onClose: () => void; }

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <RetroModal title="★ UPGRADE — DELL POS ENTERPRISE PRO" onClose={onClose} headerBg="#e91d2a" headerColor="#fcc20f" width="500px">
      <div style={{ padding: "14px" }}>

        {/* Big promo */}
        <div style={{ background: "#fcc20f", border: "4px solid #000", padding: "14px", textAlign: "center", marginBottom: "12px" }}>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", fontWeight: "900", letterSpacing: "2px", color: "#000" }}>
            ⚡ LIMITED TIME OFFER — DECEMBER 1996 ⚡
          </div>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "32px", fontWeight: "900", color: "#e91d2a", lineHeight: "1.1" }}>
            UPGRADE TO
          </div>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "22px", fontWeight: "900", color: "#000", letterSpacing: "1px" }}>
            DELL POS PRO v2.0
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", color: "#333", marginTop: "4px" }}>
            Only <strong style={{ color: "#e91d2a", fontSize: "18px" }}>$299</strong> per year • Multi-terminal license included
          </div>
        </div>

        {/* Feature comparison */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            WHAT YOU GET IN PRO
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#444", color: "#fff", textAlign: "left" }}>FEATURE</th>
                <th style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#444", color: "#fff", textAlign: "center" }}>STANDARD</th>
                <th style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#228800", color: "#fff", textAlign: "center" }}>PRO</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["POS Transactions", "✔", "✔"],
                ["Product Management", "✔", "✔"],
                ["Customer Database", "500 records", "Unlimited"],
                ["Reports & Charts", "Basic", "Advanced + Export"],
                ["Multi-Terminal", "1 terminal", "Up to 10"],
                ["Network Support", "✕", "✔ LAN/WAN"],
                ["Barcode Label Print", "✕", "✔"],
                ["Email Receipts", "✕", "✔"],
                ["SQL Database", "✕", "✔ MS SQL 6.5"],
                ["Technical Support", "Business hours", "24/7 Priority"],
              ].map(([feat, std, pro]) => (
                <tr key={feat}>
                  <td style={{ border: "1px solid #ccc", padding: "4px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{feat}</td>
                  <td style={{ border: "1px solid #ccc", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", textAlign: "center", color: std === "✕" ? "#cc0000" : "#005500" }}>{std}</td>
                  <td style={{ border: "1px solid #ccc", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", textAlign: "center", fontWeight: "bold", color: "#005500", background: "#f0fff0" }}>{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => alert("Thank you for your interest!\n\nPlease call 0800-POS-HELP to order Dell POS Pro.\n\nOr fax your purchase order to: 021-500-3356")}
            style={{ flex: 1, background: "#e91d2a", color: "#ffffff", border: "3px solid #000", padding: "10px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px" }}
          >
            ORDER NOW — $299/yr
          </button>
          <button
            onClick={onClose}
            style={{ background: "#cccccc", color: "#000000", border: "2px solid #000", padding: "10px 16px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            LATER
          </button>
        </div>
      </div>
    </RetroModal>
  );
}
