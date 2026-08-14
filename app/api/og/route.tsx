import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Remove Edge runtime to allow fs.readFileSync and avoid 1-2MB Edge limits
// export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const grade = searchParams.get('grade') || '3kyu';
    const score = parseInt(searchParams.get('score') || '0', 10);
    const rate = parseInt(searchParams.get('rate') || '0', 10);
    const passed = searchParams.get('passed') === 'true';
    const gradeTitle = searchParams.get('gradeTitle') || 'ショートカットキー検定';

    // 悔しさを煽る、またはクスッと笑えるメッセージ
    let message = '';
    if (passed) {
      if (rate === 100) {
        message = 'ショートカットキー完全に理解した！';
      } else {
        message = 'マウスに触れる時間が減りそうです！';
      }
    } else {
      if (rate >= 70) {
        message = 'あと少しで合格だったのに...！';
      } else if (rate >= 40) {
        message = '右クリックから卒業したい...';
      } else {
        message = 'ショートカットキー完全に理解した（してない）';
      }
    }

    const isPractical = grade.includes('practical');

    // Font Loading via fs (Node.js runtime)
    let fontData: ArrayBuffer | null = null;
    try {
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Bold.otf');
      if (fs.existsSync(fontPath)) {
        // Read the file and convert Buffer to ArrayBuffer
        const buffer = fs.readFileSync(fontPath);
        fontData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      }
    } catch (e) {
      console.warn('Failed to load font from fs', e);
    }

    // Logo Loading via fs
    let logoSrc = '';
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (e) {
      console.warn('Failed to load logo from fs', e);
    }

    const bgGradient = passed
      ? 'linear-gradient(135deg, #fef08a 0%, #f59e0b 100%)' // Pop Yellow/Orange for Pass
      : 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)'; // Gray for Fail

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: bgGradient,
            fontFamily: 'Noto Sans JP, sans-serif',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Inner Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: passed ? '8px solid #f59e0b' : '8px solid #94a3b8',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Practical Badge */}
            {isPractical && (
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-80px',
                  background: '#f43f5e',
                  color: 'white',
                  padding: '40px 100px 10px 100px',
                  transform: 'rotate(45deg)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                実務技能
              </div>
            )}

            <div style={{ fontSize: '32px', color: '#64748b', marginBottom: '20px', fontWeight: 'bold', display: 'flex' }}>
              {gradeTitle}
            </div>

            <div
              style={{
                fontSize: '96px',
                fontWeight: 'bold',
                color: passed ? '#d97706' : '#475569',
                marginBottom: '20px',
                lineHeight: 1,
                display: 'flex',
              }}
            >
              {passed ? '合格！' : '不合格...'}
            </div>

            <div style={{ fontSize: '36px', color: '#334155', marginBottom: '40px', fontWeight: 'bold', display: 'flex' }}>
              {`スコア: ${score}点 / 正答率: ${rate}%`}
            </div>

            <div
              style={{
                fontSize: '28px',
                color: passed ? '#b45309' : '#1e293b',
                background: passed ? '#fef3c7' : '#f1f5f9',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontWeight: 'bold',
                display: 'flex',
              }}
            >
              {message}
            </div>

            {/* Logo and Brand */}
            {logoSrc && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <img
                  src={logoSrc}
                  width={64}
                  height={64}
                  style={{ borderRadius: '16px' }}
                  alt="Logo"
                />
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8', display: 'flex' }}>
                  ショートカットキー検定
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData
          ? [
              {
                name: 'Noto Sans JP',
                data: fontData,
                style: 'normal',
                weight: 700,
              },
            ]
          : undefined,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
