import { useEffect } from "react";

interface RetroModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  headerBg?: string;
  headerColor?: string;
}

export function RetroModal({
  title,
  onClose,
  children,
  width = "540px",
  headerBg = "#000000",
  headerColor = "#ffffff",
}: RetroModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width,
          maxWidth: "100%",
          border: "4px solid #000000",
          background: "#ffffff",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: headerBg,
            color: headerColor,
            fontFamily: "Arial Black, Arial, sans-serif",
            fontSize: "13px",
            fontWeight: "900",
            padding: "6px 10px",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderBottom: "2px solid #000",
          }}
        >
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: "#e91d2a",
              color: "#ffffff",
              border: "2px solid #ffffff",
              width: "22px",
              height: "22px",
              cursor: "pointer",
              fontFamily: "Arial Black, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: "900",
              padding: 0,
              lineHeight: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Window chrome bar */}
        <div style={{ background: "#cccccc", padding: "2px 8px", borderBottom: "1px solid #999", flexShrink: 0 }}>
          <span style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "10px", color: "#555" }}>
            Dell POS Enterprise v1.0 &nbsp;—&nbsp; Press ESC or click outside to close
          </span>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
