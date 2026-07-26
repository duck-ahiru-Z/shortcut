export default function ExplorerMock() {
  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "var(--bg-primary)" }}>
      <div style={{ backgroundColor: "var(--bg-secondary)", display: "flex", padding: "8px 12px", gap: "8px", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f3d32a">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
        </svg>
        <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>PC &gt; ドキュメント</span>
      </div>
      <div style={{ display: "flex", height: "180px" }}>
        <div style={{ width: "120px", borderRight: "1px solid var(--border-color)", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "var(--bg-secondary)" }}>
          <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px" }}></div>
          <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px", width: "80%" }}></div>
          <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px", width: "90%" }}></div>
        </div>
        <div style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontWeight: "bold" }}>
          指示されたキーを入力...
        </div>
      </div>
    </div>
  );
}
