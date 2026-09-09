import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shortcutkeyexam.vercel.app"),
  title: {
    default: "ショートカットキー検定｜Windows・Mac対応の実技試験",
    template: "%s｜ショートカットキー検定",
  },
  description: "Windows・Macのショートカットキーを知識と実技で測定するオンライン検定。5級から1級まで、実務シミュレーターでスキルを確認できます。",
  keywords: ["ショートカットキー", "検定", "資格", "Windows", "Mac", "PCスキル", "実技試験"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "ショートカットキー検定",
    title: "ショートカットキー検定｜Windows・Mac対応の実技試験",
    description: "ショートカットキーの知識と実技スキルをオンラインで測定。",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "ショートカットキー検定" }],
  },
  twitter: {
    card: "summary",
    title: "ショートカットキー検定｜Windows・Mac対応",
    description: "ショートカットキーの知識と実技スキルをオンラインで測定。",
    images: ["/logo.png"],
  },
  verification: {
    google: "hbZL7FmZqb47bVAGvY4pKbsoDUPdX0J4oc3jABbfmto",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <header>
          <div className="header-container">
            <a href="/" className="logo-container">
              <img src="/logo.png" alt="Logo" width={44} height={44} className="logo-image" style={{ objectFit: 'contain' }} />
              <div className="logo-text">ショートカットキー検定</div>
            </a>
          </div>
        </header>
        
        {children}
        
        <footer>
          &copy; 2026 Shortcut Key Certification. All Rights Reserved.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
