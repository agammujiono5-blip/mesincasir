import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const dailyData = [
  { day: "Mon", sales: 8200000, txn: 164 },
  { day: "Tue", sales: 11500000, txn: 230 },
  { day: "Wed", sales: 9800000, txn: 196 },
  { day: "Thu", sales: 13200000, txn: 264 },
  { day: "Fri", sales: 15400000, txn: 308 },
  { day: "Sat", sales: 18700000, txn: 374 },
  { day: "Sun", sales: 7100000, txn: 142 },
];

const weeklyData = [
  { week: "Wk 1", sales: 62000000 },
  { week: "Wk 2", sales: 71000000 },
  { week: "Wk 3", sales: 58000000 },
  { week: "Wk 4", sales: 83000000 },
];

const monthlyData = [
  { month: "Jan", sales: 156000000 },
  { month: "Feb", sales: 142000000 },
  { month: "Mar", sales: 178000000 },
  { month: "Apr", sales: 165000000 },
  { month: "May", sales: 192000000 },
  { month: "Jun", sales: 187000000 },
];

const bestSelling = [
  { name: "Dell Latitude Laptop", sku: "SKU-001", qty: 45, revenue: 202500000 },
  { name: "17\" CRT Monitor", sku: "SKU-004", qty: 62, revenue: 74400000 },
  { name: "InkJet Printer HP 820", sku: "SKU-002", qty: 88, revenue: 74800000 },
  { name: "Keyboard PS/2 102-Key", sku: "SKU-005", qty: 210, revenue: 15750000 },
  { name: "USB Mouse Logitech", sku: "SKU-003", qty: 185, revenue: 23125000 },
];

const fmt = (n: number) => {
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(1) + "M";
  return "Rp " + n.toLocaleString("id-ID");
};

const RETRO_COLORS = ["#e91d2a", "#8e8a25", "#9ab6c8", "#e6915d", "#b3bd95", "#c0d4a7", "#8c9ae0"];

// Custom retro tooltip
const RetroTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#ffffcc",
      border: "2px solid #000000",
      padding: "6px 10px",
      fontFamily: "Times New Roman, Times, serif",
      fontSize: "12px",
    }}>
      <strong style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{label}</strong>
      {payload.map((p: any) => (
        <div key={p.name}>{p.name}: {typeof p.value === "number" && p.value > 10000 ? fmt(p.value) : p.value}</div>
      ))}
    </div>
  );
};

export function Reports() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const chartData = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;
  const xKey = period === "daily" ? "day" : period === "weekly" ? "week" : "month";

  return (
    <div>
      <div
        style={{
          background: "#a5b8c0",
          color: "#000000",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: "14px",
          fontWeight: "900",
          padding: "6px 12px",
          letterSpacing: "2px",
          borderBottom: "2px solid #000000",
        }}
      >
        ◈ SALES REPORTS — ANALYTICS CONSOLE
      </div>

      <div style={{ padding: "12px" }}>
        {/* Period selector */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "12px", borderBottom: "2px solid #000" }}>
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                background: period === p ? "#000000" : "#cccccc",
                color: period === p ? "#fcc20f" : "#000000",
                border: "2px solid #000",
                borderBottom: period === p ? "2px solid #ffffff" : "2px solid #000",
                padding: "5px 18px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: "1px",
                position: "relative",
                bottom: "-2px",
                textTransform: "uppercase",
              }}
            >
              {p === "daily" ? "DAILY SALES" : p === "weekly" ? "WEEKLY SALES" : "MONTHLY SALES"}
            </button>
          ))}
        </div>

        {/* Summary row */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {[
            { label: "TOTAL REVENUE", val: fmt(chartData.reduce((s, d: any) => s + d.sales, 0)), bg: "#a5b8c0" },
            { label: "PEAK DAY/PERIOD", val: (chartData.reduce((a, b: any) => (a as any).sales > (b as any).sales ? a : b) as any)[xKey], bg: "#fcc20f" },
            { label: "AVG PER PERIOD", val: fmt(chartData.reduce((s, d: any) => s + d.sales, 0) / chartData.length), bg: "#c0d4a7" },
            { label: "PERIODS SHOWN", val: chartData.length.toString(), bg: "#8c9ae0" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, border: "2px solid #000", background: s.bg }}>
              <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", padding: "2px 6px", letterSpacing: "0.5px" }}>
                {s.label}
              </div>
              <div style={{ padding: "5px 8px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", fontWeight: "900" }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#000", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ▣ {period.toUpperCase()} SALES CHART — BAR GRAPH (Rp)
          </div>
          <div style={{ padding: "12px", background: "#ffffff" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="0" stroke="#cccccc" vertical={false} />
                <XAxis
                  dataKey={xKey}
                  tick={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold" }}
                  axisLine={{ stroke: "#000000" }}
                  tickLine={{ stroke: "#000000" }}
                />
                <YAxis
                  tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"}
                  tick={{ fontFamily: "Times New Roman, Times, serif", fontSize: 10 }}
                  axisLine={{ stroke: "#000000" }}
                  tickLine={{ stroke: "#000000" }}
                  width={40}
                />
                <Tooltip content={<RetroTooltip />} />
                <Bar dataKey="sales" name="Revenue" stroke="#000000" strokeWidth={1}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={RETRO_COLORS[i % RETRO_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data table for chart */}
        <div style={{ border: "2px solid #000", marginBottom: "12px" }}>
          <div style={{ background: "#444", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ▣ {period.toUpperCase()} SALES DATA TABLE
          </div>
          <div className="pos-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "320px" }}>
            <thead>
              <tr>
                {[period === "daily" ? "DAY" : period === "weekly" ? "WEEK" : "MONTH", "TOTAL SALES", period === "daily" ? "TRANSACTIONS" : "GROWTH", "CHART"].map((h) => (
                  <th key={h} style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#444", color: "#fff", textAlign: "left", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row: any, i) => {
                const maxVal = Math.max(...chartData.map((d: any) => d.sales));
                const barW = Math.round((row.sales / maxVal) * 100);
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}>
                    <td style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold" }}>
                      {row[xKey]}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right", fontWeight: "bold" }}>
                      {fmt(row.sales)}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right" }}>
                      {row.txn ? row.txn + " txn" : i > 0 ? (((row.sales - (chartData[i - 1] as any).sales) / (chartData[i - 1] as any).sales * 100).toFixed(1) + "%") : "—"}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ width: `${barW}%`, maxWidth: "100%", height: "12px", background: RETRO_COLORS[i % RETRO_COLORS.length], border: "1px solid #000", minWidth: "4px" }} />
                        <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px" }}>{barW}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Best Selling */}
        <div style={{ border: "2px solid #000" }}>
          <div style={{ background: "#8e8a25", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ★ BEST SELLING PRODUCTS — TOP 5
          </div>
          <div className="pos-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
            <thead>
              <tr>
                {["RANK", "SKU", "PRODUCT NAME", "QTY SOLD", "TOTAL REVENUE", "REVENUE SHARE"].map((h) => (
                  <th key={h} style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#8e8a25", color: "#fff", textAlign: "left", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bestSelling
                .sort((a, b) => b.revenue - a.revenue)
                .map((p, i) => {
                  const totalRev = bestSelling.reduce((s, x) => s + x.revenue, 0);
                  const share = Math.round((p.revenue / totalRev) * 100);
                  return (
                    <tr key={p.sku} style={{ background: i === 0 ? "#fffde7" : i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}>
                      <td style={{ border: "1px solid #000", padding: "4px 8px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", textAlign: "center", color: i === 0 ? "#e91d2a" : "#000" }}>
                        {["①", "②", "③", "④", "⑤"][i]}
                      </td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{p.sku}</td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", fontWeight: i === 0 ? "bold" : "normal" }}>{p.name}</td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>{p.qty}</td>
                      <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "right", color: "#005500" }}>{fmt(p.revenue)}</td>
                      <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: `${share}%`, height: "12px", background: RETRO_COLORS[i], border: "1px solid #000", minWidth: "4px" }} />
                          <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold" }}>{share}%</span>
                        </div>
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
