type Section = "dashboard" | "sales" | "products" | "inventory" | "customers" | "reports" | "employees" | "settings";
type ModalType = "find" | "support" | "help" | "about" | "store" | "upgrade";

interface RetroFooterProps {
  onNavigate: (s: Section) => void;
  onModal: (m: ModalType) => void;
}

export function RetroFooter({ onNavigate, onModal }: RetroFooterProps) {
  const NAV_ITEMS: { label: string; icon: string; action: () => void }[] = [
    { label: "FIND", icon: "🔍", action: () => onModal("find") },
    { label: "HOME", icon: "🏠", action: () => onNavigate("dashboard") },
    { label: "STORE", icon: "🏪", action: () => onModal("store") },
    { label: "SUPPORT", icon: "📞", action: () => onModal("support") },
    { label: "HELP", icon: "❓", action: () => onModal("help") },
    { label: "ABOUT", icon: "ℹ", action: () => onModal("about") },
  ];

  return (
    <div style={{ borderTop: "2px solid #000000", background: "#ffffff" }}>
      {/* Retro icon nav with green connector line */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          position: "relative",
        }}
      >
        {/* Green connecting line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "10%",
            right: "10%",
            height: "2px",
            background: "#00aa00",
            zIndex: 0,
          }}
        />

        {NAV_ITEMS.map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", zIndex: 1 }}>
            <div
              onClick={item.action}
              style={{
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "5px 12px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "1px",
                cursor: "pointer",
                color: "#000000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                minWidth: "58px",
                textAlign: "center",
                transition: "none",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#000000";
                el.style.color = "#fcc20f";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#ffffff";
                el.style.color = "#000000";
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </div>
            {i < NAV_ITEMS.length - 1 && (
              <div style={{ width: "18px", height: "2px", background: "#00aa00", zIndex: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Links row */}
      <div
        style={{
          padding: "5px 12px",
          borderBottom: "1px solid #cccccc",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11px", color: "#333333" }}>
          Copyright © 1996 Dell Computer Corporation
        </span>
        {[
          { label: "Terms of Use", action: () => alert("Terms of Use\n\nThis software is licensed for use by authorized Dell POS customers only. Unauthorized use is prohibited.\n\n© 1996 Dell Computer Corporation") },
          { label: "Privacy Policy", action: () => alert("Privacy Policy\n\nDell Computer Corporation is committed to protecting your privacy. Customer data is stored locally and never transmitted without consent.") },
          { label: "Legal Notices", action: () => onModal("about") },
          { label: "Contact Us", action: () => onModal("support") },
          { label: "Site Map", action: () => onModal("find") },
        ].map(({ label, action }) => (
          <span
            key={label}
            onClick={action}
            style={{
              fontFamily: "Times New Roman, Times, serif",
              fontSize: "11px",
              color: "#0000ee",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Bottom note */}
      <div style={{ padding: "5px 12px", textAlign: "center", background: "#f0f0f0" }}>
        <span
          style={{
            fontFamily: "Times New Roman, Times, serif",
            fontSize: "11px",
            color: "#555555",
            fontStyle: "italic",
          }}
        >
          ◈ This system is best viewed with Netscape Navigator or Microsoft Internet Explorer, browser versions 3.0 and higher, at 800×600 resolution. ◈
        </span>
      </div>
    </div>
  );
}
