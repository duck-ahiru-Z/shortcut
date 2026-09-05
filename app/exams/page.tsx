"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import GradeCard from "../../components/exam/GradeCard";
import { GRADE_CONFIGS } from "../../config/grades";
import { useState } from "react";

export default function Exams() {
  const router = useRouter();
  
  // モーダル管理用の状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isPractical, setIsPractical] = useState(false);

  const openModal = (grade: string, practical: boolean) => {
    setSelectedGrade(grade);
    setIsPractical(practical);
    setIsModalOpen(true);
  };

  const handleOsSelect = (os: string) => {
    setIsModalOpen(false);
    const osPrefix = os === "windows" ? "" : "mac-";
    const practicalPrefix = isPractical ? "practical-" : "";
    const finalGrade = `${practicalPrefix}${osPrefix}${selectedGrade}`;
    router.push(`/exam?grade=${finalGrade}`);
  };

  return (
    <main style={{ paddingBottom: "60px" }}>
      {/* ヒーローエリア */}
      <div className="hero-card" style={{ marginBottom: "40px" }}>
        <h1 className="hero-title">受験可能な試験一覧</h1>
        <p className="hero-desc">
          現在のスキルレベルに合わせて、ご希望の試験をお選びください。<br/>
          初めての方は5級からの受験をおすすめします。
        </p>
      </div>

      {/* OS選択モーダル */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '16px', padding: '32px',
            maxWidth: '480px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >×</button>
            <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '22px' }}>受験環境の選択</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
              普段お使いのPCのOSを選択してください。<br/>試験問題やシミュレータのUIが切り替わります。
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => handleOsSelect("windows")}
                style={{
                  flex: 1, padding: '24px 16px', borderRadius: '12px',
                  border: '2px solid var(--border-color)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s',
                  color: 'var(--text-color)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00a4ef'; e.currentTarget.style.background = 'rgba(0, 164, 239, 0.05)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ marginBottom: '8px', color: '#00a4ef' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.801"/>
                  </svg>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Windows</div>
              </button>
              
              <button 
                onClick={() => handleOsSelect("mac")}
                style={{
                  flex: 1, padding: '24px 16px', borderRadius: '12px',
                  border: '2px solid var(--border-color)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s',
                  color: 'var(--text-color)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text-color)'; e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ marginBottom: '8px', color: 'var(--text-color)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Mac</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 級別セクション */}
      <div>
        <div className="grade-grid">
          {GRADE_CONFIGS.map((config) => (
            <GradeCard
              key={config.id}
              config={config}
              onOpenModal={openModal}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
