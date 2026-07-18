"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PortfolioImage } from "@/components/PortfolioImage";
import type { Project } from "@/data/projects";
import type { PortfolioCategory } from "@/data/portfolioStorage";

type ExhibitionGalleryProps = {
  projects: Project[];
  categories: PortfolioCategory[];
  initialSlug?: string;
};

type VisibleProject = Project & {
  offset: number;
  sourceIndex: number;
};

export function ExhibitionGallery({
  projects,
  categories,
  initialSlug
}: ExhibitionGalleryProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredProjects = useMemo(() => {

  if (activeCategory === "all") {
    return projects;
  }

  const currentCategory = categories.find(
    (item) => item.id === activeCategory
  );

  if (!currentCategory) {
    return projects;
  }

  return projects.filter(
    (project) =>
      project.category === currentCategory.name
  );

}, [projects, categories, activeCategory]);


return (
  <main
 className="
 h-screen
 w-full
 flex
 overflow-hidden
 bg-paper
 overflow-y-auto
 h-full
 "
>

    {/* 左侧分类栏 */}

    <aside
  className="
  w-[240px]
  shrink-0
  sticky
  top-16
  h-[calc(100vh-64px)]
  border-r
  border-black/10
  px-12
  py-4
"
>
      



      <div
        className="
        flex
        flex-col
        gap-7
        text-[14px]
        "
      >

        <button
          onClick={() => setActiveCategory("all")}
          className={`
          text-left
          transition
          ${
            activeCategory === "all"
              ? "text-black"
              : "text-graphite"
          }
          `}
        >
          全部作品
        </button>


        {categories.map((item) => (

          <button
            key={item.id}
            onClick={() =>
              setActiveCategory(item.id)
            }
            className={`
            text-left
tracking-[0.05em]
transition
duration-300
            ${
              activeCategory === item.id
                ? "text-black"
                : "text-graphite"
            }
            `}
          >
            {item.name}
          </button>

        ))}


      </div>


    </aside>



    {/* 右侧瀑布流 */}

    <section
      className="
      flex-1
      px-12
      py-20
      "
    >

    <div
      className="
      columns-1
      md:columns-2
      xl:columns-3
      2xl:columns-4
      gap-10
      "
    >

        {filteredProjects.map((project) => (

          <article
            key={project.slug}
            className="
            mb-10
            break-inside-avoid
            cursor-pointer
            group
            overflow-hidden
            rounded-[15px]
            "
            onClick={() => router.push(`/case-study/${project.slug}`)}
          >

            <PortfolioImage
              src={project.cover}

  alt={project.title}

  width={1200}

  height={1200}

  className="
w-full
max-h-[700px]
overflow-hidden
rounded-[15px]
bg-[#f5f5f3]
object-cover
transition
duration-500
hover:scale-[1.015]
"
            />


            

          </article>

        ))}


      </div>


    </section>


  </main>
);
}
