export default function WordMock() {
  return (
    <div style={{ border: "1px solid #185abd", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "#f3f2f1" }}>
      <div style={{ backgroundColor: "#185abd", color: "white", padding: "8px 12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M4 4h16v16H4z"></path>
        </svg>
        文書
      </div>
      <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "85%", height: "180px", backgroundColor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "20px", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", borderRadius: "2px" }}>
           指示されたキーを入力...
        </div>
      </div>
    </div>
  );
}
