import { useState, useEffect } from "react";
import "../styles/responsive.css";
import { Login } from "./components/Login";
import { TopBanner } from "./components/TopBanner";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Products } from "./components/Products";
import { Inventory } from "./components/Inventory";
import { Customers } from "./components/Customers";
import { Reports } from "./components/Reports";
import { Employees } from "./components/Employees";
import { Settings } from "./components/Settings";
import { RetroFooter } from "./components/RetroFooter";
import { FindModal } from "./components/FindModal";
import { SupportModal } from "./components/SupportModal";
import { HelpModal } from "./components/HelpModal";
import { AboutModal } from "./components/AboutModal";
import { StoreModal } from "./components/StoreModal";
import { UpgradeModal } from "./components/UpgradeModal";

type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";
type ModalType = "find" | "support" | "help" | "about" | "store" | "upgrade" | null;

const sectionLabels: Record<Section, string> = {
  dashboard: "DASHBOARD OVERVIEW",
  sales: "SALES TRANSACTIONS",
  products: "PRODUCT MANAGEMENT",
  inventory: "INVENTORY CONTROL",
  customers: "CUSTOMER DATABASE",
  reports: "SALES REPORTS",
  employees: "EMPLOYEE MANAGEMENT",
  settings: "SYSTEM SETTINGS",
};

const bottomNavItems: { id: Section; icon: string; label: string }[] = [
  { id: "dashboard", icon: "▣", label: "Home" },
  { id: "sales",     icon: "💲", label: "Sales" },
  { id: "products",  icon: "📦", label: "Items" },
  { id: "inventory", icon: "🗄", label: "Stock" },
  { id: "customers", icon: "👤", label: "CRM" },
  { id: "reports",   icon: "📊", label: "Reports" },
];

export default function App() {
  const [loggedIn, setLoggedIn]         = useState(false);
  const [currentUser, setCurrentUser]   = useState("");
  const [currentRole, setCurrentRole]   = useState("");
  const [section, setSection]           = useState<Section>("dashboard");
  const [modal, setModal]               = useState<ModalType>(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const openModal  = (m: ModalType) => setModal(m);
  const closeModal = () => setModal(null);

  const navigate = (s: Section) => {
    setSection(s);
    closeModal();
    setSidebarOpen(false);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleLogin = (username: string, role: string, employee_id: string, employee_name: string) => {
    setCurrentUser(employee_name || username);
    setCurrentRole(role);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    if (confirm("Logout dari sistem?\n\nSemua data transaksi yang belum disimpan akan hilang.")) {
      localStorage.removeItem("token");
      localStorage.removeItem("employee_id");
      localStorage.removeItem("employee_name");
      localStorage.removeItem("role");
      setLoggedIn(false);
      setCurrentUser("");
      setCurrentRole("");
      setSection("dashboard");
      setModal(null);
      setSidebarOpen(false);
    }
  };

  /* Restore login state from localStorage */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const empName = localStorage.getItem("employee_name");
    const role = localStorage.getItem("role");
    if (token && empName) {
      setCurrentUser(empName);
      setCurrentRole(role || "CASHIER");
      setLoggedIn(true);
    }
  }, []);

  /* Close sidebar on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Show login screen if not authenticated */
  if (!loggedIn) return <Login onLogin={handleLogin} />;

  return (
    /* page shell — grey desktop backdrop */
    <div id="pos-outer" style={{ fontFamily: "Times New Roman, Times, serif" }}>

      {/* ── Modals ── */}
      {modal === "find"    && <FindModal    onClose={closeModal} onNavigate={navigate} />}
      {modal === "support" && <SupportModal onClose={closeModal} />}
      {modal === "help"    && <HelpModal    onClose={closeModal} />}
      {modal === "about"   && <AboutModal   onClose={closeModal} />}
      {modal === "store"   && <StoreModal   onClose={closeModal} onNavigate={navigate} />}
      {modal === "upgrade" && <UpgradeModal onClose={closeModal} />}

      {/* ── Mobile sidebar backdrop ── */}
      <div
        id="pos-sidebar-backdrop"
        className={sidebarOpen ? "open" : ""}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ══════════════════════════════════════
          MAIN FRAME
      ══════════════════════════════════════ */}
      <div id="pos-frame">
        {/* MARKER-MAKE-KIT-INVOKED */}

        {/* ── RED HEADER BAR ── */}
        <div style={{ background: "#e91d2a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 10px", borderBottom: "3px solid #000", flexShrink: 0 }}>

          {/* Left: hamburger + DELL logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Hamburger — visible on tablet & mobile via CSS */}
            <button
              id="pos-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
              style={{ background: "transparent", border: "2px solid #fff", color: "#fff", width: 34, height: 34, cursor: "pointer", display: "none", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 4, padding: 4, flexShrink: 0 }}
            >
              <div style={{ width: 18, height: 2, background: "#fff" }} />
              <div style={{ width: 18, height: 2, background: "#fff" }} />
              <div style={{ width: 18, height: 2, background: "#fff" }} />
            </button>

            <div
              onClick={() => navigate("dashboard")}
              style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1, cursor: "pointer" }}
            >
              DELL
            </div>
          </div>

          {/* Centre: title — hidden on mobile via CSS class */}
          <div
            className="pos-desktop-title"
            style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "1px", textAlign: "center" }}
          >
            POINT OF SALE ENTERPRISE SYSTEM
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10, color: "#ffcccc", fontWeight: "bold" }}>
              v1.0 © 1996
            </div>
            <div
              onClick={() => openModal("upgrade")}
              style={{ background: "#fcc20f", color: "#000", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 11, fontWeight: 900, padding: "3px 8px", border: "2px solid #000", transform: "rotate(3deg)", cursor: "pointer", letterSpacing: "0.5px" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#ffee00")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#fcc20f")}
            >
              ★ NEW!
            </div>
          </div>
        </div>

        {/* ── TOP BANNER ── */}
        <TopBanner onModal={openModal} />

        {/* ── BREADCRUMB BAR ── */}
        <div style={{ background: "#f0f0f0", borderBottom: "1px solid #000", padding: "3px 10px", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", flexShrink: 0 }}>
          <span onClick={() => navigate("dashboard")} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#0000ee", textDecoration: "underline", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#e91d2a")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#0000ee")}
          >Home</span>
          <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#333" }}>»</span>
          <span onClick={() => openModal("store")} style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#0000ee", textDecoration: "underline", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#e91d2a")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#0000ee")}
          >POS System</span>
          <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12, color: "#333" }}>»</span>
          <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, fontWeight: "bold", color: "#000", whiteSpace: "nowrap" }}>
            {sectionLabels[section]}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              onClick={() => openModal("find")}
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", color: "#0000ee", textDecoration: "underline", cursor: "pointer", border: "1px solid #0000ee", padding: "1px 6px", whiteSpace: "nowrap" }}
            >
              🔍 FIND
            </span>
            <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>
              <strong>{currentUser}</strong>
              <span style={{ color: "#777" }}> [{currentRole}]</span>
              &nbsp;|&nbsp;
              <span style={{ color: "#228800", fontWeight: "bold" }}>● ONLINE</span>
              &nbsp;|&nbsp;
              <span
                onClick={handleLogout}
                style={{ color: "#cc0000", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
                title="Logout"
              >LOGOUT</span>
            </span>
          </div>
        </div>

        {/* ── BODY: SIDEBAR + CONTENT ── */}
        <div id="pos-body">

          {/* Sidebar — CSS controls width & position (overlay on mobile) */}
          <div id="pos-sidebar" className={sidebarOpen ? "open" : ""}>
            <Sidebar active={section} onSelect={navigate} onModal={openModal} onCloseMobile={() => setSidebarOpen(false)} />
          </div>

          {/* Content */}
          <div id="pos-content">
            {section === "dashboard" && <Dashboard onNavigate={navigate} key={refreshKey} />}
            {section === "sales"     && <Transactions onCheckoutSuccess={triggerRefresh} />}
            {section === "products"  && <Products />}
            {section === "inventory" && <Inventory />}
            {section === "customers" && <Customers key={refreshKey} />}
            {section === "reports"   && <Reports />}
            {section === "employees" && <Employees key={refreshKey} />}
            {section === "settings"  && <Settings />}
          </div>
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav id="pos-bottom-nav">
          {bottomNavItems.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderBottom: active ? "3px solid #fcc20f" : "3px solid transparent",
                  color: active ? "#fcc20f" : "#888",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "4px 2px",
                  gap: 1,
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, fontWeight: "bold", letterSpacing: "0.3px" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── FOOTER ── */}
        <div id="pos-footer">
          <RetroFooter onNavigate={navigate} onModal={openModal} />
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          id="pos-bottom-bar"
          style={{ background: "#000", color: "#fff", padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}
        >
          <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 11, color: "#ccc" }}>
            © 1996 Dell Computer Corporation. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {([["Help", "help"], ["Support", "support"], ["About", "about"]] as [string, ModalType][]).map(([label, m]) => (
              <span key={label} onClick={() => openModal(m)}
                style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 11, color: "#aaa", textDecoration: "underline", cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#fcc20f")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#aaa")}
              >{label}</span>
            ))}
            <span
              onClick={handleLogout}
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", color: "#e91d2a", textDecoration: "underline", cursor: "pointer", letterSpacing: "0.5px" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#fcc20f")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#e91d2a")}
            >🔒 LOGOUT</span>
            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: "bold", color: "#e91d2a", letterSpacing: "0.5px" }}>
              DELL POS ENTERPRISE — Round Rock, Texas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
