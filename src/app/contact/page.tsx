import type { Metadata } from "next";
import { ContactPageClient } from "@/components/ContactPageClient";

export const metadata: Metadata = {
  title: "联系我",
  description: "联系平面与视觉设计师何文，了解全职、兼职与设计合作信息。",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "联系何文｜设计合作",
    description: "联系平面与视觉设计师何文，了解工作与设计合作信息。",
    url: "/contact"
  }
};

export default function ContactPage() {
  return <ContactPageClient />;
}
