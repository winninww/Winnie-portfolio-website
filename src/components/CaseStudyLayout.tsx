"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioImage } from "@/components/PortfolioImage";
import type { Project } from "@/data/projects";

type CaseStudyLayoutProps = {
  project: Project;
};

type DetailImageItem = {
  src: string;
  title?: string;
  category?: string;
  description?: string;
  overview?: string;
};

type ProjectWithImages = Project & {
  images?: Array<string | DetailImageItem>;
  coverImage?: string;
};

function normalizeDetailImage(image: string | DetailImageItem): DetailImageItem {
  return typeof image === "string" ? { src: image } : image;
}

export function CaseStudyLayout({ project }: CaseStudyLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<DetailImageItem | null>(null);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
  const [previewNaturalSize, setPreviewNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const projectWithImages = project as ProjectWithImages;
  const detailImages = (
    projectWithImages.images?.length
      ? projectWithImages.images
      : project.detailImages?.length
        ? project.detailImages
        : [projectWithImages.coverImage ?? project.cover]
  ).map(normalizeDetailImage);
  const currentImage = detailImages[currentIndex] ?? detailImages[0];
  const overviewSections = project.sections.filter((section) => section.eyebrow === "Overview" || section.title === "项目概述");
  const overviewText = currentImage?.overview ?? currentImage?.description ?? overviewSections[0]?.body ?? project.description ?? "";
  const currentTitle = currentImage?.title ?? project.title;
  const currentCategory = currentImage?.category ?? project.category;
  const isLongPreview = previewNaturalSize ? previewNaturalSize.height / previewNaturalSize.width > 2.5 : false;

  const clearSelectedPreview = () => {
    setSelectedPreviewImage(null);
    setSelectedPreviewIndex(null);
    setPreviewNaturalSize(null);
  };

  const closePreview = () => {
    clearSelectedPreview();
  };

  const openPreview = (image: DetailImageItem, index: number) => {
    setSelectedPreviewImage(image);
    setSelectedPreviewIndex(index);
    setPreviewNaturalSize(null);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    closePreview();
    clearSelectedPreview();
  }, [project.slug]);

  useEffect(() => {
    if (currentIndex > detailImages.length - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, detailImages.length]);

  return (
    <main className="min-h-screen bg-paper pt-16 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] grid-rows-[auto_minmax(58vh,1fr)_auto] gap-x-8 gap-y-6 px-4 py-5 sm:px-8 sm:py-8 lg:h-[calc(100vh-4rem)] lg:grid-cols-[112px_1px_minmax(0,1fr)_1px_minmax(320px,34%)] lg:grid-rows-1 lg:gap-y-8 lg:px-12 lg:py-10">
        <div className="min-h-0 self-stretch overflow-y-auto">
          <div className="flex min-h-full flex-row gap-3 overflow-x-auto lg:flex-col lg:overflow-x-visible">
            {detailImages.map((image, index) => {
              const isSelected = index === currentIndex;

              return (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  aria-label={`切换到详情图 ${index + 1}`}
                  className={`h-[102px] w-[68px] shrink-0 overflow-hidden rounded-[8px] border bg-paper outline-none transition duration-300 hover:opacity-75 sm:h-[132px] sm:w-[88px] ${
                    isSelected ? "border-ink" : "border-line"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <PortfolioImage
                    src={image.src}
                    alt={`${project.title} 缩略图 ${index + 1}`}
                    width={176}
                    height={264}
                    priority={index === 0}
                    sizes="88px"
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden h-full self-stretch bg-line lg:block" aria-hidden="true" />

        <div className="min-h-0 min-w-0 self-stretch">
          {currentImage ? (
            <motion.button
              key={currentImage.src}
              type="button"
              className="flex h-full min-h-[58vh] w-full cursor-zoom-in items-center justify-center overflow-hidden outline-none lg:min-h-0"
              onClick={() => openPreview(currentImage, currentIndex)}
              layoutId={`case-study-image-${project.slug}-${currentIndex}`}
            >
              <PortfolioImage
                src={currentImage.src}
                alt={`${project.title} 详情图 ${currentIndex + 1}`}
                width={1536}
                height={864}
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            </motion.button>
          ) : null}
        </div>

        <div className="hidden h-full self-stretch bg-line lg:block" aria-hidden="true" />

        <aside className="min-h-0">
          <motion.div
            key={`${project.slug}-${currentIndex}`}
            className="h-full overflow-y-auto"
            initial={{ opacity: 0.68 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Link
              href={`/?work=${project.slug}`}
              className="mb-12 inline-flex items-center text-[12px] font-medium uppercase tracking-[0.12em] text-ink hover:text-graphite"
            >
              ← 返回作品集
            </Link>

            <p className="mb-3 text-[13px] text-graphite">{currentCategory}</p>
            <h1 className="text-[32px] font-semibold leading-tight text-ink sm:text-[40px]">{currentTitle}</h1>

            <div className="mt-16 space-y-10">
              <section>
                <h2 className="text-[13px] font-semibold leading-none text-ink">
                  项目概述 <span className="text-graphite">Overview</span>
                </h2>
                <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-graphite">{overviewText}</p>
              </section>
            </div>
          </motion.div>
        </aside>
      </section>

      <AnimatePresence>
        {selectedPreviewImage && selectedPreviewIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[999] overflow-y-auto bg-white/90 px-3 sm:px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={closePreview}
          >
            <div
              className={`mx-auto flex min-h-screen w-full max-w-[94vw] justify-center sm:max-w-[92vw] lg:w-fit lg:max-w-[42vw] ${isLongPreview ? "items-start py-10 sm:py-16" : "items-center py-8 sm:py-12"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedPreviewImage.src}
                alt={`${project.title} 放大预览`}
                className={`${isLongPreview ? "h-auto max-h-none w-full lg:w-[42vw]" : "h-auto max-h-[92vh] w-auto max-w-full lg:max-w-[42vw]"} object-contain`}
                onLoad={(event) => {
                  setPreviewNaturalSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight
                  });
                }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
