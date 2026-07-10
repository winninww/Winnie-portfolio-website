import type { Metadata } from "next";
import { CaseStudyClient } from "@/components/CaseStudyClient";
import { projects } from "@/data/projects";
import { normalizeContent } from "@/data/portfolioStorage";

const siteUrl = "https://www.hewen.mom";

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function getMetadataProjects() {
  try {
    const response = await fetch(`${siteUrl}/api/portfolio`, {
      next: { revalidate: 300 }
    });

    if (response.ok) {
      return normalizeContent(await response.json()).projects;
    }
  } catch {
    // Metadata falls back to the bundled project list when the live API is unavailable.
  }

  return projects;
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const requestedSlug = decodeSlug(params.slug);
  const availableProjects = await getMetadataProjects();
  const project =
    availableProjects.find((item) => item.slug === requestedSlug || item.title === requestedSlug) ??
    projects.find((item) => item.slug === requestedSlug || item.title === requestedSlug);
  const title = project?.title ?? "作品详情";
  const description = (project?.description || project?.sections[0]?.body || "查看何文的视觉设计项目详情。").slice(0, 160);
  const canonicalPath = `/case-study/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: `${title}｜何文作品集`,
      description,
      url: canonicalPath,
      images: project?.cover ? [{ url: project.cover, alt: project.title }] : undefined
    }
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  return <CaseStudyClient slug={params.slug} />;
}
