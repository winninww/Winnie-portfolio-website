"use client";

import Link from "next/link";
import { useState } from "react";
import { PortfolioImage } from "@/components/PortfolioImage";
import type { Project } from "@/data/projects";

type CaseStudyLayoutProps = {
  project: Project;
};

export function CaseStudyLayout({ project }: CaseStudyLayoutProps) {

  console.log("TEST123456", project);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const overviewText =
    project.description ||
    project.sections?.find(
      (section) => section.eyebrow === "Overview"
    )?.body ||
    "";


  return (
    <main className="min-h-screen bg-paper pt-16 text-ink">

      <section
        className="
        mx-auto
        grid
        min-h-[calc(100vh-4rem)]
        max-w-[1440px]
        grid-cols-[minmax(320px,34%)_1px_minmax(0,1fr)]
        gap-x-8
        px-4
        py-5
        sm:px-8
        sm:py-8
        lg:h-[calc(100vh-4rem)]
        lg:px-12
        lg:py-10
        "
      >

        <aside className="min-h-0">

          <div className="h-[78vh] overflow-y-auto">

            <Link
              href="/portfolio"
              className="
              mb-12
              inline-flex
              items-center
              text-[14px]
              font-medium
              tracking-[0.08em]
              text-ink
              hover:text-graphite
              "
            >
              ← 返回作品集
            </Link>


            <p className="mb-3 text-[13px] text-graphite">
              {project.category}
            </p>


            <h1
              className="
              text-[32px]
              font-semibold
              leading-tight
              text-ink
              sm:text-[40px]
              "
            >
              {project.title}
            </h1>


            <section className="mt-16">

              <h2 className="text-[13px] font-semibold text-ink">
                项目概述
                <span className="text-graphite">
                  {" "}Overview
                </span>
              </h2>


              <p
                className="
                mt-4
                max-w-[520px]
                text-[14px]
                leading-7
                text-graphite
                "
              >
                {overviewText}
              </p>

            </section>

          </div>

        </aside>



        <div
          className="
          hidden
          h-full
          self-stretch
          bg-line
          lg:block
          "
        />



        <div
          className="
          flex
          min-h-0
          min-w-0
          items-center
          justify-center
          "
        >

          {project.cover ? (

            <div
              className="
              flex
              h-[78vh]
              w-full
              items-center
              justify-center
              overflow-hidden
              "
            >

              <button
  type="button"
  onClick={() => setIsPreviewOpen(true)}
  className="
  cursor-zoom-in
  "
>

  <PortfolioImage
    src={project.cover}
    alt={project.title}
    width={1080}
    height={1920}
    priority
    sizes="(min-width:1024px) 60vw,100vw"
    className="
    max-h-[70vh]
    max-w-full
    object-contain
    "
  />

</button>

            </div>

          ) : (

            <div className="text-sm text-graphite">
              暂无封面图片
            </div>

          )}

        </div>


            </section>


      {isPreviewOpen && (

  <div
    className="
    fixed
    inset-0
    z-50
    overflow-y-auto
    bg-black/80
    p-10
    cursor-zoom-out
    "
    onClick={() => setIsPreviewOpen(false)}
  >

    <div
      className="
      flex
      min-h-full
      justify-center
      "
    >

      <img
        src={project.cover}
        alt={project.title}
        className="
        w-[700px]
        h-auto
        object-contain
        cursor-default
        "
        onClick={(e) => e.stopPropagation()}
      />

    </div>

  </div>

)}


    </main>
  );
}