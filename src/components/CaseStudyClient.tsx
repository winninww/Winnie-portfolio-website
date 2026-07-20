"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { usePortfolioContent } from "@/data/usePortfolioContent";

type CaseStudyClientProps = {
  slug: string;
};

export function CaseStudyClient({ slug }: CaseStudyClientProps) {
  const router = useRouter();
  const { projects } = usePortfolioContent();
  const [isLoaded, setIsLoaded] = useState(false);
  const requestedSlug = decodeURIComponent(slug);
  const project = projects.find((item) => item.slug === requestedSlug);
  const legacyTitleProject = project ? undefined : projects.find((item) => item.title === requestedSlug);
  const visibleProject = project ?? legacyTitleProject;
  console.log("DETAIL PROJECT", visibleProject);

  useEffect(() => {
  if (projects.length > 0) {
    setIsLoaded(true);
  }

  if (legacyTitleProject) {
    router.replace(`/case-study/${legacyTitleProject.slug}`);
  }
}, [projects, legacyTitleProject, router]);

if (!isLoaded) {
  return null;
}

  if (!visibleProject) {
    return (
      <main className="min-h-screen bg-paper px-5 pt-28 text-ink sm:px-8 lg:px-12">
        <section className="mx-auto max-w-[720px] border-t border-line pt-10">
          <Link href="/portfolio" className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink hover:text-graphite">
            ← 返回作品集
          </Link>
          <h1 className="mt-10 text-[32px] font-semibold leading-tight">作品不存在</h1>
          <p className="mt-5 text-[14px] leading-7 text-graphite">请返回作品集查看当前已保存的作品。</p>
        </section>
      </main>
    );
  }

  return <CaseStudyLayout project={visibleProject} />;
}
