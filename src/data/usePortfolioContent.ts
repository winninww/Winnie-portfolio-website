"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/data/projects";
import {
  readPortfolioContent,
  type PortfolioContent,
} from "@/data/portfolioStorage";

export function usePortfolioContent(): {
  content: PortfolioContent;
  projects: Project[];
  profile: PortfolioContent["profile"];
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent>>;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const latest = await readPortfolioContent();
      setContent(latest);
    } catch (error) {
      console.error("Portfolio load error:", error);
      setContent(defaultPortfolioContent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const handleUpdate = () => {
      void refresh();
    };

    window.addEventListener("portfolio-content-updated", handleUpdate);
    return () => window.removeEventListener("portfolio-content-updated", handleUpdate);
  }, [refresh]);

  return {
    content,
    projects: content.projects,
    profile: content.profile,
    setContent,
    loading,
    refresh,
  };
}