"use client";

import { useState } from "react";
import { loginAdmin } from "@/actions/admin";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const success = await loginAdmin(password);
      if (success) {
        window.location.reload(); // Reload to hit server component again
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "24px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "16px", textAlign: "center" }}>HQ Portal Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: "14px", marginBottom: "16px" }}>Incorrect password.</p>}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
