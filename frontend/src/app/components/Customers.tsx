import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  purchases: number;
  points: number;
  since: string;
}

const levelColors: Record<string, string> = {
  PLATINUM: "#8c9ae0",
  GOLD: "#fcc20f",
  SILVER: "#a5b8c0",
  BRONZE: "#e6915d",
};

const fmt = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");

// ─── VIEW MODAL ───────────────────────────────────────────────────────────────
function ViewModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "480px", border: "4px solid #000", background: "#fff", boxShadow: "8px 8px 0 #000" }}>
        {/* Header */}
        <div style={{ background: "#0000aa", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", fontWeight: "900", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>◈ CUSTOMER DETAIL — {customer.id}</span>
          <button onClick={onClose} style={{ background: "#cc0000", color: "#fff", border: "2px solid #fff", padding: "1px 8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>✕</button>
        </div>
        {/* Level bar */}
        <div style={{ background: levelColors[customer.level], borderBottom: "2px solid #000", padding: "4px 10px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>★ MEMBERSHIP: {customer.level}</span>
        </div>
        {/* Info grid */}
        <div style={{ padding: "12px" }}>
          {[
            { label: "ID PELANGGAN", val: customer.id },
            { label: "NAMA LENGKAP", val: customer.name },
            { label: "NO. TELEPON", val: customer.phone },
            { label: "EMAIL", val: customer.email },
            { label: "TOTAL PEMBELIAN", val: fmt(customer.purchases) },
            { label: "POIN LOYALITAS", val: (customer.points || 0).toLocaleString() + " pts" },
            { label: "MEMBER SEJAK", val: customer.since },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", borderBottom: "1px solid #ccc", padding: "5px 0" }}>
              <div style={{ width: "150px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", color: "#555", letterSpacing: "0.5px", flexShrink: 0 }}>{row.label}</div>
              <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#000" }}>{row.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#f0f0f0", borderTop: "2px solid #000", padding: "6px 10px", textAlign: "right" }}>
          <button onClick={onClose} style={{ background: "#000", color: "#fff", border: "2px solid #000", padding: "4px 16px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>TUTUP</button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
function EditModal({ customer, onClose, onSaved }: { customer: Customer; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);
  const [level, setLevel] = useState<Customer["level"]>(customer.level);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  if (!name.trim()) {
    alert("Nama harus diisi!");
    return;
  }

  const token = localStorage.getItem("token");

  setLoading(true);

  try {
    const res = await fetch(
      `http://localhost:8080/api/customer/${customer.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          membership: level,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Gagal menyimpan");
      setLoading(false);
      return;
    }

    alert("✔ Data customer berhasil diperbarui!");
    onSaved();
    onClose();
  } catch (err) {
    console.error(err);
    alert("Tidak dapat terhubung ke backend");
  }

  setLoading(false);
};

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "480px", border: "4px solid #000", background: "#fff", boxShadow: "8px 8px 0 #000" }}>
        {/* Header */}
        <div style={{ background: "#444444", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", fontWeight: "900", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>✎ EDIT CUSTOMER — {customer.id}</span>
          <button onClick={onClose} style={{ background: "#cc0000", color: "#fff", border: "2px solid #fff", padding: "1px 8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>✕</button>
        </div>
        {/* Form */}
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "NAMA LENGKAP", val: name, setter: setName, placeholder: "Nama customer" },
            { label: "NO. TELEPON", val: phone, setter: setPhone, placeholder: "08XX-XXXX-XXXX" },
            { label: "EMAIL", val: email, setter: setEmail, placeholder: "email@example.com" },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "3px", letterSpacing: "0.5px" }}>{f.label}</div>
              <input value={f.val} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
                style={{ width: "100%", border: "2px solid #000", padding: "5px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", background: "#fffff0", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "3px", letterSpacing: "0.5px" }}>MEMBERSHIP</div>
            <select value={level} onChange={(e) => setLevel(e.target.value as Customer["level"])}
              style={{ width: "100%", border: "2px solid #000", padding: "5px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", background: levelColors[level], outline: "none", height: "32px", fontWeight: "bold" }}>
              <option value="BRONZE">BRONZE</option>
              <option value="SILVER">SILVER</option>
              <option value="GOLD">GOLD</option>
              <option value="PLATINUM">PLATINUM</option>
            </select>
          </div>
        </div>
        {/* Footer */}
        <div style={{ background: "#f0f0f0", borderTop: "2px solid #000", padding: "8px 10px", display: "flex", justifyContent: "flex-end", gap: "6px" }}>
          <button onClick={onClose} style={{ background: "#cccccc", color: "#000", border: "2px solid #000", padding: "4px 14px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>BATAL</button>
          <button onClick={handleSave} disabled={loading}
            style={{ background: loading ? "#666" : "#228800", color: "#fff", border: "2px solid #000", padding: "4px 14px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "MENYIMPAN..." : "✔ SIMPAN"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLevel, setNewLevel] = useState<Customer["level"]>("BRONZE");

  const loadCustomers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/customer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setCustomers(
      Array.isArray(data)
        ? data
        : data.data ?? data.customers ?? []
    );
  } catch (err) {
    console.error(err);
    setCustomers([]);
  }
};

  useEffect(() => { loadCustomers(); }, []);

  const handleRegister = async () => {
  if (!newName.trim()) {
    alert("Nama customer harus diisi!");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:8080/api/customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          phone: newPhone,
          email: newEmail,
          membership: newLevel,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Gagal menambah customer");
      return;
    }

    alert("Customer berhasil ditambahkan");
    loadCustomers();
  } catch (err) {
    console.error(err);
  }
};

  const filtered = customers.filter(
    (c) =>
      (filter === "ALL" || c.level === filter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Modals */}
      {viewCustomer && <ViewModal customer={viewCustomer} onClose={() => setViewCustomer(null)} />}
      {editCustomer && <EditModal customer={editCustomer} onClose={() => setEditCustomer(null)} onSaved={loadCustomers} />}

      <div style={{ background: "#c0d4a7", color: "#000000", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", padding: "6px 12px", letterSpacing: "2px", borderBottom: "2px solid #000000" }}>
        ◈ CUSTOMER DATABASE — MEMBERSHIP RECORDS
      </div>

      <div style={{ padding: "12px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
          {[
            { label: "PLATINUM", count: customers.filter((c) => c.level === "PLATINUM").length, bg: "#8c9ae0" },
            { label: "GOLD", count: customers.filter((c) => c.level === "GOLD").length, bg: "#fcc20f" },
            { label: "SILVER", count: customers.filter((c) => c.level === "SILVER").length, bg: "#a5b8c0" },
            { label: "BRONZE", count: customers.filter((c) => c.level === "BRONZE").length, bg: "#e6915d" },
            { label: "TOTAL MEMBERS", count: customers.length, bg: "#c0d4a7" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, border: "2px solid #000", background: s.bg }}>
              <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", padding: "2px 6px", letterSpacing: "0.5px" }}>{s.label}</div>
              <div style={{ padding: "5px 8px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "20px", fontWeight: "900", textAlign: "center" }}>{s.count}</div>
            </div>
          ))}
        </div>

        {/* Add form */}
        <div style={{ border: "2px solid #000", marginBottom: "12px", background: "#f0ffe0" }}>
          <div style={{ background: "#000000", color: "#c0d4a7", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ■ ADD NEW CUSTOMER
          </div>
          <div style={{ padding: "8px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>FULL NAME</div>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Customer full name"
                style={{ width: "160px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>PHONE NUMBER</div>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="08XX-XXXX-XXXX"
                style={{ width: "140px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>EMAIL ADDRESS</div>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@example.com"
                style={{ width: "160px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px", letterSpacing: "0.5px" }}>MEMBERSHIP</div>
              <select value={newLevel} onChange={(e) => setNewLevel(e.target.value as Customer["level"])}
                style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", background: "#fffff0", outline: "none", width: "100px", height: "28px" }}>
                <option>BRONZE</option><option>SILVER</option><option>GOLD</option><option>PLATINUM</option>
              </select>
            </div>
            <button onClick={handleRegister}
              style={{ background: "#228800", color: "#fff", border: "2px solid #000", padding: "4px 14px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px", height: "28px" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#005500")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#228800")}>
              + REGISTER
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer name, phone, or ID..."
            style={{ flex: 1, border: "2px solid #000", padding: "4px 8px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none" }} />
          <div style={{ display: "flex", gap: "2px" }}>
            {["ALL", "PLATINUM", "GOLD", "SILVER", "BRONZE"].map((lvl) => (
              <button key={lvl} onClick={() => setFilter(lvl)}
                style={{ background: filter === lvl ? "#000" : (levelColors[lvl] || "#ccc"), color: filter === lvl ? "#fff" : "#000", border: "1px solid #000", padding: "3px 8px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", cursor: "pointer", letterSpacing: "0.5px" }}>
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ border: "2px solid #000" }}>
          <div style={{ background: "#000000", color: "#c0d4a7", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            CUSTOMER RECORDS — {filtered.length} FOUND
          </div>
          <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
              <thead>
                <tr>
                  {["ID", "CUSTOMER NAME", "PHONE", "EMAIL", "MEMBERSHIP", "TOTAL PURCHASES", "LOYALTY PTS", "SINCE", "ACTIONS"].map((h) => (
                    <th key={h} style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#444", color: "#fff", textAlign: "left", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "16px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#666", fontStyle: "italic", border: "1px solid #ccc" }}>
                      {customers.length === 0 ? "Memuat data atau belum ada customer..." : "Tidak ada customer ditemukan."}
                    </td>
                  </tr>
                )}
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#ffffcc")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "#ffffff" : "#f5f5f5")}>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{c.id}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold" }}>{c.name}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{c.phone}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#0000ee", textDecoration: "underline", cursor: "pointer" }}>{c.email}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                      <span style={{ background: levelColors[c.level] || "#ccc", border: "1px solid #000", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "1px 5px", letterSpacing: "0.5px" }}>
                        {c.level}
                      </span>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right", fontWeight: "bold" }}>{fmt(c.purchases)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", textAlign: "center", color: "#005500", fontWeight: "bold" }}>{(c.points || 0).toLocaleString()}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{c.since}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        <button
                          onClick={() => setViewCustomer(c)}
                          style={{ background: "#0000aa", color: "#fff", border: "1px solid #000", padding: "2px 5px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0000ff")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0000aa")}>
                          VIEW
                        </button>
                        <button
                          onClick={() => setEditCustomer(c)}
                          style={{ background: "#444", color: "#fff", border: "1px solid #000", padding: "2px 5px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#228800")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#444")}>
                          EDIT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}