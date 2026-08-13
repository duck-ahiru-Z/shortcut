import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

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
      if (rate >= 70) { // Assuming 80 is pass, close fail
        message = 'あと少しで合格だったのに...！';
      } else if (rate >= 40) {
        message = '右クリックから卒業したい...';
      } else {
        message = 'ショートカットキー完全に理解した（してない）';
      }
    }

    const isPractical = grade.includes('practical');

    // Font Loading
    // In Edge runtime, we need to read the font file using fetch.
    // However, a simpler way is to fetch it from a public URL if local fetch fails, 
    // or we can use the default sans-serif and see if it works, but it won't for Japanese.
    // So we fetch it from our own origin.
    const url = new URL(req.url);
    const origin = url.origin; // e.g. http://localhost:3000
    
    // Attempt to fetch font. If it fails, Satori will fallback, but it might show tofu.
    let fontData: ArrayBuffer | null = null;
    try {
      const fontRes = await fetch(new URL('/fonts/NotoSansJP-Bold.otf', origin));
      if (fontRes.ok) {
        fontData = await fontRes.arrayBuffer();
      }
    } catch (e) {
      console.warn('Failed to fetch font', e);
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

            <div style={{ fontSize: '32px', color: '#64748b', marginBottom: '20px', fontWeight: 'bold' }}>
              {gradeTitle}
            </div>

            <div
              style={{
                fontSize: '96px',
                fontWeight: 'bold',
                color: passed ? '#d97706' : '#475569',
                marginBottom: '20px',
                lineHeight: 1,
              }}
            >
              {passed ? '合格！' : '不合格...'}
            </div>

            <div style={{ fontSize: '36px', color: '#334155', marginBottom: '40px', fontWeight: 'bold' }}>
              スコア: {score}点 / 正答率: {rate}%
            </div>

            <div
              style={{
                fontSize: '28px',
                color: passed ? '#b45309' : '#1e293b',
                background: passed ? '#fef3c7' : '#f1f5f9',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontWeight: 'bold',
              }}
            >
              {message}
            </div>

            {/* Logo and Brand */}
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
                src={`${origin}/logo.png`}
                width="64"
                height="64"
                style={{ borderRadius: '16px' }}
                alt="Logo"
              />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8' }}>
                ショートカットキー検定
              </div>
            </div>
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
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
