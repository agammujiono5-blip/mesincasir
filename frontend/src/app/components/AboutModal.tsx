import { RetroModal } from "./RetroModal";

interface AboutModalProps { onClose: () => void; }

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <RetroModal title="ℹ ABOUT — DELL POS ENTERPRISE SYSTEM" onClose={onClose} headerBg="#e91d2a" headerColor="#ffffff" width="480px">
      <div style={{ padding: "14px" }}>

        {/* Logo block */}
        <div style={{ textAlign: "center", border: "3px solid #000", padding: "16px", marginBottom: "12px", background: "#000000" }}>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "52px", fontWeight: "900", color: "#e91d2a", letterSpacing: "-4px", lineHeight: "1" }}>
            DELL
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", color: "#ffffff", letterSpacing: "3px", marginTop: "4px" }}>
            POINT OF SALE ENTERPRISE
          </div>
        </div>

        {/* Version info table */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            SYSTEM INFORMATION
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Product Name", "Dell POS Enterprise System"],
                ["Version", "1.0.0 (Build 9612.01)"],
                ["Release Date", "December 1, 1996"],
                ["Platform", "Windows NT 4.0 / Windows 95"],
                ["Minimum RAM", "16 MB (32 MB recommended)"],
                ["Minimum HDD", "80 MB free disk space"],
                ["Display", "800×600, 256 colors minimum"],
                ["Developer", "Dell Computer Corporation"],
                ["Copyright", "© 1996 Dell Computer Corporation"],
                ["Licensed To", "Jakarta Branch — Admin User"],
                ["Serial Number", "DPOS-1996-JKT-00001"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ border: "1px solid #ccc", padding: "4px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", background: "#f0f0f0", width: "42%" }}>{label}</td>
                  <td style={{ border: "1px solid #ccc", padding: "4px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legal notice */}
        <div style={{ border: "1px solid #cccccc", padding: "8px", background: "#f8f8f8", marginBottom: "12px" }}>
          <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#555555", lineHeight: "1.5", fontStyle: "italic" }}>
            This software is proprietary and confidential. Use, copying, distribution or disclosure
            without express written permission of Dell Computer Corporation is strictly prohibited.
            Dell and the Dell logo are registered trademarks of Dell Computer Corporation.
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{ background: "#000000", color: "#ffffff", border: "2px solid #000", padding: "6px 20px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px" }}
          >
            OK
          </button>
          <button
            style={{ background: "#cccccc", color: "#000000", border: "2px solid #000", padding: "6px 20px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            LICENSE INFO
          </button>
        </div>
      </div>
    </RetroModal>
  );
}
