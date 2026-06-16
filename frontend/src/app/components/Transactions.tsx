import { useState, useEffect } from "react";

interface CartItem {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  points: number;
  purchases: number;
}

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

const levelColors: Record<string, string> = {
  PLATINUM: "#8c9ae0",
  GOLD: "#fcc20f",
  SILVER: "#a5b8c0",
  BRONZE: "#e6915d",
};

const levelDiscount: Record<string, number> = {
  PLATINUM: 10,
  GOLD: 7,
  SILVER: 5,
  BRONZE: 2,
};

const fmt = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");


// ─── Customer Panel ────────────────────────────────────────────────────────────
function CustomerPanel({
  selected, onSelect, onClear,
}: {
  selected: Customer | null;
  onSelect: (c: Customer) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [customersDb, setCustomersDb] = useState<Customer[]>([]);

  // Load customers dari backend
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCustomersDb(Array.isArray(data) ? data : data.data ?? data.customers ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCustomers();
  }, []);

  const results = query.length >= 2
    ? customersDb.filter(
        (c) =>
          c.name?.toLowerCase().includes(query.toLowerCase()) ||
          c.phone?.includes(query) ||
          String(c.id).toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleRegisterNew = async () => {
    if (!newName.trim()) { alert("Nama customer harus diisi!"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, phone: newPhone, email: newEmail, membership: "BRONZE" }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.message || "Gagal menambah customer"); return; }
      const newCust: Customer = {
        id: data.id || String(Date.now()),
        name: newName.trim(),
        phone: newPhone || "—",
        email: newEmail || "—",
        level: "BRONZE",
        points: 0,
        purchases: 0,
      };
      setCustomersDb((prev) => [...prev, newCust]);
      onSelect(newCust);
      setShowNew(false);
      setNewName(""); setNewPhone(""); setNewEmail("");
    } catch (err) {
      console.error(err);
      alert("Tidak dapat terhubung ke backend");
    }
  };

  return (
    <div style={{ border: "2px solid #000000", marginBottom: "10px" }}>
      <div style={{ background: "#000000", color: "#c0d4a7", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>■ DATA PEMBELI / CUSTOMER</span>
        {!selected && (
          <span style={{ color: "#fcc20f", cursor: "pointer", fontSize: "10px" }} onClick={() => setShowNew(!showNew)}>
            {showNew ? "▲ TUTUP" : "▼ DAFTAR BARU"}
          </span>
        )}
      </div>

      <div style={{ padding: "8px", background: "#f8fff8" }}>
        {selected ? (
          <div style={{ border: "2px solid #000000", background: "#ffffff", display: "flex", alignItems: "stretch" }}>
            <div style={{ width: "8px", background: levelColors[selected.level] || "#ccc", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0" }}>
              {[
                { label: "ID PELANGGAN", val: String(selected.id) },
                { label: "NAMA", val: selected.name },
                { label: "NO. TELEPON", val: selected.phone },
                { label: "EMAIL", val: selected.email },
                {
                  label: "MEMBERSHIP",
                  val: (
                    <span style={{ background: levelColors[selected.level], border: "1px solid #000", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "1px 6px", letterSpacing: "0.5px" }}>
                      ★ {selected.level}
                    </span>
                  ),
                },
                {
                  label: "POIN LOYALITAS",
                  val: <span style={{ color: "#005500", fontWeight: "bold" }}>{(selected.points || 0).toLocaleString()} pts</span>,
                },
              ].map((item, i) => (
                <div key={i} style={{ borderRight: i % 3 < 2 ? "1px solid #cccccc" : "none", borderBottom: i < 3 ? "1px solid #cccccc" : "none", padding: "5px 8px" }}>
                  <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", letterSpacing: "0.5px", color: "#555555", marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontFamily: typeof item.val === "string" ? "Times New Roman, Times, serif" : "inherit", fontSize: "12px", color: "#000000" }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ width: "130px", flexShrink: 0, borderLeft: "2px solid #000000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px", gap: "6px", background: "#fffde7" }}>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", letterSpacing: "0.5px", textAlign: "center" }}>DISKON MEMBER</div>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "22px", fontWeight: "900", color: "#e91d2a", lineHeight: "1" }}>{levelDiscount[selected.level] || 0}%</div>
              <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "10px", color: "#333333", textAlign: "center" }}>Otomatis diterapkan</div>
              <button onClick={onClear} style={{ background: "#cc0000", color: "#ffffff", border: "2px solid #000000", padding: "3px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px", width: "100%" }}>
                ✕ GANTI
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "6px", marginBottom: showNew ? "8px" : "0" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "3px", letterSpacing: "0.5px" }}>
                  CARI CUSTOMER (nama / no. HP / ID):
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik min. 2 karakter untuk mencari..."
                  style={{ width: "100%", border: "1px solid #000000", padding: "5px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }}
                />
                {results.length > 0 && (
                  <div style={{ position: "absolute", left: 0, right: 0, background: "#ffffff", border: "2px solid #000000", zIndex: 20, maxHeight: "180px", overflowY: "auto" }}>
                    {results.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => { onSelect(c); setQuery(""); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderBottom: "1px solid #cccccc", cursor: "pointer" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffcc")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffff")}
                      >
                        <span style={{ background: levelColors[c.level] || "#ccc", border: "1px solid #000", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", padding: "1px 4px", whiteSpace: "nowrap", minWidth: "58px", textAlign: "center" }}>
                          {c.level || "BRONZE"}
                        </span>
                        <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", flex: 1 }}>{c.name}</span>
                        <span style={{ fontFamily: "Courier New, monospace", fontSize: "11px", color: "#555555" }}>{c.phone}</span>
                        <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", color: "#005500", fontWeight: "bold" }}>{(c.points || 0).toLocaleString()} pts</span>
                      </div>
                    ))}
                  </div>
                )}
                {query.length >= 2 && results.length === 0 && (
                  <div style={{ position: "absolute", left: 0, right: 0, background: "#fff8f8", border: "2px solid #cc0000", zIndex: 20, padding: "8px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", color: "#cc0000" }}>
                    ⚠ Customer tidak ditemukan. Gunakan tombol "DAFTAR BARU" di atas untuk mendaftar.
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ height: "18px" }} />
                <button
                  onClick={() => onSelect({ id: "WALK-IN", name: "Walk-in Customer", phone: "—", email: "—", level: "BRONZE", points: 0, purchases: 0 })}
                  style={{ background: "#444444", color: "#ffffff", border: "2px solid #000000", padding: "5px 12px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px", whiteSpace: "nowrap", height: "32px" }}
                >
                  👤 WALK-IN
                </button>
              </div>
            </div>

            {showNew && (
              <div style={{ border: "2px solid #228800", background: "#f0fff0", padding: "8px" }}>
                <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px", marginBottom: "6px", color: "#005500" }}>
                  ★ DAFTARKAN CUSTOMER BARU
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
                  {[
                    { label: "NAMA LENGKAP", val: newName, setter: setNewName, placeholder: "Nama customer", width: "160px" },
                    { label: "NO. TELEPON", val: newPhone, setter: setNewPhone, placeholder: "08XX-XXXX-XXXX", width: "140px" },
                    { label: "EMAIL", val: newEmail, setter: setNewEmail, placeholder: "email@domain.com", width: "160px" },
                  ].map((f) => (
                    <div key={f.label}>
                      <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>{f.label}</div>
                      <input value={f.val} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
                        style={{ width: f.width, border: "1px solid #000000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" as const }} />
                    </div>
                  ))}
                  <button onClick={handleRegisterNew}
                    style={{ background: "#228800", color: "#ffffff", border: "2px solid #000000", padding: "4px 14px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px", height: "28px", whiteSpace: "nowrap" }}>
                    + DAFTAR & PILIH
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface TransactionsProps {
  onCheckoutSuccess?: () => void;
}

// ─── Main Transactions Component ──────────────────────────────────────────────
export function Transactions({ onCheckoutSuccess }: TransactionsProps) {
  const [barcode, setBarcode] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [taxRate] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productsDb, setProductsDb] = useState<Product[]>([]);

  // Load products dynamically from backend GORM database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProductsDb(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    };
    loadProducts();
  }, []);

  const memberDiscount = selectedCustomer ? (levelDiscount[selectedCustomer.level] || 0) : 0;

  const filtered = search
    ? productsDb.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    : [];

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product_id === product.id);
      if (existing) return prev.map((c) => c.product_id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: Date.now(), product_id: product.id, sku: product.sku, name: product.name, qty: 1, price: product.sellPrice, discount: 0 }];
    });
    setSearch("");
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0));
  };

  const updateDiscount = (id: number, val: string) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, discount: Math.min(100, Math.max(0, Number(val))) } : c));
  };

  const subtotalBeforeMember = cart.reduce((sum, c) => sum + c.price * c.qty * (1 - c.discount / 100), 0);
  const memberDiscountAmt = (subtotalBeforeMember * memberDiscount) / 100;
  const subtotal = subtotalBeforeMember - memberDiscountAmt;
  const tax = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + tax;
  const pointsEarned = Math.floor(grandTotal / 10000);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Build checkout body matching GORM JSON endpoint requirements
    const body = {
      customer_id: selectedCustomer && selectedCustomer.id !== "WALK-IN" ? Number(selectedCustomer.id) : null,
      payment_method: "CASH",
      items: cart.map((c) => ({
        product_id: c.product_id,
        qty: c.qty,
      })),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/sales/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const resData = await response.json();

      if (!response.ok) {
        alert("⚠ Gagal checkout: " + (resData.message || "Kesalahan tidak diketahui"));
        return;
      }

      const custName = selectedCustomer?.name || "Walk-in Customer";
      alert(
        `✔ TRANSAKSI BERHASIL!\n\n` +
        `Invoice: ${resData.data.invoice_number || resData.data.transaction_code}\n` +
        `Customer: ${custName}\n` +
        (memberDiscount > 0 ? `Diskon Member (${memberDiscount}%): −${fmt(memberDiscountAmt)}\n` : "") +
        `Grand Total: ${fmt(resData.data.grand_total)}\n` +
        (selectedCustomer && selectedCustomer.id !== "WALK-IN" ? `Poin Diperoleh: +${pointsEarned} pts\n` : "") +
        `\nTerima kasih atas pembelian Anda!`
      );
      setCart([]);
      setSelectedCustomer(null);
      onCheckoutSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Tidak dapat terhubung ke server untuk checkout.");
    }
  };

  return (
    <div>
      <div style={{ background: "#e6915d", color: "#000000", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", padding: "6px 12px", letterSpacing: "2px", borderBottom: "2px solid #000000" }}>
        ◈ NEW TRANSACTION — POINT OF SALE
      </div>

      <div style={{ padding: "12px" }}>
        <CustomerPanel selected={selectedCustomer} onSelect={setSelectedCustomer} onClear={() => setSelectedCustomer(null)} />

        {/* ── Barcode + Product Search ── */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1, border: "2px solid #000", padding: "8px" }}>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", marginBottom: "4px", letterSpacing: "1px" }}>BARCODE SCANNER INPUT</div>
            <div style={{ display: "flex", gap: "4px" }}>
              <input value={barcode} onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { const found = productsDb.find((p) => p.sku === barcode); if (found) { addToCart(found); setBarcode(""); } else alert("Produk tidak ditemukan: " + barcode); }}}
                placeholder="Scan barcode atau ketik SKU, tekan ENTER"
                style={{ flex: 1, border: "1px solid #000000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "12px", background: "#fffff0", outline: "none" }} />
              <button onClick={() => { const found = productsDb.find((p) => p.sku === barcode); if (found) { addToCart(found); setBarcode(""); } }}
                style={{ background: "#000000", color: "#ffffff", border: "none", padding: "4px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}>
                SCAN
              </button>
            </div>
          </div>

          <div style={{ flex: 1, border: "2px solid #000", padding: "8px", position: "relative" }}>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", marginBottom: "4px", letterSpacing: "1px" }}>CARI PRODUK</div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik nama produk atau SKU..."
              style={{ width: "100%", border: "1px solid #000000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }} />
            {filtered.length > 0 && (
              <div style={{ position: "absolute", left: "8px", right: "8px", background: "#ffffff", border: "2px solid #000000", zIndex: 10 }}>
                {filtered.map((p) => (
                  <div key={p.sku} onClick={() => addToCart(p)}
                    style={{ padding: "5px 8px", borderBottom: "1px solid #cccccc", cursor: "pointer", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", display: "flex", justifyContent: "space-between" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffcc")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffffff")}>
                    <span><strong>{p.sku}</strong> — {p.name}</span>
                    <span style={{ color: "#e91d2a", fontWeight: "bold" }}>{fmt(p.sellPrice)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Cart Table ── */}
        <div style={{ border: "2px solid #000000", marginBottom: "10px" }}>
          <div style={{ background: "#000000", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            DAFTAR PRODUK — KERANJANG BELANJA
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "SKU", "NAMA PRODUK", "QTY", "HARGA SATUAN", "DISC %", "SUBTOTAL", "DEL"].map((h) => (
                  <th key={h} style={{ border: "1px solid #000000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", background: "#444444", color: "#ffffff", letterSpacing: "0.5px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "16px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#666666", fontStyle: "italic", border: "1px solid #cccccc" }}>
                    Keranjang kosong. Scan barcode atau cari produk di atas.
                  </td>
                </tr>
              )}
              {cart.map((item, i) => {
                const lineTotal = item.price * item.qty * (1 - item.discount / 100);
                return (
                  <tr key={item.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8f8f8" }}>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{item.sku}</td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{item.name}</td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: "center" }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ background: "#e91d2a", color: "#fff", border: "1px solid #000", width: "18px", height: "18px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", padding: 0, lineHeight: "1" }}>−</button>
                        <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", minWidth: "24px", textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ background: "#228800", color: "#fff", border: "1px solid #000", width: "18px", height: "18px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", padding: 0, lineHeight: "1" }}>+</button>
                      </div>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right" }}>{fmt(item.price)}</td>
                    <td style={{ border: "1px solid #000", padding: "3px 4px" }}>
                      <input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateDiscount(item.id, e.target.value)}
                        style={{ width: "40px", border: "1px solid #999", padding: "2px 4px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", textAlign: "center", outline: "none" }} />
                    </td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "right", color: "#005500" }}>{fmt(lineTotal)}</td>
                    <td style={{ border: "1px solid #000", padding: "3px 6px", textAlign: "center" }}>
                      <button onClick={() => setCart((p) => p.filter((c) => c.id !== item.id))} style={{ background: "#cc0000", color: "#fff", border: "1px solid #000", padding: "1px 5px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" }}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Totals + Actions ── */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1, border: "2px solid #000000" }}>
            <div style={{ background: "#000000", color: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
              RINGKASAN PESANAN
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px" }}>Subtotal:</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "13px", textAlign: "right" }}>{fmt(subtotalBeforeMember)}</td>
                </tr>
                {memberDiscount > 0 && (
                  <tr style={{ background: "#fffde7" }}>
                    <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px" }}>
                      Diskon Member{" "}
                      <span style={{ background: levelColors[selectedCustomer!.level], border: "1px solid #000", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "1px 4px" }}>
                        {selectedCustomer!.level} {memberDiscount}%
                      </span>:
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "13px", textAlign: "right", color: "#e91d2a", fontWeight: "bold" }}>
                      −{fmt(memberDiscountAmt)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px" }}>PPN ({taxRate}%):</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "13px", textAlign: "right" }}>{fmt(tax)}</td>
                </tr>
                <tr style={{ background: "#ffffcc" }}>
                  <td style={{ border: "2px solid #000", padding: "6px 10px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900" }}>GRAND TOTAL:</td>
                  <td style={{ border: "2px solid #000", padding: "6px 10px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "16px", fontWeight: "900", textAlign: "right", color: "#e91d2a" }}>{fmt(grandTotal)}</td>
                </tr>
                {selectedCustomer && selectedCustomer.id !== "WALK-IN" && cart.length > 0 && (
                  <tr style={{ background: "#f0fff0" }}>
                    <td style={{ border: "1px solid #ccc", padding: "4px 10px", fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#005500" }}>Poin yang diperoleh:</td>
                    <td style={{ border: "1px solid #ccc", padding: "4px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", textAlign: "right", color: "#005500" }}>+{pointsEarned} pts</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ width: "160px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={handleCheckout} disabled={cart.length === 0}
              style={{ background: cart.length === 0 ? "#999999" : "#000000", color: "#ffffff", border: "2px solid #000000", padding: "12px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "14px", fontWeight: "bold", cursor: cart.length === 0 ? "not-allowed" : "pointer", letterSpacing: "1px", flex: 1 }}>
              ✔ CHECKOUT
            </button>
            <button onClick={() => { setCart([]); setSelectedCustomer(null); }}
              style={{ background: "#e91d2a", color: "#ffffff", border: "2px solid #000000", padding: "8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}>
              ✕ BATAL / RESET
            </button>
            <button style={{ background: "#8c9ae0", color: "#000000", border: "2px solid #000000", padding: "8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}>
              🖨 CETAK STRUK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}