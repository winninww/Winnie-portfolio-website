import {
  defaultProfile,
  defaultProjects,
  type Profile,
  type Project,
  type CaseSection,
} from "@/data/projects";

export type PortfolioContent = {
  projects: Project[];
  profile: Profile;
  updatedAt?: string;
};

export const defaultPortfolioContent: PortfolioContent = {
  projects: defaultProjects,
  profile: defaultProfile,
  updatedAt: new Date(0).toISOString(),
};

const unsafeSlugPattern = /[^a-z0-9-]/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringWithFallback(value: unknown, fallback: string): string {
  return optionalString(value) ?? fallback;
}

function numberWithFallback(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toAsciiSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createStableSlug(project: Partial<Project> & { id?: string }, index = 0) {
  const existingSlug = project.slug ? toAsciiSlug(project.slug) : "";
  if (existingSlug && !unsafeSlugPattern.test(existingSlug)) return existingSlug;

  const idSlug = project.id ? toAsciiSlug(project.id) : "";
  if (idSlug) return idSlug;

  const titleSlug = project.title ? toAsciiSlug(project.title) : "";
  return titleSlug || `project-${index + 1}`;
}

function uniqueSlug(slug: string, usedSlugs: Set<string>) {
  let nextSlug = slug;
  let suffix = 2;

  while (usedSlugs.has(nextSlug)) {
    nextSlug = `${slug}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(nextSlug);
  return nextSlug;
}

function normalizeProjectImage(value: unknown, index: number, projectTitle: string) {
  if (!isRecord(value)) {
    return { url: "", alt: projectTitle, caption: `Image ${index + 1}` };
  }

  return {
    url: stringWithFallback(value.url, ""),
    alt: stringWithFallback(value.alt, projectTitle),
    caption: optionalString(value.caption),
  };
}

function normalizeProjectSection(value: unknown, index: number): CaseSection {
  if (!isRecord(value)) {
    return { eyebrow: `section-${index + 1}`, title: "", body: "" };
  }

  return {
    eyebrow: stringWithFallback(value.eyebrow, `section-${index + 1}`),
    title: stringWithFallback(value.title, ""),
    body: stringWithFallback(value.body, ""),
  };
}

export function normalizeProject(value: unknown, index = 0, usedSlugs = new Set<string>()): Project {
  const project = isRecord(value) ? value : {};
  const title = stringWithFallback(project.title, "未命名作品");
  const rawImages = Array.isArray(project.images) ? project.images : [];
  const rawDetailImages = Array.isArray(project.detailImages) ? project.detailImages : [];
  const rawSections = Array.isArray(project.sections) ? project.sections : [];

  const normalizedProject: Project = {
    id: optionalString(project.id),
    slug: uniqueSlug(createStableSlug(project as Partial<Project>, index), usedSlugs),
    title,
    category: stringWithFallback(project.category, "项目分类"),
    cover: stringWithFallback(project.cover, stringWithFallback(project.coverImage, "/images/project-01-cover.jpg")),
    description: stringWithFallback(project.description, ""),
    year: stringWithFallback(project.year, ""),
    sections: rawSections.map(normalizeProjectSection),
  };

  const detailImages = (rawDetailImages.length ? rawDetailImages : rawImages)
    .map((image, imageIndex) => {
      if (typeof image === "string") return image;
      return normalizeProjectImage(image, imageIndex, title).url;
    })
    .filter((image): image is string => image.length > 0);

  normalizedProject.detailImages = detailImages.length ? detailImages : [normalizedProject.cover];

  if (!normalizedProject.description) {
    normalizedProject.description = normalizedProject.sections[0]?.body ?? "";
  }

  if (!normalizedProject.sections.length) {
    normalizedProject.sections = [
      { eyebrow: "Overview", title: "项目概述", body: normalizedProject.description ?? "" },
      { eyebrow: "Challenge", title: "项目背景", body: "" },
      { eyebrow: "Solution", title: "解决方案", body: "" },
      { eyebrow: "Outcome", title: "设计成果", body: "" },
    ];
  }

  return normalizedProject;
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => numberWithFallback((a as { sortOrder?: unknown }).sortOrder, 0) - numberWithFallback((b as { sortOrder?: unknown }).sortOrder, 0));
}

export function normalizeProfile(value: unknown): Profile {
  const profile = isRecord(value) ? value : {};

  return {
    name: stringWithFallback(profile.name, defaultProfile.name),
    englishRole: stringWithFallback(profile.englishRole, defaultProfile.englishRole),
    chineseRole: stringWithFallback(profile.chineseRole, defaultProfile.chineseRole),
    slogan: stringWithFallback(profile.slogan, defaultProfile.slogan),
    bio: stringWithFallback(profile.bio, defaultProfile.bio),
    experience: stringWithFallback(profile.experience, defaultProfile.experience),
    skills: stringWithFallback(profile.skills, defaultProfile.skills),
    city: stringWithFallback(profile.city, defaultProfile.city),
    direction: stringWithFallback(profile.direction, defaultProfile.direction),
    email: stringWithFallback(profile.email, defaultProfile.email),
    wechat: stringWithFallback(profile.wechat, defaultProfile.wechat),
    collaboration: stringWithFallback(profile.collaboration, defaultProfile.collaboration),
    portrait: stringWithFallback(profile.portrait, defaultProfile.portrait),
  };
}

export function normalizeContent(value: unknown): PortfolioContent {
  const content = isRecord(value) ? value : {};
  const usedSlugs = new Set<string>();
  const rawProjects = Array.isArray(content.projects) && content.projects.length ? content.projects : defaultProjects;
  const projects = rawProjects.map((project, index) => normalizeProject(project, index, usedSlugs));

  return {
    projects: sortProjects(projects),
    profile: normalizeProfile(content.profile),
    updatedAt: stringWithFallback(content.updatedAt, new Date().toISOString()),
  };
}

export async function readPortfolioContent(): Promise<PortfolioContent> {

  if (typeof window !== "undefined") {

    const saved =
      localStorage.getItem("portfolio-content");

    if (saved) {
      try {
        return normalizeContent(
          JSON.parse(saved)
        );
      } catch {}
    }

  }

  return normalizeContent(defaultPortfolioContent);
}

export async function writePortfolioContent(
  content: PortfolioContent
): Promise<PortfolioContent> {

  const normalizedContent = normalizeContent({
    ...content,
    updatedAt: new Date().toISOString(),
  });


  const response = await fetch(
    `/api/portfolio?t=${Date.now()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(normalizedContent),
    }
  );


  if (!response.ok) {
    throw new Error("作品保存失败");
  }


  const result = await response.json();


  window.dispatchEvent(
    new Event("portfolio-content-updated")
  );


  return normalizeContent(
    result.data ?? result
  );
}
export async function resetPortfolioContent(): Promise<PortfolioContent> {
  return writePortfolioContent(
    normalizeContent(defaultPortfolioContent)
  );
}