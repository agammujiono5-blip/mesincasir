import { useState } from "react";
import { RetroModal } from "./RetroModal";

type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";

interface FindModalProps {
  onClose: () => void;
  onNavigate: (s: Section) => void;
}

const ALL_ITEMS = [
  { label: "Dashboard Overview", section: "dashboard" as Section, keywords: ["dashboard", "home", "overview", "ringkasan"] },
  { label: "New Transaction / Kasir", section: "sales" as Section, keywords: ["sales", "transaksi", "kasir", "beli", "jual", "checkout", "bayar"] },
  { label: "Product Management", section: "products" as Section, keywords: ["product", "produk", "barang", "sku", "harga", "stok"] },
  { label: "Inventory / Stock Control", section: "inventory" as Section, keywords: ["inventory", "stok", "gudang", "supplier", "masuk", "keluar"] },
  { label: "Customer Database", section: "customers" as Section, keywords: ["customer", "pelanggan", "member", "loyalty", "poin"] },
  { label: "Sales Reports & Charts", section: "reports" as Section, keywords: ["report", "laporan", "grafik", "chart", "analisa", "penjualan"] },
  { label: "Employee Management", section: "employees" as Section, keywords: ["employee", "karyawan", "kasir", "staff", "pegawai"] },
  { label: "System Settings", section: "settings" as Section, keywords: ["settings", "pengaturan", "konfigurasi", "pajak", "toko"] },
];

const QUICK_LINKS: { label: string; desc: string; section: Section; icon: string }[] = [
  { label: "New Transaction", desc: "Mulai transaksi baru", section: "sales", icon: "💲" },
  { label: "Add Product", desc: "Tambah produk baru", section: "products", icon: "📦" },
  { label: "View Reports", desc: "Laporan penjualan", section: "reports", icon: "📊" },
  { label: "Customer List", desc: "Daftar pelanggan", section: "customers", icon: "👤" },
  { label: "Low Stock", desc: "Cek stok menipis", section: "inventory", icon: "⚠" },
  { label: "Settings", desc: "Pengaturan sistem", section: "settings", icon: "⚙" },
];

export function FindModal({ onClose, onNavigate }: FindModalProps) {
  const [query, setQuery] = useState("");

  const results = query.length >= 2
    ? ALL_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : [];

  const go = (s: Section) => { onNavigate(s); onClose(); };

  return (
    <RetroModal title="🔍 FIND — CARI MENU / FITUR" onClose={onClose} headerBg="#000080" headerColor="#ffffff" width="520px">
      <div style={{ padding: "14px" }}>
        {/* Search input */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000080", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            ENTER SEARCH QUERY:
          </div>
          <div style={{ padding: "8px", background: "#f0f0ff" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama menu, fitur, atau kata kunci..."
              style={{
                width: "100%",
                border: "2px solid #000000",
                padding: "6px 10px",
                fontFamily: "Times New Roman, Times, serif",
                fontSize: "14px",
                background: "#fffff0",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
            <div style={{ background: "#000000", color: "#fcc20f", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
              HASIL PENCARIAN — {results.length} ITEM DITEMUKAN
            </div>
            {results.length === 0 ? (
              <div style={{ padding: "12px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#cc0000", fontStyle: "italic" }}>
                ⚠ Tidak ada hasil untuk "{query}". Coba kata kunci lain.
              </div>
            ) : (
              results.map((item) => (
                <div
                  key={item.section}
                  onClick={() => go(item.section)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderBottom: "1px solid #cccccc", cursor: "pointer" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffcc")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffff")}
                >
                  <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "13px", fontWeight: "bold" }}>{item.label}</span>
                  <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#0000ee", textDecoration: "underline" }}>Buka →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick links */}
        <div style={{ border: "2px solid #000" }}>
          <div style={{ background: "#444444", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", letterSpacing: "1px" }}>
            ★ QUICK LINKS — MENU CEPAT
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
            {QUICK_LINKS.map((link, i) => (
              <div
                key={link.section}
                onClick={() => go(link.section)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRight: i % 2 === 0 ? "1px solid #cccccc" : "none",
                  borderBottom: i < 4 ? "1px solid #cccccc" : "none",
                  cursor: "pointer",
                  background: "#ffffff",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffcc")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffff")}
              >
                <span style={{ fontSize: "20px" }}>{link.icon}</span>
                <div>
                  <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold" }}>{link.label}</div>
                  <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#555" }}>{link.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RetroModal>
  );
}
