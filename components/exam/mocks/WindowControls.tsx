import React from "react";

type Props = {
  os: "windows" | "mac";
};

export default function WindowControls({ os }: Props) {
  if (os === "mac") {
    return (
      <div style={{ display: 'flex', gap: '8px', padding: '0 12px', alignItems: 'center' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', border: '1px solid #e0443e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', border: '1px solid #dea123' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', border: '1px solid #1aab29' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0', marginLeft: 'auto', height: '100%' }}>
      <div style={{ width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M 0,5 h 10 v 1 H 0 z" />
        </svg>
      </div>
      <div style={{ width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
          <rect x="1.5" y="1.5" width="7" height="7" strokeWidth="1" />
        </svg>
      </div>
      <div style={{ width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.8 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
          <path d="M 1,1 L 9,9 M 9,1 L 1,9" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
