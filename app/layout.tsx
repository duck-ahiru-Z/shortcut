import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Windows ショートカットキー検定 IBT試験",
  description: "AIっぽさを排除したプレミアムでフラットなビジネス調テーマのショートカットキー検定",
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
              <div className="logo-icon">⌘</div>
              <div className="logo-text">ショートカットキー検定</div>
            </a>
          </div>
        </header>
        
        {children}
        
        <footer>
          &copy; 2026 Shortcut Key Certification. All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}
