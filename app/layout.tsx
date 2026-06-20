import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "잿빛 왕관 · AI GM TRPG",
  description: "AI가 게임마스터를 맡는 어두운 판타지 싱글플레이 TRPG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Gowun+Batang:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
