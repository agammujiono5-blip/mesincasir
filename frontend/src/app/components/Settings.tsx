import { useState } from "react";

export function Settings() {
  const [storeName, setStoreName] = useState("Dell Business Solutions Jakarta");
  const [taxRate, setTaxRate] = useState("10");
  const [currency, setCurrency] = useState("IDR");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for shopping with us! Please come again.");
  const [saved, setSaved] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [printer, setPrinter] = useState("HP DeskJet 820C");
  const [paperSize, setPaperSize] = useState("80mm Thermal");
  const [copies, setCopies] = useState("1 copy");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to factory defaults?\n\nThis cannot be undone.")) {
      setStoreName("Dell Business Solutions Jakarta");
      setTaxRate("10");
      setCurrency("IDR");
      setReceiptFooter("Thank you for shopping with us! Please come again.");
      setPrinter("HP DeskJet 820C");
      setPaperSize("80mm Thermal");
      setCopies("1 copy");
      alert("Settings have been reset to factory defaults.");
    }
  };

  const handleBackup = () => {
    const data = { storeName, taxRate, currency, receiptFooter, printer, paperSize, copies, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dell-pos-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePasswordChange = () => {
    if (!adminPw) { alert("Please enter your current password."); return; }
    if (!newPw) { alert("Please enter a new password."); return; }
    if (newPw !== confirmPw) { alert("New password and confirmation do not match."); return; }
    if (newPw.length < 4) { alert("Password must be at least 4 characters."); return; }
    alert("Password changed successfully!\n\nPlease remember your new password.");
    setAdminPw(""); setNewPw(""); setConfirmPw("");
  };

  return (
    <div>
      <div style={{ background: "#8c9ae0", color: "#000000", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", padding: "6px 12px", letterSpacing: "2px", borderBottom: "2px solid #000000" }}>
        ◈ SYSTEM SETTINGS — CONFIGURATION PANEL
      </div>

      {saved && (
        <div style={{ background: "#228800", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", padding: "8px 12px", letterSpacing: "0.5px", borderBottom: "2px solid #000", textAlign: "center" }}>
          ✔ SETTINGS SAVED SUCCESSFULLY — Changes applied immediately.
        </div>
      )}

      <div style={{ padding: "12px" }}>
        {/* Store Info */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#8c9ae0", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ■ STORE INFORMATION
          </div>
          <div style={{ padding: "12px" }}>
            {[
              { label: "STORE NAME", val: storeName, setter: setStoreName, type: "text" },
              { label: "TAX RATE (%)", val: taxRate, setter: setTaxRate, type: "number" },
              { label: "CURRENCY CODE", val: currency, setter: setCurrency, type: "text" },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", minWidth: "160px", letterSpacing: "0.5px" }}>
                  {f.label}:
                </label>
                <input
                  type={f.type}
                  value={f.val}
                  onChange={(e) => f.setter(e.target.value)}
                  style={{ width: "300px", border: "1px solid #000", padding: "5px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", background: "#fffff0", outline: "none", boxSizing: "border-box" as const }}
                />
              </div>
            ))}
            <div style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <label style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", minWidth: "160px", letterSpacing: "0.5px", paddingTop: "4px" }}>
                RECEIPT FOOTER:
              </label>
              <textarea
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                rows={3}
                style={{ width: "300px", border: "1px solid #000", padding: "5px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
            </div>
          </div>
        </div>

        {/* Printer settings */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#444", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ■ PRINTER SETTINGS
          </div>
          <div style={{ padding: "12px" }}>
            {[
              { label: "RECEIPT PRINTER", val: printer, setter: setPrinter, options: ["HP DeskJet 820C", "Epson TM-T88", "Star TSP100", "Generic Text"] },
              { label: "PAPER SIZE", val: paperSize, setter: setPaperSize, options: ["58mm Thermal", "80mm Thermal", "A4", "Letter"] },
              { label: "PRINT COPIES", val: copies, setter: setCopies, options: ["1 copy", "2 copies", "3 copies"] },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", minWidth: "160px", letterSpacing: "0.5px" }}>
                  {f.label}:
                </label>
                <select
                  value={f.val}
                  onChange={(e) => f.setter(e.target.value)}
                  style={{ width: "200px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", height: "28px" }}
                >
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <button
                  onClick={() => alert(`Test page sent to: ${f.val === printer ? printer : f.val}\n\nIf nothing printed, check cable and power.`)}
                  style={{ background: "#cccccc", color: "#000", border: "1px solid #000", padding: "3px 10px", cursor: "pointer", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold" }}
                >
                  TEST PRINT
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#e91d2a", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ■ SECURITY SETTINGS — CHANGE PASSWORD
          </div>
          <div style={{ padding: "12px" }}>
            {[
              { label: "CURRENT PASSWORD", val: adminPw, setter: setAdminPw },
              { label: "NEW PASSWORD", val: newPw, setter: setNewPw },
              { label: "CONFIRM PASSWORD", val: confirmPw, setter: setConfirmPw },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", minWidth: "160px", letterSpacing: "0.5px" }}>
                  {f.label}:
                </label>
                <input
                  type="password"
                  value={f.val}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "220px", border: "1px solid #000", padding: "5px 8px", fontFamily: "Courier New, monospace", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" as const }}
                />
              </div>
            ))}
            <button
              onClick={handlePasswordChange}
              style={{ background: "#e91d2a", color: "#ffffff", border: "2px solid #000", padding: "6px 16px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}
            >
              🔒 CHANGE PASSWORD
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleSave}
            style={{ background: "#000000", color: "#ffffff", border: "2px solid #000", padding: "8px 24px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#228800")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#000000")}
          >
            ✔ SAVE SETTINGS
          </button>
          <button
            onClick={handleReset}
            style={{ background: "#666666", color: "#ffffff", border: "2px solid #000", padding: "8px 16px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}
          >
            ↺ RESET DEFAULTS
          </button>
          <button
            onClick={handleBackup}
            style={{ background: "#0000aa", color: "#ffffff", border: "2px solid #000", padding: "8px 16px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}
          >
            ⬇ BACKUP DATA
          </button>
        </div>
      </div>
    </div>
  );
}
