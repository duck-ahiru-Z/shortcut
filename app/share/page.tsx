import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const grade = typeof params.grade === 'string' ? params.grade : '3kyu';
  const gradeTitle = typeof params.gradeTitle === 'string' ? params.gradeTitle : 'ショートカットキー検定';
  const score = typeof params.score === 'string' ? params.score : '0';
  const rate = typeof params.rate === 'string' ? params.rate : '0';
  const passed = params.passed === 'true';

  const title = `${gradeTitle} ${passed ? '合格！' : '不合格...'}`;
  const description = `スコア: ${score}点 / 正答率: ${rate}%`;

  // Production URL needs to be absolute for OG images.
  // Using VERCEL_URL if deployed to Vercel, else localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('grade', grade);
  ogUrl.searchParams.set('gradeTitle', gradeTitle);
  ogUrl.searchParams.set('score', score);
  ogUrl.searchParams.set('rate', rate);
  ogUrl.searchParams.set('passed', passed ? 'true' : 'false');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const grade = typeof params.grade === 'string' ? params.grade : '3kyu';
  const gradeTitle = typeof params.gradeTitle === 'string' ? params.gradeTitle : 'ショートカットキー検定';
  const score = typeof params.score === 'string' ? params.score : '0';
  const rate = typeof params.rate === 'string' ? params.rate : '0';
  const passed = params.passed === 'true';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {gradeTitle} {passed ? '合格' : '不合格'}
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          スコア: {score}点 / 正答率: {rate}%
        </p>

        {/* Display the actual OG image on the page */}
        <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <img 
            src={`/api/og?grade=${grade}&gradeTitle=${encodeURIComponent(gradeTitle)}&score=${score}&rate=${rate}&passed=${passed}`} 
            alt="試験結果画像" 
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="bg-slate-100 rounded-xl p-8 mb-8">
          <p className="text-slate-700 font-medium mb-4">
            ショートカットキー検定を受験して、あなたのPC操作スピードを測定してみませんか？
          </p>
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            自分も検定に挑戦する！
          </Link>
        </div>
      </div>
    </div>
  );
}
