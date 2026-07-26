export default function ExcelMock() {
  return (
    <div style={{ border: "1px solid #107c41", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "white" }}>
      <div style={{ backgroundColor: "#107c41", color: "white", padding: "8px 12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
        スプレッドシート
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", backgroundImage: "linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)", backgroundSize: "80px 30px", height: "180px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
           <div style={{ backgroundColor: "var(--bg-primary)", padding: "12px 24px", borderRadius: "8px", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
             指示されたキーを入力...
           </div>
        </div>
      </div>
    </div>
  );
}
