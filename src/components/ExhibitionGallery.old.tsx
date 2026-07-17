"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WheelEvent } from "react";
import { PortfolioImage } from "@/components/PortfolioImage";
import type { Project } from "@/data/projects";

type ExhibitionGalleryProps = {
  projects: Project[];
  initialSlug?: string;
};

type VisibleProject = Project & {
  offset: number;
  sourceIndex: number;
};

function circularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function getInitialIndex(projects: Project[], initialSlug?: string) {
  if (!projects.length) return 0;
  if (initialSlug) {
    const slugIndex = projects.findIndex((project) => project.slug === initialSlug);
    return slugIndex >= 0 ? slugIndex : 0;
  }
  return Math.min(1, projects.length - 1);
}

export function ExhibitionGallery({ projects, initialSlug }: ExhibitionGalleryProps) {
  const router = useRouter();
  const wheelLockedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(() => getInitialIndex(projects, initialSlug));
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);

  const safeActiveIndex = projects.length ? Math.min(Math.max(activeIndex, 0), projects.length - 1) : 0;
  const activeProject = projects[safeActiveIndex];

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    if (!projects.length) {
      if (activeIndex !== 0) setActiveIndex(0);
      return;
    }
    if (activeIndex < 0 || activeIndex > projects.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, projects.length]);

  const visibleProjects = useMemo<VisibleProject[]>(() => {
    if (!projects.length) return [];

    return projects
      .map((project, sourceIndex) => ({
        ...project,
        sourceIndex,
        offset: circularOffset(sourceIndex, safeActiveIndex, projects.length)
      }))
      .filter((project) => Math.abs(project.offset) <= 2)
      .sort((a, b) => a.offset - b.offset);
  }, [projects, safeActiveIndex]);

  const firstLayerX = Math.min(380, Math.max(210, viewportWidth * 0.26));
  const secondLayerX = Math.min(660, Math.max(330, viewportWidth * 0.38));

  const setActive = (index: number) => {
    if (!projects.length) return;
    setActiveIndex((index + projects.length) % projects.length);
  };

  const handleSelect = (project: VisibleProject) => {
    if (project.offset === 0) {
      router.push(`/case-study/${project.slug}`);
      return;
    }
    setActive(project.sourceIndex);
  };

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
  if (!projects.length || wheelLockedRef.current) return;
  if (Math.abs(event.deltaY) < 24 && Math.abs(event.deltaX) < 24) return;

  wheelLockedRef.current = true;

  const delta =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  setActive(safeActiveIndex + (delta > 0 ? 1 : -1));

  window.setTimeout(() => {
    wheelLockedRef.current = false;
  }, 420);
};

  const handlePointerUp = (clientX: number) => {
    if (dragStart === null) return;
    const distance = clientX - dragStart;
    if (Math.abs(distance) > 48) {
      setActive(safeActiveIndex + (distance < 0 ? 1 : -1));
    }
    setDragStart(null);
  };

return (
  <section
      aria-label="作品展示"
      className="relative flex min-h-screen w-full touch-pan-y select-none flex-col bg-paper px-4 pt-16"
      onWheel={handleWheel}
      onPointerDown={(event) => setDragStart(event.clientX)}
      onPointerUp={(event) => handlePointerUp(event.clientX)}
      onPointerCancel={() => setDragStart(null)}
    >
      <button
        type="button"
        aria-label="上一个作品"
        className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-[42px] font-light leading-none text-ink/55 outline-none transition duration-300 hover:scale-[1.12] hover:bg-black/[0.04] hover:text-ink focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafafa] sm:left-10"
        onClick={() => setActive(safeActiveIndex - 1)}
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        aria-label="下一个作品"
        className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-[42px] font-light leading-none text-ink/55 outline-none transition duration-300 hover:scale-[1.12] hover:bg-black/[0.04] hover:text-ink focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafafa] sm:right-10"
        onClick={() => setActive(safeActiveIndex + 1)}
      >
        <span aria-hidden="true">›</span>
      </button>

      <main className="flex flex-1 items-center justify-center">
        <div className="gallery-group flex h-[68vh] w-full max-w-[min(1700px,94vw)] flex-col items-center justify-center">
          <div className="gallery-images relative h-[60vh] w-[70vw] max-w-[1200px] overflow-visible">
            {visibleProjects.map((project) => {
              const isActive = project.offset === 0;
              const distance = Math.abs(project.offset);
              const layerX = distance === 0 ? 0 : distance === 1 ? firstLayerX : secondLayerX;
              const x = project.offset < 0 ? -layerX : layerX;
              const scale = isActive ? 1 : distance === 1 ? 0.58 : 0.38;
              const opacity = isActive ? 1 : distance === 1 ? 0.62 : 0.3;
              const zIndex = isActive ? 50 : distance === 1 ? 30 : 10;

              return (
                <motion.button
                  key={project.slug}
                  type="button"
                  aria-label={`${project.title} ${isActive ? "进入详情" : "移到中心"}`}
                  aria-pressed={isActive}
                  className="absolute left-1/2 top-1/2 flex min-w-0 translate-z-0 items-center justify-center rounded-[2px] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafafa]"
                  style={{ zIndex }}
                  animate={{ opacity, scale, x, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                  onClick={() => handleSelect(project)}
                  whileHover={isActive ? { scale: 1.025, y: -5 } : undefined}
                >
                  <PortfolioImage
                    src={project.cover}
                    alt={project.title}
                    width={1536}
                    height={864}
                    priority={isActive}
                    loading={isActive ? undefined : distance === 1 ? "eager" : "lazy"}
                    sizes={isActive ? "54vw" : distance === 1 ? "26vw" : "16vw"}
                    className="h-auto w-auto max-h-[60vh] max-w-[54vw] object-contain"
                  />
                </motion.button>
              );
            })}
          </div>

          <div className="gallery-meta mt-9 flex flex-col items-center text-center">
            <h1 className="text-[20px] font-semibold leading-tight text-ink">{activeProject.title}</h1>
            <p className="mt-2.5 text-[13px] leading-tight text-graphite">{activeProject.category}</p>
          </div>
        </div>
      </main>
    </section>
  );
}
