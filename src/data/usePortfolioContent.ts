"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";
import {
  defaultPortfolioContent,
  readPortfolioContent,
  type PortfolioContent,
} from "@/data/portfolioStorage";

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContent | null>(
    defaultPortfolioContent
  );

  const [loading, setLoading] = useState(true);

  async function refresh() {
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
  }

  useEffect(() => {
    void refresh();

    const handleUpdate = () => {
      void refresh();
    };

    window.addEventListener(
      "portfolio-content-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "portfolio-content-updated",
        handleUpdate
      );
    };
  }, []);

  return {
    content,
    projects: content?.projects ?? [],
    profile: content?.profile ?? defaultPortfolioContent.profile,
    setContent,
    loading,
    refresh,
  };
}