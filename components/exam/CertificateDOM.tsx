import React from 'react';
import { CertificateData } from '@/lib/certificate';

type Props = {
  data: CertificateData;
};

export default function CertificateDOM({ data }: Props) {
  const hasName = data.lastName || data.firstName;
  const fullName = hasName ? `${data.lastName || ''} ${data.firstName || ''}`.trim() : "受験者";

  return (
    <div className="certificate-dom-container">
      {/* 枠線と背景 */}
      <div className="cert-outer-border">
        <div className="cert-inner-border">
          {/* コーナー装飾 (簡略化したSVG) */}
          <svg className="cert-corner top-left" viewBox="0 0 40 40">
            <path d="M0 0 h40 v6 h-34 v34 h-6 z" fill="#a67c4e" />
            <circle cx="15" cy="15" r="4" fill="#a67c4e" />
          </svg>
          <svg className="cert-corner top-right" viewBox="0 0 40 40">
            <path d="M40 0 v40 h-6 v-34 h-34 v-6 z" fill="#a67c4e" />
            <circle cx="25" cy="15" r="4" fill="#a67c4e" />
          </svg>
          <svg className="cert-corner bottom-right" viewBox="0 0 40 40">
            <path d="M40 40 h-40 v-6 h34 v-34 h6 z" fill="#a67c4e" />
            <circle cx="25" cy="25" r="4" fill="#a67c4e" />
          </svg>
          <svg className="cert-corner bottom-left" viewBox="0 0 40 40">
            <path d="M0 40 v-40 h6 v34 h34 v6 z" fill="#a67c4e" />
            <circle cx="15" cy="25" r="4" fill="#a67c4e" />
          </svg>

          {/* コンテンツ */}
          <div className="cert-content">
            <h1 className="cert-title">合 格 証 書</h1>
            <div className="cert-divider"></div>
            <h2 className="cert-grade">{data.gradeTitle}</h2>
            
            <div className="cert-name-section">
              <span className="cert-name">{fullName}</span> <span className="cert-suffix">殿</span>
            </div>

            <div className="cert-body">
              <p>あなたは当事務局が実施する上記の試験において</p>
              <p>頭書の通り優秀な成績を収め合格されたことをここに証明いたします。</p>
              <p className="cert-score">(得点: {data.score}問正解 / 正答率: {data.rate}%)</p>
            </div>

            <div className="cert-footer">
              <div className="cert-meta">
                <p>授与日： {data.dateStr}</p>
                <p>証書番号： {data.certNo}</p>
              </div>
              <div className="cert-signature">
                <p className="cert-org">ショートカットキー検定 運営事務局</p>
                <p className="cert-rep">代表　岩倉 隼人</p>
                {/* 判子 */}
                <img src="/assets/stamp-v4-vector-S5.svg" className="cert-stamp" alt="認定印" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
