import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "作品集",
  description: "浏览何文的品牌设计、电商视觉、商业海报与 AIGC 视觉作品。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "何文｜平面与视觉设计作品集",
    description: "浏览品牌设计、电商视觉、商业海报与 AIGC 视觉作品。",
    url: "/"
  }
};

export default function HomePage() {
  return <LandingPage />;
}
