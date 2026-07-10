import type { Metadata } from "next";
import { AboutPageClient } from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解平面与视觉设计师何文的设计方向、工作经验与专业能力。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "关于何文｜平面与视觉设计师",
    description: "了解何文的设计方向、工作经验与专业能力。",
    url: "/about"
  }
};

export default function AboutPage() {
  return <AboutPageClient />;
}
