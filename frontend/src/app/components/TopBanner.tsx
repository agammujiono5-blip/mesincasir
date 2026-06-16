import { useState, useEffect } from "react";

type ModalType = "find" | "support" | "help" | "about" | "store" | "upgrade";

interface TopBannerProps {
  onModal: (m: ModalType) => void;
}

export function TopBanner({ onModal }: TopBannerProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "2-digit" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={{ background: "#000000", color: "#ffffff", padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #e91d2a", position: "relative" }}>
      {/* Left */}
      <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: "bold", letterSpacing: "0.5px", color: "#ffffff", lineHeight: "1.3" }}>
        <span style={{ color: "#fcc20f" }}>★</span>{" "}
        BUILD YOUR OWN BUSINESS. ONLINE.{" "}
        <span style={{ color: "#fcc20f" }}>★</span>
      </div>

      {/* Center — live date/time, clickable */}
      <div
        style={{ fontFamily: "Courier New, monospace", fontSize: "11px", color: "#cccccc", textAlign: "center", cursor: "default" }}
        title="System Clock"
      >
        {dateStr} &nbsp;|&nbsp; {timeStr}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          onClick={() => onModal("support")}
          style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "13px", fontWeight: "900", color: "#e91d2a", letterSpacing: "0.5px", cursor: "pointer" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#fcc20f")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#e91d2a")}
          title="Click to open support"
        >
          0800-POS-HELP
        </div>
        {/* Yellow "BUY NOW" sticker */}
        <div
          onClick={() => onModal("upgrade")}
          style={{
            background: "#fcc20f",
            color: "#000000",
            fontFamily: "Arial Black, Arial, sans-serif",
            fontSize: "10px",
            fontWeight: "900",
            padding: "3px 6px",
            border: "2px solid #000000",
            transform: "rotate(-4deg)",
            display: "inline-block",
            letterSpacing: "0.5px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#e91d2a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#fcc20f")}
        >
          BUY NOW!
        </div>
      </div>
    </div>
  );
}
