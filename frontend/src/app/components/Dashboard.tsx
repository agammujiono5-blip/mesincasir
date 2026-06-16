import { useEffect, useState } from "react";

type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";

interface DashboardStats {
  today_sales: number;
  total_transactions: number;
  active_products: number;
  low_stock: number;
  total_customers: number;
  avg_order_value: number;
  employees_on_duty: number;
  monthly_revenue: number;
  recent_transactions?: {
    transaction_code: string;
    customer: string;
    cashier: string;
    grand_total: number;
    status: string;
    created_at: string;
  }[];
  low_stock_products?: {
    sku: string;
    name: string;
    category: string;
    stock: number;
  }[];
}

interface DashboardProps { onNavigate: (s: Section) => void; }

const RibbonCard = ({ title, value, sub, bg, icon, onClick }: {
  title: string; value: string; sub?: string; bg: string; icon: string; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{ border: "2px solid #000", background: bg, cursor: onClick ? "pointer" : "default" }}
    onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.filter = "brightness(0.93)"; }}
    onMouseLeave={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)"; }}
  >
    <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, fontWeight: "bold", padding: "2px 6px", letterSpacing: "1px" }}>{title}</div>
    <div style={{ padding: "7px 8px" }}>
      <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 17, fontWeight: 900, color: "#000", letterSpacing: "-0.5px", lineHeight: "1.1" }}>{icon} {value}</div>
      {sub && <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 10, color: "#333", marginTop: 2 }}>{sub}</div>}
      {onClick && <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, color: "#0000ee", textDecoration: "underline", marginTop: 2 }}>View →</div>}
    </div>
  </div>
);

const th = (label: string, i: number) => (
  <th key={i} style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", background: "#000", color: "#fff", textAlign: "left", whiteSpace: "nowrap" }}>{label}</th>
);
const td = (val: string, i: number, rowIdx: number) => (
  <td key={i} style={{ border: "1px solid #ccc", padding: "3px 7px", fontFamily: "Times New Roman, Times, serif", fontSize: 12, background: rowIdx % 2 === 0 ? "#fff" : "#f5f5f5", whiteSpace: "nowrap" }}>{val}</td>
);

const formatRupiah = (value: number): string => {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000)     return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  if (value >= 1_000)         return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    fetch("http://localhost:8080/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data: DashboardStats) => {
        setStats(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ padding: 24, fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, textAlign: "center" }}>
      ⏳ Memuat data dashboard...
    </div>
  );

  if (error) return (
    <div style={{ padding: 24, fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, color: "#cc0000", border: "2px solid #cc0000", margin: 12, background: "#fff5f5" }}>
      ❌ Gagal memuat dashboard: {error}
      <br />
      <button
        onClick={() => window.location.reload()}
        style={{ marginTop: 8, background: "#cc0000", color: "#fff", border: "none", padding: "4px 10px", cursor: "pointer", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11 }}
      >
        🔄 Coba Lagi
      </button>
    </div>
  );

  if (!stats) return null;

  const now = new Date();
  const bulan = now.toLocaleString("id-ID", { month: "long", year: "numeric" });

  return (
    <div>
      <div
        className="pos-section-title"
        style={{ background: "#8e8a25", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 14, fontWeight: 900, padding: "6px 12px", letterSpacing: "2px", borderBottom: "2px solid #000" }}
      >
        ◈ POINT OF SALE SYSTEM — DASHBOARD OVERVIEW
      </div>

      <div className="pos-module-pad" style={{ padding: "12px" }}>

        {/* Row 1 — semua dari API */}
        <div className="pos-grid-4">
          <RibbonCard title="TODAY SALES"        value={formatRupiah(stats.today_sales)}                  sub="as of today"           bg="#e6915d" icon="💰" onClick={() => onNavigate("reports")} />
          <RibbonCard title="TOTAL TRANSACTIONS" value={stats.total_transactions.toLocaleString("id-ID")} sub="Orders processed"      bg="#b3bd95" icon="🧾" onClick={() => onNavigate("sales")} />
          <RibbonCard title="ACTIVE PRODUCTS"    value={stats.active_products.toLocaleString("id-ID")}    sub="Items in catalog"      bg="#9ab6c8" icon="📦" onClick={() => onNavigate("products")} />
          <RibbonCard title="LOW STOCK ALERT"    value={String(stats.low_stock)}                          sub="Products need reorder"  bg="#e6a0a0" icon="⚠" onClick={() => onNavigate("inventory")} />
        </div>

        {/* Row 2 — semua dari API */}
        <div className="pos-grid-4">
          <RibbonCard title="TOTAL CUSTOMERS"   value={stats.total_customers.toLocaleString("id-ID")}  sub="Registered members"  bg="#c0d4a7" icon="👤" onClick={() => onNavigate("customers")} />
          <RibbonCard title="AVG. ORDER VALUE"  value={formatRupiah(stats.avg_order_value)}            sub="Per transaction"     bg="#a5b8c0" icon="📈" onClick={() => onNavigate("reports")} />
          <RibbonCard title="TOP CASHIER"       value={stats.top_cashier || "—"}                        sub="Highest monthly sales" bg="#8c9ae0" icon="🏆" onClick={() => onNavigate("employees")} />
          <RibbonCard title="MONTHLY REVENUE"   value={formatRupiah(stats.monthly_revenue)}            sub={bulan}              bg="#fcc20f" icon="💰" onClick={() => onNavigate("reports")} />
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10, border: "2px solid #000", padding: "7px", background: "#f0f0f0", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: "bold", alignSelf: "center", marginRight: 4, whiteSpace: "nowrap" }}>QUICK:</span>
          {[
            { label: "➕ NEW SALE",   s: "sales"     as Section, bg: "#228800" },
            { label: "📦 PRODUCTS",  s: "products"  as Section, bg: "#0000aa" },
            { label: "👤 CUSTOMERS", s: "customers" as Section, bg: "#005577" },
            { label: "📊 REPORTS",   s: "reports"   as Section, bg: "#8e8a25" },
            { label: "⚙ SETTINGS",  s: "settings"  as Section, bg: "#444"    },
          ].map((btn) => (
            <button key={btn.s} onClick={() => onNavigate(btn.s)}
              style={{ background: btn.bg, color: "#fff", border: "2px solid #000", padding: "4px 9px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.2)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)")}
            >{btn.label}</button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div style={{ border: "2px solid #000", marginBottom: 10 }}>
          <div style={{ background: "#e6915d", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderBottom: "2px solid #000", display: "flex", alignItems: "center", letterSpacing: "0.5px" }}>
            ■ RECENT TRANSACTIONS
            <span onClick={() => onNavigate("sales")} style={{ marginLeft: "auto", fontFamily: "Times New Roman, Times, serif", fontSize: 11, fontWeight: "normal", color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>
              [View All →]
            </span>
          </div>
          <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["TXN ID","DATE","CUSTOMER","CASHIER","AMOUNT","STATUS"].map(th)}</tr></thead>
              <tbody>
                {(!stats.recent_transactions || stats.recent_transactions.length === 0) ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", fontStyle: "italic", border: "1px solid #ccc" }}>
                      Tidak ada transaksi terbaru.
                    </td>
                  </tr>
                ) : (
                  stats.recent_transactions.map((row, i) => (
                    <tr key={i}>
                      {td(row.transaction_code, 0, i)}
                      {td(row.created_at, 1, i)}
                      {td(row.customer, 2, i)}
                      {td(row.cashier || "—", 3, i)}
                      {td(formatRupiah(row.grand_total), 4, i)}
                      {td(row.status === "PAID" ? "✔ PAID" : row.status, 5, i)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "4px 8px", background: "#f8f8f8", borderTop: "1px solid #ccc", textAlign: "right" }}>
            <span onClick={() => onNavigate("sales")} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>
              ► Open Transaction Register
            </span>
          </div>
        </div>

        {/* Low Stock */}
        <div style={{ border: "2px solid #000" }}>
          <div style={{ background: "#e6a0a0", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderBottom: "2px solid #000", display: "flex", alignItems: "center", letterSpacing: "0.5px" }}>
            ⚠ LOW STOCK WARNING
            <span onClick={() => onNavigate("inventory")} style={{ marginLeft: "auto", fontFamily: "Times New Roman, Times, serif", fontSize: 11, fontWeight: "normal", color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>
              [Manage →]
            </span>
          </div>
          <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["SKU","PRODUCT NAME","CATEGORY","QTY LEFT"].map(th)}</tr></thead>
              <tbody>
                {(!stats.low_stock_products || stats.low_stock_products.length === 0) ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", fontStyle: "italic", border: "1px solid #ccc" }}>
                      Semua stok produk aman (stok &gt; 5).
                    </td>
                  </tr>
                ) : (
                  stats.low_stock_products.map((row, i) => (
                    <tr key={i}>
                      {td(row.sku, 0, i)}
                      {td(row.name, 1, i)}
                      {td(row.category, 2, i)}
                      {td(String(row.stock), 3, i)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "4px 8px", background: "#fff8f8", borderTop: "1px solid #ccc", textAlign: "right" }}>
            <span onClick={() => onNavigate("inventory")} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>
              ► Reorder Stock
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}