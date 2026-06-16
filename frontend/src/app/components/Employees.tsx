import { useState, useEffect } from "react";

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  role: string;
  shift: string;
  status: string;
  total_sales: number;
  total_transactions: number;
  customers_served: number;
}

const formatRupiah = (value: number): string => {
  return "Rp " + (value || 0).toLocaleString("id-ID");
};

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [topCashierMonth, setTopCashierMonth] = useState<string>("—");
  const [loading, setLoading] = useState(true);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newShift, setNewShift] = useState("Morning");
  const [submitting, setSubmitting] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopCashier = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/employee/top-cashier", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) {
          const nameParts = data.name.split(" ");
          const formattedName = nameParts[0] + " " + (nameParts[1]?.[0] || "") + ".";
          setTopCashierMonth(formattedName);
        }
      }
    } catch (err) {
      console.error("Gagal memuat top cashier:", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadTopCashier();
  }, []);

  const handleAddEmployee = async () => {
    if (!newName.trim()) { alert("Nama employee harus diisi!"); return; }
    if (!newEmpId.trim()) { alert("Employee ID harus diisi!"); return; }
    if (!newRole.trim()) { alert("Role harus diisi!"); return; }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: newEmpId,
          name: newName,
          role: newRole,
          shift: newShift,
          status: "ON DUTY",
          total_sales: 0,
          total_transactions: 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Gagal menambah employee");
        return;
      }
      alert(`✔ Employee "${newName}" berhasil ditambahkan!`);
      setNewName(""); setNewEmpId(""); setNewRole(""); setNewShift("Morning");
      loadEmployees();
      loadTopCashier();
    } catch (err) {
      console.error(err);
      alert("Tidak dapat terhubung ke backend");
    } finally {
      setSubmitting(false);
    }
  };

  const totalStaff = employees.length;
  const onDuty = employees.filter((e) => e.status === "ON DUTY").length;
  const offDuty = employees.filter((e) => e.status === "OFF DUTY").length;

  return (
    <div>
      <div style={{ background: "#8c9ae0", color: "#000000", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "14px", fontWeight: "900", padding: "6px 12px", letterSpacing: "2px", borderBottom: "2px solid #000000" }}>
        ◈ EMPLOYEE MANAGEMENT — STAFF RECORDS
      </div>

      <div style={{ padding: "12px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {[
            { label: "TOTAL STAFF", val: totalStaff, bg: "#8c9ae0" },
            { label: "ON DUTY", val: onDuty, bg: "#b3bd95" },
            { label: "OFF DUTY", val: offDuty, bg: "#a5b8c0" },
            { label: "TOP CASHIER", val: topCashierMonth, bg: "#fcc20f" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, border: "2px solid #000", background: s.bg }}>
              <div style={{ background: "#000", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "9px", fontWeight: "bold", padding: "2px 6px", letterSpacing: "0.5px" }}>
                {s.label}
              </div>
              <div style={{ padding: "5px 8px", fontFamily: "Arial Black, Arial, sans-serif", fontSize: "18px", fontWeight: "900" }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Add employee */}
        <div style={{ border: "2px solid #000", marginBottom: "12px", background: "#f0f0ff" }}>
          <div style={{ background: "#000", color: "#8c9ae0", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            ■ ADD NEW EMPLOYEE
          </div>
          <div style={{ padding: "8px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px" }}>FULL NAME</div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Employee name"
                style={{ width: "150px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px" }}>EMPLOYEE ID</div>
              <input
                value={newEmpId}
                onChange={(e) => setNewEmpId(e.target.value)}
                placeholder="EMP-XXX"
                style={{ width: "100px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px" }}>ROLE</div>
              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Cashier / Supervisor"
                style={{ width: "140px", border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", background: "#fffff0", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", marginBottom: "2px" }}>SHIFT</div>
              <select
                value={newShift}
                onChange={(e) => setNewShift(e.target.value)}
                style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", background: "#fffff0", outline: "none", height: "28px" }}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Night</option>
              </select>
            </div>
            <button
              onClick={handleAddEmployee}
              disabled={submitting}
              style={{ background: submitting ? "#666" : "#228800", color: "#fff", border: "2px solid #000", padding: "4px 14px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer", height: "28px" }}
              onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#005500"; }}
              onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#228800"; }}
            >
              {submitting ? "ADDING..." : "+ ADD EMPLOYEE"}
            </button>
          </div>
        </div>

        {/* Employee table */}
        <div style={{ border: "2px solid #000" }}>
          <div style={{ background: "#000", color: "#8c9ae0", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", letterSpacing: "1px" }}>
            EMPLOYEE ROSTER — {new Date().toLocaleString("en-US", { month: "long" }).toUpperCase()} {new Date().getFullYear()}
          </div>
          <div className="pos-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
              <thead>
                <tr>
                  {["EMP ID", "FULL NAME", "ROLE", "SHIFT", "TOTAL SALES (Rp)", "TOTAL TRANSACTIONS", "CUSTOMERS SERVED", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h} style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", background: "#444", color: "#fff", textAlign: "left", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "16px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#666", fontStyle: "italic", border: "1px solid #ccc" }}>
                      ⏳ Memuat data employee...
                    </td>
                  </tr>
                )}
                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "16px", fontFamily: "Times New Roman, Times, serif", fontSize: "13px", color: "#666", fontStyle: "italic", border: "1px solid #ccc" }}>
                      Belum ada data employee.
                    </td>
                  </tr>
                )}
                {!loading && employees.map((e, i) => (
                  <tr key={e.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }}
                    onMouseEnter={(el) => ((el.currentTarget as HTMLTableRowElement).style.background = "#ffffcc")}
                    onMouseLeave={(el) => ((el.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "#ffffff" : "#f5f5f5")}>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Courier New, monospace", fontSize: "11px" }}>{e.employee_id}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", fontWeight: "bold" }}>{e.name}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px" }}>{e.role}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                      <span style={{ background: e.shift === "Morning" ? "#fcc20f" : e.shift === "Afternoon" ? "#e6915d" : "#8c9ae0", border: "1px solid #000", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "1px 4px" }}>
                        {e.shift}
                      </span>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Times New Roman, Times, serif", fontSize: "12px", textAlign: "right", fontWeight: "bold" }}>{formatRupiah(e.total_sales)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", textAlign: "center" }}>{e.total_transactions > 0 ? e.total_transactions : "—"}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", textAlign: "center" }}>{e.customers_served > 0 ? e.customers_served : "—"}</td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                      <span style={{ background: e.status === "ON DUTY" ? "#228800" : "#999999", color: "#fff", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "10px", fontWeight: "bold", padding: "1px 5px" }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "4px 6px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        <button style={{ background: "#0000aa", color: "#fff", border: "1px solid #000", padding: "2px 5px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                          onMouseEnter={(el) => ((el.currentTarget as HTMLButtonElement).style.background = "#0000ff")}
                          onMouseLeave={(el) => ((el.currentTarget as HTMLButtonElement).style.background = "#0000aa")}>
                          EDIT
                        </button>
                        <button style={{ background: "#cc0000", color: "#fff", border: "1px solid #000", padding: "2px 5px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                          onMouseEnter={(el) => ((el.currentTarget as HTMLButtonElement).style.background = "#ff0000")}
                          onMouseLeave={(el) => ((el.currentTarget as HTMLButtonElement).style.background = "#cc0000")}>
                          DEL
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