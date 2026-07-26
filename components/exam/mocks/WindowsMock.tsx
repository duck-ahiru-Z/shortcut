export default function WindowsMock() {
  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "#0078d4", position: "relative", height: "220px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
         <div style={{ backgroundColor: "var(--bg-primary)", padding: "12px 24px", borderRadius: "8px", color: "var(--text-primary)", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
           指示されたキーを入力...
         </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", backdropFilter: "blur(4px)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00a4ef">
          <rect x="2" y="2" width="9" height="9"></rect>
          <rect x="13" y="2" width="9" height="9"></rect>
          <rect x="2" y="13" width="9" height="9"></rect>
          <rect x="13" y="13" width="9" height="9"></rect>
        </svg>
        <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
        <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
      </div>
    </div>
  );
}
