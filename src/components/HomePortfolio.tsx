 "use client";

import { ExhibitionGallery } from "@/components/ExhibitionGallery";
import { usePortfolioContent } from "@/data/usePortfolioContent";

type HomePortfolioProps = {
  initialSlug?: string;
};

export function HomePortfolio({ initialSlug }: HomePortfolioProps) {
  const { projects, loading } = usePortfolioContent();

  if (loading) {
    return <main className="min-h-screen bg-paper" />;
  }

  return (
    <ExhibitionGallery
      projects={projects}
      initialSlug={initialSlug}
    />
  );
}