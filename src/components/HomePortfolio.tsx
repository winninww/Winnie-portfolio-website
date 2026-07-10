"use client";

import { ExhibitionGallery } from "@/components/ExhibitionGallery";
import { usePortfolioContent } from "@/data/usePortfolioContent";

type HomePortfolioProps = {
  initialSlug?: string;
};

export function HomePortfolio({ initialSlug }: HomePortfolioProps) {
  const { projects } = usePortfolioContent();

  return <ExhibitionGallery projects={projects} initialSlug={initialSlug} />;
}
