import { useState } from "react";
import { RetroModal } from "./RetroModal";

interface HelpModalProps { onClose: () => void; }

const TOPICS = [
  {
    title: "Getting Started",
    icon: "🏁",
    content: [
      "1. Login dengan username 'admin' dan password default '1234'.",
      "2. Pilih menu dari sidebar kiri sesuai kebutuhan.",
      "3. Untuk memulai transaksi, klik menu SALES di sidebar.",
      "4. Cari atau scan produk, pilih customer, lalu checkout.",
    ],
  },
  {
    title: "Cara Transaksi Penjualan",
    icon: "💲",
    content: [
      "1. Klik SALES di menu sidebar.",
      "2. Cari atau pilih customer (atau klik WALK-IN).",
      "3. Scan barcode produk atau ketik di kolom CARI PRODUK.",
      "4. Atur jumlah dengan tombol +/−.",
      "5. Tambahkan diskon per produk jika ada.",
      "6. Klik CHECKOUT untuk menyelesaikan transaksi.",
    ],
  },
  {
    title: "Manajemen Produk",
    icon: "📦",
    content: [
      "• Klik PRODUCTS di sidebar untuk melihat semua produk.",
      "• Gunakan kolom SEARCH untuk mencari produk.",
      "• Klik EDIT untuk mengubah harga atau stok.",
      "• Klik + ADD NEW PRODUCT untuk menambah produk baru.",
      "• Produk dengan stok < 10 akan ditandai ⚠.",
    ],
  },
  {
    title: "Inventory & Stok",
    icon: "🗄",
    content: [
      "• Buka INVENTORY untuk melihat pergerakan stok.",
      "• Gunakan form INCOMING GOODS untuk menambah stok masuk.",
      "• Tab SUPPLIER DATA menampilkan daftar pemasok.",
      "• Tab LOW STOCK WARNING menampilkan produk yang perlu reorder.",
      "• Klik REORDER untuk membuat pesanan ke supplier.",
    ],
  },
  {
    title: "Customer & Membership",
    icon: "👤",
    content: [
      "• Membership terdiri dari 4 tingkat: Bronze, Silver, Gold, Platinum.",
      "• Setiap level mendapat diskon otomatis saat transaksi.",
      "• Poin loyalitas diperoleh dari setiap pembelian.",
      "• Daftarkan customer baru langsung dari halaman Sales.",
      "• Lihat riwayat pembelian di menu CUSTOMERS.",
    ],
  },
  {
    title: "Laporan & Analisa",
    icon: "📊",
    content: [
      "• Buka REPORTS untuk melihat laporan penjualan.",
      "• Pilih tab Daily / Weekly / Monthly untuk periode berbeda.",
      "• Grafik batang menampilkan tren penjualan secara visual.",
      "• Tabel Best Selling menampilkan produk terlaris.",
      "• Data dapat diekspor ke file CSV.",
    ],
  },
];

export function HelpModal({ onClose }: HelpModalProps) {
  const [activeTopic, setActiveTopic] = useState(0);

  return (
    <RetroModal title="❓ HELP — PANDUAN PENGGUNA DELL POS" onClose={onClose} headerBg="#005500" headerColor="#ffffff" width="600px">
      <div style={{ display: "flex", minHeight: "380px" }}>
        {/* Topic list */}
        <div style={{ width: "180px", flexShrink: 0, borderRight: "2px solid #000000" }}>
          <div style={{ background: "#005500", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            TOPIK BANTUAN
          </div>
          {TOPICS.map((t, i) => (
            <div
              key={i}
              onClick={() => setActiveTopic(i)}
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid #cccccc",
                cursor: "pointer",
                background: activeTopic === i ? "#000000" : "#ffffff",
                color: activeTopic === i ? "#fcc20f" : "#000000",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: activeTopic === i ? "bold" : "normal",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => { if (activeTopic !== i) (e.currentTarget as HTMLDivElement).style.background = "#ffffcc"; }}
              onMouseLeave={(e) => { if (activeTopic !== i) (e.currentTarget as HTMLDivElement).style.background = "#ffffff"; }}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </div>
          ))}
        </div>

        {/* Topic content */}
        <div style={{ flex: 1, padding: "12px" }}>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", marginBottom: "10px", borderBottom: "2px solid #000", paddingBottom: "6px" }}>
            {TOPICS[activeTopic].icon} {TOPICS[activeTopic].title}
          </div>
          {TOPICS[activeTopic].content.map((line, i) => (
            <div key={i} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#000000", marginBottom: "8px", lineHeight: "1.5", paddingLeft: "4px", borderLeft: "3px solid #cccccc" }}>
              {line}
            </div>
          ))}

          <div style={{ marginTop: "16px", border: "1px solid #cccccc", padding: "8px", background: "#f8f8f8" }}>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#555", marginBottom: "4px" }}>
              ℹ BUTUH BANTUAN LEBIH LANJUT?
            </div>
            <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "12px", color: "#333" }}>
              Hubungi Technical Support di <strong style={{ color: "#e91d2a" }}>0800-POS-HELP</strong> atau email{" "}
              <span style={{ color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>support@dell-pos.id</span>
            </div>
          </div>
        </div>
      </div>
    </RetroModal>
  );
}
