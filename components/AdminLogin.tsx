"use client";

import { useState } from "react";
import { loginAdmin } from "@/actions/admin";

import styles from "./AdminLogin.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>HQ Portal Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>Incorrect password.</p>}
        <button type="submit" disabled={loading} className={`btn btn-primary ${styles.button}`}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
