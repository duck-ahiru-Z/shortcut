export type CertificateData = {
  score: number;
  rate: number;
  certNo: string;
  dateStr: string;
  gradeTitle: string;
  lastName: string;
  firstName: string;
  gradeId?: string;
};

export const CertificateApp = {
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  },

  async generate(canvas: HTMLCanvasElement, data: CertificateData) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 3倍高画質スケーリング (3600 x 2544)
    const scale = 3;
    const w = 1200;
    const h = 848;
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.scale(scale, scale);

    const isPractical = !!data.gradeId?.includes('practical');
    const isGold = !!data.gradeId?.includes('1kyu');
    const isSilver = !!data.gradeId?.includes('2kyu') || !!data.gradeId?.includes('3kyu');
    
    let bgColors = ['#faf6eb', '#ebdcb9'];
    let outerBorder = '#c5a880';
    let innerBorder = '#a67c4e';
    let gradLineColor = '166,124,78';
    let gradeTitleColor = '#b45309';

    if (isGold) {
      bgColors = ['#fffdf7', '#e8d5b5'];
      outerBorder = '#d4af37';
      innerBorder = '#b8860b';
      gradLineColor = '212,175,55';
      gradeTitleColor = '#9a7b2c';
    } else if (isSilver) {
      bgColors = ['#f8f9fa', '#e2e8f0'];
      outerBorder = '#94a3b8';
      innerBorder = '#64748b';
      gradLineColor = '100,116,139';
      gradeTitleColor = '#475569';
    }

    // 1. 背景グラデーション
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 750);
    bgGrad.addColorStop(0, bgColors[0]);
    bgGrad.addColorStop(1, bgColors[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. 飾り枠
    ctx.strokeStyle = outerBorder;
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = innerBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // コーナー飾り
    ctx.save();
    ctx.fillStyle = innerBorder;
    this.drawCornerPiece(ctx, 42, 42, 0);
    this.drawCornerPiece(ctx, w - 42, 42, Math.PI / 2);
    this.drawCornerPiece(ctx, w - 42, h - 42, Math.PI);
    this.drawCornerPiece(ctx, 42, h - 42, -Math.PI / 2);
    ctx.restore();

    // 3. タイトル
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 54px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('合 格 証 書', 600, 160);

    // ライン
    const gradLine = ctx.createLinearGradient(400, 0, 800, 0);
    gradLine.addColorStop(0, `rgba(${gradLineColor},0)`);
    gradLine.addColorStop(0.5, `rgba(${gradLineColor},1)`);
    gradLine.addColorStop(1, `rgba(${gradLineColor},0)`);
    ctx.strokeStyle = gradLine;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 185);
    ctx.lineTo(850, 185);
    ctx.stroke();

    // 4. 級タイトル
    ctx.font = 'bold 28px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.fillStyle = gradeTitleColor;
    ctx.fillText(data.gradeTitle, 600, 235);

    // 5. 受験者氏名
    const fullName = (data.lastName || data.firstName) ? `${data.lastName}  ${data.firstName}`.trim() : "受験者";
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "MS Gothic", "Hiragino Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${fullName}  殿`, 200, 340);

    // 6. 本文
    ctx.fillStyle = '#1e293b';
    ctx.font = '24px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.fillText('あなたは当事務局が実施する上記の試験において', 200, 420);
    ctx.fillText('頭書の通り優秀な成績を収め合格されたことをここに証明いたします。', 200, 470);
    
    ctx.font = '18px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`(得点: ${data.score}問正解 / 正答率: ${data.rate}%)`, 200, 520);

    // 7. 日付と証書番号
    ctx.fillStyle = '#1e293b';
    ctx.font = '20px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.fillText(`授与日： ${data.dateStr}`, 200, 600);
    ctx.fillText(`証書番号： ${data.certNo}`, 200, 640);

    // 8. 署名 (代表 岩倉 隼人)
    ctx.textAlign = 'right';
    ctx.font = 'bold 24px "MS Mincho", "Hiragino Mincho ProN", serif';
    ctx.fillText('ショートカットキー検定 運営事務局', 1000, 640);


    if (isPractical) {
      ctx.save();
      // Draw a subtle watermark ribbon/badge for practical exam
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 8);
      ctx.font = 'bold 70px "Arial Black", sans-serif';
      ctx.fillStyle = isGold ? 'rgba(212,175,55,0.06)' : isSilver ? 'rgba(100,116,139,0.05)' : 'rgba(166,124,78,0.06)';
      ctx.textAlign = 'center';
      ctx.fillText('PRACTICAL SKILL CERTIFIED', 0, 0);
      
      // Also add a small ribbon badge on the bottom left
      ctx.restore();
      ctx.save();
      ctx.fillStyle = isGold ? '#d4af37' : isSilver ? '#94a3b8' : '#a67c4e';
      ctx.beginPath();
      ctx.moveTo(80, h - 180);
      ctx.lineTo(160, h - 180);
      ctx.lineTo(160, h - 60);
      ctx.lineTo(120, h - 90);
      ctx.lineTo(80, h - 60);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('実務技能', 120, h - 150);
      ctx.fillText('認定', 120, h - 125);
      
      ctx.restore();
    }

    // 認定印SVGの描画 (失敗時は従来のCanvas朱肉印を描画)
    try {
      const sealImg = await this.loadImage('/assets/stamp-v4-vector-S5.svg');
      ctx.drawImage(sealImg, 970, 615, 80, 80);
    } catch (err) {
      console.warn('認定印SVGのロードに失敗したため、従来の朱肉印を描画します:', err);
      this.drawSeal(ctx, 1040, 655);
    }
  },

  drawCornerPiece(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(40, 6);
    ctx.lineTo(6, 6);
    ctx.lineTo(6, 40);
    ctx.lineTo(0, 40);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(15, 15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawSeal(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.9)';
    ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.rect(x - 30, y - 30, 60, 60);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x - 26, y - 26, 52, 52);
    ctx.stroke();

    ctx.font = 'bold 12px "MS Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('検定', x + 12, y - 12);
    ctx.fillText('運営', x - 12, y - 12);
    ctx.fillText('局印', x + 12, y + 12);
    ctx.fillText('事務', x - 12, y + 12);

    ctx.restore();
  }
};
