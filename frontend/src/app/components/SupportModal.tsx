import { RetroModal } from "./RetroModal";

interface SupportModalProps { onClose: () => void; }

export function SupportModal({ onClose }: SupportModalProps) {
  return (
    <RetroModal title="📞 TECHNICAL SUPPORT — DELL POS ENTERPRISE" onClose={onClose} headerBg="#000080" headerColor="#ffffff" width="540px">
      <div style={{ padding: "14px" }}>

        {/* Hotline banner */}
        <div style={{ background: "#e91d2a", border: "3px solid #000", padding: "12px", marginBottom: "12px", textAlign: "center" }}>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "11px", fontWeight: "900", color: "#ffffff", letterSpacing: "1px" }}>
            24-HOUR TECHNICAL SUPPORT HOTLINE
          </div>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "28px", fontWeight: "900", color: "#fcc20f", letterSpacing: "2px", lineHeight: "1.2" }}>
            0800-POS-HELP
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", color: "#ffcccc" }}>
            Toll-free • Available 24/7 • Bahasa Indonesia & English
          </div>
        </div>

        {/* Contact table */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            CONTACT INFORMATION
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["📞 Phone (Jakarta)", "021-500-3355"],
                ["📠 Fax", "021-500-3356"],
                ["📧 Email Support", "support@dell-pos.id"],
                ["🌐 Website", "http://www.dell.com/pos"],
                ["📮 Mailing Address", "Jl. Jend. Sudirman Kav. 52-53, Jakarta 12190"],
                ["🕐 Office Hours", "Monday–Friday, 08:00–18:00 WIB"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ border: "1px solid #ccc", padding: "6px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", background: "#f0f0f0", width: "40%" }}>
                    {label}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "6px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", color: val.startsWith("http") || val.includes("@") ? "#0000ee" : "#000", textDecoration: val.startsWith("http") || val.includes("@") ? "underline" : "none" }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#8e8a25", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          {[
            { q: "Bagaimana cara backup data?", a: "Buka Settings → klik tombol BACKUP DATA. File backup tersimpan ke disket atau harddisk." },
            { q: "Cara menambah user / kasir baru?", a: "Buka menu Employees → klik ADD NEW EMPLOYEE, isi form, lalu klik tombol ADD." },
            { q: "Printer tidak terdeteksi?", a: "Pastikan kabel paralel/USB terhubung. Buka Settings → Printer Settings untuk mengkonfigurasi ulang." },
            { q: "Barcode scanner tidak berfungsi?", a: "Pastikan scanner tersambung ke port COM1 atau COM2. Mode keyboard emulation harus aktif." },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: i < 3 ? "1px solid #cccccc" : "none", padding: "8px 10px" }}>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", color: "#000080", marginBottom: "3px" }}>
                Q: {item.q}
              </div>
              <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "12px", color: "#333" }}>
                A: {item.a}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ background: "#000000", color: "#ffffff", border: "2px solid #000", padding: "6px 20px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px" }}
        >
          CLOSE WINDOW
        </button>
      </div>
    </RetroModal>
  );
}
