import { useState } from "react";

const movements = [
  { id: "MV-001", date: "11 Jun 1996", type: "IN", product: "Dell Latitude Laptop", qty: 10, supplier: "Dell Inc.", ref: "PO-2341" },
  { id: "MV-002", date: "10 Jun 1996", type: "OUT", product: "Toner Cartridge Black", qty: 5, supplier: "—", ref: "TXN-0981" },
  { id: "MV-003", date: "10 Jun 1996", type: "IN", product: "A4 Paper 70gsm", qty: 200, supplier: "Sinar Mas", ref: "PO-2342" },
  { id: "MV-004", date: "09 Jun 1996", type: "OUT", product: "USB Mouse Logitech", qty: 12, supplier: "—", ref: "TXN-0955" },
  { id: "MV-005", date: "09 Jun 1996", type: "IN", product: "CD-R 650MB 10-Pack", qty: 50, supplier: "Verbatim Asia", ref: "PO-2343" },
  { id: "MV-006", date: "08 Jun 1996", type: "ADJ", product: "Floppy Disk 3.5\" 10-Pk", qty: -3, supplier: "—", ref: "ADJ-0021" },
  { id: "MV-007", date: "07 Jun 1996", type: "IN", product: "17\" CRT Monitor Philips", qty: 4, supplier: "Philips Indonesia", ref: "PO-2340" },
];

const suppliers = [
  { name: "Dell Inc.", contact: "1-800-DELL", city: "Round Rock, TX", products: 45, status: "ACTIVE" },
  { name: "HP Indonesia", contact: "021-5551234", city: "Jakarta", products: 23, status: "ACTIVE" },
  { name: "Logitech Asia", contact: "021-7654321", city: "Singapore", products: 12, status: "ACTIVE" },
  { name: "Sinar Mas", contact: "021-4441122", city: "Jakarta", products: 8, status: "ACTIVE" },
  { name: "Verbatim Asia", contact: "021-3332244", city: "Surabaya", products: 6, status: "INACTIVE" },
];

const lowStockItems = [
  { sku: "SKU-006", name: "Floppy Disk 3.5\" 10-Pack", stock: 3, min: 10, supplier: "Verbatim Asia" },
  { sku: "SKU-009", name: "56K Fax/Modem Internal", stock: 4, min: 10, supplier: "Motorola" },
  { sku: "SKU-004", name: "17\" CRT Monitor Philips", stock: 6, min: 10, supplier: "Philips Indonesia" },
  { sku: "SKU-002", name: "InkJet Printer HP 820C", stock: 8, min: 10, supplier: "HP Indonesia" },
];

export function Inventory() {
  const [activeTab, setActiveTab] = useState<"movements" | "suppliers" | "lowstock">("movements");

  const tabStyle = (tab: string) => ({
    padding: "5px 14px",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "11px",
    fontWeight: "bold" as const,
    letterSpacing: "0.5px",
    cursor: "pointer",
    border: "2px solid #000000",
    borderBottom: activeTab === tab ? "2px solid #ffffff" : "2px solid #000000",
    background: activeTab === tab ? "#ffffff" : "#cccccc",
    color: "#000000",
    marginRight: "2px",
    position: "relative" as const,
    bottom: "-2px",
  });

  return (
    <div>
      <div
        style={{
          background: "#b3bd95",
          color: "#000000",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: "14px",
          fontWeight: "900",
          padding: "6px 12px",
          letterSpacing: "2px",
          borderBottom: "2px solid #000000",
        }}
      >
        ◈ STOCK CONTROL — INVENTORY MANAGEMENT
      </div>

      <div style={{ padding: "12px" }}>
        {/* Summary cards */}
        <div className="pos-grid-4" style={{ marginBottom: "12px" }}>
          {[
            { label: "TOTAL SKUs", val: "1,250", bg: "#9ab6c8", icon: "📦" },
            { label: "INCOMING (TODAY)", val: "+264 units", bg: "#b3bd95", icon: "⬇" },
            { label: "OUTGOING (TODAY)", val: "−17 units", bg: "#e6915d", icon: "⬆" },
            { label: "LOW STOCK ITEMS", val: "12 SKUs", bg: "#e6a0a0", icon: "⚠" },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                border: "2px solid #000",
                background: c.bg,
              }}
            >
              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  letterSpacing: "0.5px",
                }}
              >
                {c.label}
              </div>
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "16px", fontWeight: "900" }}>
                  {c.icon} {c.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add stock form */}
        <div style={{ border: "2px solid #000", marginBottom: "12px", background: "#f8f8e8" }}>
          <div
            style={{
              background: "#000000",
              color: "#fcc20f",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "4px 8px",
              letterSpacing: "1px",
            }}
          >
            ■ INCOMING GOODS — ADD STOCK
          </div>
          <div style={{ padding: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "SKU / BARCODE", placeholder: "e.g. SKU-001", width: "140px" },
              { label: "PRODUCT NAME", placeholder: "Product description", width: "200px" },
              { label: "SUPPLIER", placeholder: "Supplier name", width: "140px" },
              { label: "QUANTITY", placeholder: "0", width: "80px" },
              { label: "PO / REF NO.", placeholder: "PO-XXXX", width: "100px" },
            ].map((f) => (
              <div key={f.label}>
                <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>
                  {f.label}
                </div>
                <input
                  placeholder={f.placeholder}
                  style={{
                    width: f.width,
                    border: "1px solid #000",
                    padding: "4px 6px",
                    fontFamily: "Times New Roman, Times, serif",
                    fontSize: "12px",
                    background: "#fffff0",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <button
                style={{
                  background: "#228800",
                  color: "#ffffff",
                  border: "2px solid #000",
                  padding: "4px 14px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  height: "28px",
                }}
              >
                + ADD STOCK
              </button>
              <button
                style={{
                  background: "#cc6600",
                  color: "#ffffff",
                  border: "2px solid #000",
                  padding: "4px 12px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  height: "28px",
                }}
              >
                − ADJUST
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: "2px solid #000000", marginBottom: "0" }}>
          <span onClick={() => setActiveTab("movements")} style={tabStyle("movements")}>
            STOCK MOVEMENT HISTORY
          </span>
          <span onClick={() => setActiveTab("suppliers")} style={tabStyle("suppliers")}>
            SUPPLIER DATA
          </span>
          <span onClick={() => setActiveTab("lowstock")} style={tabStyle("lowstock")}>
            ⚠ LOW STOCK WARNING
          </span>
        </div>

        {/* Tab content */}
        <div style={{ border: "2px solid #000", borderTop: "none" }}>
          {activeTab === "movements" && (
            <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr>
                  {["REF ID", "DATE", "TYPE", "PRODUCT", "QTY", "SUPPLIER/REF", "PO REF"].map((h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #000",
                        padding: "4px 6px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: "#444",
                        color: "#fff",
                        textAlign: "left",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movements.map((m, i) => (
                  <tr key={m.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{m.id}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{m.date}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                      <span
                        style={{
                          background: m.type === "IN" ? "#228800" : m.type === "OUT" ? "#cc0000" : "#cc6600",
                          color: "#ffffff",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "10px",
                          fontWeight: "bold",
                          padding: "1px 5px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{m.product}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "center", color: m.type === "IN" ? "#228800" : "#cc0000" }}>
                      {m.type === "IN" ? "+" : "−"}{Math.abs(m.qty)}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{m.supplier}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px", color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>{m.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {activeTab === "suppliers" && (
            <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "360px" }}>
              <thead>
                <tr>
                  {["SUPPLIER NAME", "CONTACT", "CITY", "# PRODUCTS", "STATUS"].map((h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #000",
                        padding: "4px 8px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: "#444",
                        color: "#fff",
                        textAlign: "left",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, i) => (
                  <tr key={s.name} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}>
                    <td style={{ border: "1px solid #000", padding: "5px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold" }}>{s.name}</td>
                    <td style={{ border: "1px solid #000", padding: "5px 8px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{s.contact}</td>
                    <td style={{ border: "1px solid #000", padding: "5px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{s.city}</td>
                    <td style={{ border: "1px solid #000", padding: "5px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", textAlign: "center" }}>{s.products}</td>
                    <td style={{ border: "1px solid #000", padding: "5px 8px" }}>
                      <span style={{ background: s.status === "ACTIVE" ? "#228800" : "#999999", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "1px 5px" }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {activeTab === "lowstock" && (
            <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
              <thead>
                <tr>
                  {["SKU", "PRODUCT NAME", "CURRENT STOCK", "MIN STOCK", "DEFICIT", "SUPPLIER", "ACTION"].map((h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #000",
                        padding: "4px 6px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: "#aa0000",
                        color: "#fff",
                        textAlign: "left",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, i) => (
                  <tr key={item.sku} style={{ background: i % 2 === 0 ? "#fff8f8" : "#fff0f0" }}>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{item.sku}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{item.name}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", color: "#cc0000", textAlign: "center" }}>{item.stock}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", textAlign: "center" }}>{item.min}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", color: "#cc0000", textAlign: "center" }}>−{item.min - item.stock}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{item.supplier}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                      <button style={{ background: "#000000", color: "#fcc20f", border: "1px solid #000", padding: "2px 8px", cursor: "pointer", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold" }}>
                        REORDER
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
