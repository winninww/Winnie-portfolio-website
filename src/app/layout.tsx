import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hewen.mom"),
  title: {
    default: "何文｜平面与视觉设计作品集",
    template: "%s｜何文作品集"
  },
  description: "何文的平面与视觉设计作品集，涵盖品牌设计、电商视觉、商业海报与 AIGC 视觉探索。",
  keywords: ["何文", "平面设计师", "视觉设计师", "品牌设计", "电商视觉", "商业海报", "作品集"],
  authors: [{ name: "何文" }],
  creator: "何文",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.hewen.mom",
    siteName: "何文作品集",
    title: "何文｜平面与视觉设计作品集",
    description: "品牌设计、电商视觉、商业海报与 AIGC 视觉作品。"
  },
  twitter: {
    card: "summary_large_image",
    title: "何文｜平面与视觉设计作品集",
    description: "品牌设计、电商视觉、商业海报与 AIGC 视觉作品。"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
