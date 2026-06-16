import { useState } from "react";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  image: string;
}

const initialProducts: Product[] = [
  { id: 1, sku: "SKU-001", name: "Dell Latitude 430 Laptop", category: "Computers", stock: 15, buyPrice: 3800000, sellPrice: 4500000, image: "💻" },
  { id: 2, sku: "SKU-002", name: "InkJet Printer HP 820C", category: "Printers", stock: 8, buyPrice: 650000, sellPrice: 850000, image: "🖨" },
  { id: 3, sku: "SKU-003", name: "USB Mouse Logitech M100", category: "Accessories", stock: 42, buyPrice: 85000, sellPrice: 125000, image: "🖱" },
  { id: 4, sku: "SKU-004", name: "17\" CRT Monitor Philips", category: "Monitors", stock: 6, buyPrice: 950000, sellPrice: 1200000, image: "🖥" },
  { id: 5, sku: "SKU-005", name: "Keyboard PS/2 102-Key", category: "Accessories", stock: 55, buyPrice: 45000, sellPrice: 75000, image: "⌨" },
  { id: 6, sku: "SKU-006", name: "Floppy Disk 3.5\" 10-Pack", category: "Storage", stock: 3, buyPrice: 22000, sellPrice: 35000, image: "💾" },
  { id: 7, sku: "SKU-007", name: "Toner Cartridge Black HP", category: "Consumables", stock: 18, buyPrice: 250000, sellPrice: 320000, image: "🖨" },
  { id: 8, sku: "SKU-008", name: "A4 Paper 70gsm Ream", category: "Stationery", stock: 120, buyPrice: 18000, sellPrice: 28000, image: "📄" },
  { id: 9, sku: "SKU-009", name: "56K Fax/Modem Internal", category: "Networking", stock: 4, buyPrice: 180000, sellPrice: 250000, image: "📞" },
  { id: 10, sku: "SKU-010", name: "CD-R 650MB 52x (10-Pack)", category: "Storage", stock: 67, buyPrice: 28000, sellPrice: 45000, image: "💿" },
];

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditData({ ...p });
  };

  const saveEdit = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editId ? { ...p, ...editData } : p))
    );
    setEditId(null);
    setEditData({});
  };

  const deleteProduct = (id: number) => {
    if (confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div
        style={{
          background: "#9ab6c8",
          color: "#000000",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: "14px",
          fontWeight: "900",
          padding: "6px 12px",
          letterSpacing: "2px",
          borderBottom: "2px solid #000000",
        }}
      >
        ◈ PRODUCT INVENTORY — MANAGEMENT CONSOLE
      </div>

      <div style={{ padding: "12px" }}>
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "10px",
            alignItems: "center",
            border: "2px solid #000",
            padding: "8px",
            background: "#f0f0f0",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            SEARCH:
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            style={{
              flex: 1,
              border: "1px solid #000",
              padding: "4px 6px",
              fontFamily: "Times New Roman, Times, serif",
              fontSize: "12px",
              background: "#fffff0",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "#228800",
              color: "#ffffff",
              border: "2px solid #000",
              padding: "4px 12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            + ADD NEW PRODUCT
          </button>
          <button
            style={{
              background: "#0000aa",
              color: "#ffffff",
              border: "2px solid #000",
              padding: "4px 12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            ↓ EXPORT CSV
          </button>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "10px",
          }}
        >
          {[
            { label: "TOTAL PRODUCTS", val: products.length, bg: "#9ab6c8" },
            { label: "TOTAL STOCK", val: products.reduce((s, p) => s + p.stock, 0), bg: "#b3bd95" },
            { label: "LOW STOCK (<10)", val: products.filter((p) => p.stock < 10).length, bg: "#e6a0a0" },
            { label: "CATEGORIES", val: [...new Set(products.map((p) => p.category))].length, bg: "#c0d4a7" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                border: "2px solid #000",
                background: s.bg,
                padding: "6px 8px",
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "9px",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontSize: "18px",
                  fontWeight: "900",
                }}
              >
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div style={{ border: "2px solid #000000" }}>
          <div
            style={{
              background: "#000000",
              color: "#ffffff",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "4px 8px",
              letterSpacing: "1px",
            }}
          >
            PRODUCT LIST — {filtered.length} RECORDS FOUND
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
              <thead>
                <tr>
                  {["IMG", "SKU", "PRODUCT NAME", "CATEGORY", "STOCK", "BUY PRICE", "SELL PRICE", "MARGIN", "ACTIONS"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          border: "1px solid #000",
                          padding: "4px 6px",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "10px",
                          fontWeight: "bold",
                          background: "#444444",
                          color: "#ffffff",
                          letterSpacing: "0.5px",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const margin = Math.round(((p.sellPrice - p.buyPrice) / p.buyPrice) * 100);
                  const isEdit = editId === p.id;
                  return (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center", fontSize: "18px" }}>
                        {p.image}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>
                        {p.sku}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>
                        {isEdit ? (
                          <input
                            value={editData.name || ""}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            style={{ width: "100%", border: "1px solid #000", padding: "2px 4px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", outline: "none" }}
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>
                        <span style={{ background: "#e0e8f0", border: "1px solid #000", padding: "1px 4px", fontSize: "11px" }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "center", color: p.stock < 10 ? "#cc0000" : "#005500" }}>
                        {isEdit ? (
                          <input
                            type="number"
                            value={editData.stock || 0}
                            onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                            style={{ width: "50px", border: "1px solid #000", padding: "2px 4px", textAlign: "center", outline: "none" }}
                          />
                        ) : (
                          p.stock + (p.stock < 10 ? " ⚠" : "")
                        )}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right" }}>
                        {fmt(p.buyPrice)}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right", fontWeight: "bold" }}>
                        {fmt(p.sellPrice)}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", textAlign: "center", color: "#005500", fontWeight: "bold" }}>
                        +{margin}%
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", whiteSpace: "nowrap" }}>
                        {isEdit ? (
                          <div style={{ display: "flex", gap: "2px" }}>
                            <button
                              onClick={saveEdit}
                              style={{ background: "#228800", color: "#fff", border: "1px solid #000", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              style={{ background: "#666", color: "#fff", border: "1px solid #000", padding: "2px 6px", cursor: "pointer", fontSize: "11px" }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "2px" }}>
                            <button
                              onClick={() => startEdit(p)}
                              style={{ background: "#0000aa", color: "#fff", border: "1px solid #000", padding: "2px 6px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              style={{ background: "#cc0000", color: "#fff", border: "1px solid #000", padding: "2px 6px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                            >
                              DEL
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
