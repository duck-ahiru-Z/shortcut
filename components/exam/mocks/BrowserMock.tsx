export default function BrowserMock() {
  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "600px", margin: "20px auto 0", backgroundColor: "var(--bg-primary)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ backgroundColor: "var(--bg-secondary)", display: "flex", padding: "8px 12px", gap: "8px", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }}></div>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }}></div>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f" }}></div>
        <div style={{ flex: 1, backgroundColor: "var(--bg-primary)", borderRadius: "16px", padding: "4px 16px", fontSize: "12px", color: "var(--text-muted)", marginLeft: "12px", border: "1px solid var(--border-light)" }}>
          https://example.com
        </div>
      </div>
      <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontWeight: "bold" }}>
        指示されたキーを入力...
      </div>
    </div>
  );
}
