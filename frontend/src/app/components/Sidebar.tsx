type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";
type ModalType = "find" | "support" | "help" | "about" | "store" | "upgrade";

interface SidebarProps {
  active: Section;
  onSelect: (s: Section) => void;
  onModal: (m: ModalType) => void;
  onCloseMobile?: () => void;
}

const menuItems: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▣" },
  { id: "sales",     label: "Sales",     icon: "💲" },
  { id: "products",  label: "Products",  icon: "📦" },
  { id: "inventory", label: "Inventory", icon: "🗄" },
  { id: "customers", label: "Customers", icon: "👤" },
  { id: "reports",   label: "Reports",   icon: "📊" },
  { id: "employees", label: "Employees", icon: "👷" },
  { id: "settings",  label: "Settings",  icon: "⚙" },
];

export function Sidebar({ active, onSelect, onModal, onCloseMobile }: SidebarProps) {
  return (
    <div style={{ background: "#ffffff", height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Mobile-only close strip */}
      <div
        className="sidebar-mobile-close"
        style={{ display: "none", background: "#e91d2a", padding: "6px 10px", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #000", flexShrink: 0 }}
      >
        <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>DELL POS</span>
        <button
          onClick={onCloseMobile}
          style={{ background: "#000", color: "#fff", border: "2px solid #fff", width: 28, height: 28, cursor: "pointer", fontWeight: "bold", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
        >✕</button>
      </div>

      {/* Header */}
      <div style={{ background: "#000", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 11, fontWeight: 900, padding: "5px 8px", letterSpacing: "1px", textAlign: "center", borderBottom: "1px solid #333", flexShrink: 0 }}>
        ◀ NAVIGATION ▶
      </div>

      {/* Dell logo */}
      <div
        onClick={() => onSelect("dashboard")}
        style={{ background: "#e91d2a", padding: "8px", textAlign: "center", borderBottom: "2px solid #000", cursor: "pointer", flexShrink: 0 }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "brightness(1.1)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "brightness(1)")}
      >
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>DELL</div>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 8, color: "#ffcccc", fontWeight: "bold", letterSpacing: "1px" }}>POS ENTERPRISE v1.0</div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {menuItems.map((item) => {
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px",
                background: isActive ? "#000" : "#fff",
                color: isActive ? "#fcc20f" : "#000",
                borderBottom: "1px solid #000",
                cursor: "pointer",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 13,
                fontWeight: isActive ? "bold" : "normal",
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#ffffcc"; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <span style={{ marginLeft: "auto", color: "#fcc20f" }}>▶</span>}
            </div>
          );
        })}

        {/* Quick links */}
        <div style={{ margin: "0 6px 6px", border: "1px solid #000", padding: "6px", background: "#f0f0f0" }}>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, fontWeight: "bold", color: "#000", marginBottom: 3 }}>QUICK LINKS</div>
          {[
            { label: "❓ Help / Bantuan", action: () => onModal("help") },
            { label: "📞 Tech Support",   action: () => onModal("support") },
            { label: "ℹ About POS",      action: () => onModal("about") },
            { label: "🔍 Find / Search", action: () => onModal("find") },
          ].map(({ label, action }) => (
            <div key={label} onClick={action}
              style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 11, color: "#0000ee", textDecoration: "underline", cursor: "pointer", marginTop: 3 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#e91d2a")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#0000ee")}
            >{label}</div>
          ))}
        </div>

        {/* Status — hidden on tablet via CSS class */}
        <div className="sidebar-status" style={{ margin: "0 6px 8px", border: "1px solid #228800", padding: 5, background: "#f0fff0" }}>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 9, fontWeight: "bold", color: "#005500" }}>SYSTEM STATUS</div>
          <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 10, color: "#005500", marginTop: 2 }}>● ONLINE</div>
          <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 10, color: "#333", marginTop: 1 }}>Last sync: 11 Jun 1996</div>
        </div>
      </div>
    </div>
  );
}
