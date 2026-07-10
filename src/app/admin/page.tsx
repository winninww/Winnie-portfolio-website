"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PortfolioImage } from "@/components/PortfolioImage";
import type { CaseSection, Profile, Project } from "@/data/projects";
import {
  defaultPortfolioContent,
  createStableSlug,
  normalizeContent,
  readPortfolioContent,
  resetPortfolioContent,
  writePortfolioContent,
  type PortfolioContent
} from "@/data/portfolioStorage";

type AdminView = "projects" | "profile" | "contact";

type PortfolioExportFile = {
  version: 1;
  exportedAt: string;
  content: PortfolioContent;
  images: Record<string, string>;
};

const sectionMeta: Array<Pick<CaseSection, "eyebrow" | "title">> = [
  { eyebrow: "Overview", title: "项目概述" },
  { eyebrow: "Challenge", title: "项目背景" },
  { eyebrow: "Solution", title: "解决方案" },
  { eyebrow: "Outcome", title: "设计成果" }
];

function createProject(index: number): Project {
  const id = `project-${Date.now()}`;

  return {
    id,
    slug: createStableSlug({ id }, index),
    title: `新作品 ${index}`,
    category: "项目分类",
    description: "项目简介",
    cover: "/work/olan-wine.png",
    detailImages: ["/work/olan-wine.png"],
    year: "",
    sections: sectionMeta.map((section) => ({
      ...section,
      body: ""
    }))
  };
}

function ensureSections(project: Project) {
  return sectionMeta.map((section) => {
    const existing = project.sections.find((item) => item.eyebrow === section.eyebrow);
    return {
      ...section,
      body: existing?.body ?? ""
    };
  });
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;

  const next = [...items];
  const current = next[index];
  next[index] = next[nextIndex];
  next[nextIndex] = current;
  return next;
}

async function createExportFile(content: PortfolioContent): Promise<PortfolioExportFile> {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    content: normalizeContent(content),
    images: {}
  };
}

function loadImageFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`图片读取失败：${file.name}`));
    };
    image.src = url;
  });
}

async function compressImageForUpload(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  const image = await loadImageFile(file);
  const shouldCompress = file.size > 3 * 1024 * 1024 || image.naturalWidth > 2000;
  if (!shouldCompress) return file;

  const scale = image.naturalWidth > 2000 ? 2000 / image.naturalWidth : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("浏览器不支持图片压缩。");
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84));
  if (!blob) throw new Error(`图片压缩失败：${file.name}`);

  const filename = file.name.replace(/\.[^.]+$/, "") || "portfolio-image";
  return new File([blob], `${filename}.webp`, { type: "image/webp" });
}

async function uploadImageFiles(files: File[]) {
  const optimizedFiles = await Promise.all(files.map(compressImageForUpload));
  const formData = new FormData();
  optimizedFiles.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData
  });

  const payload = (await response.json().catch(() => null)) as { paths?: string[]; error?: string } | null;

  if (!response.ok || !payload?.paths?.length) {
    throw new Error(payload?.error ?? "图片保存失败，请重试。");
  }

  return payload.paths;
}

function restoreImageRef(src: string, images: Record<string, string>) {
  const dataUrl = images[src];
  return dataUrl ?? src;
}

function restoreImportedContent(exportFile: PortfolioExportFile | PortfolioContent): PortfolioContent {
  const content = "content" in exportFile ? exportFile.content : exportFile;
  const images = "images" in exportFile ? exportFile.images : {};

  return {
    projects: content.projects.map((project) => ({
        ...project,
        cover: restoreImageRef(project.cover, images),
        detailImages: (project.detailImages ?? []).map((src) => restoreImageRef(src, images))
      })),
    profile: {
      ...content.profile,
      portrait: restoreImageRef(content.profile.portrait, images)
    }
  };
}

export default function AdminPage() {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent);
  const [activeView, setActiveView] = useState<AdminView>("projects");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState("未保存");
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;

    async function loadContent() {
      try {
        const latest = await readPortfolioContent();
        if (!alive) return;

        setContent(latest);
        setSelectedIndex(0);
        setStatus("已加载线上保存的数据");
      } catch (error) {
        if (!alive) return;
        setStatus(error instanceof Error ? `读取失败：${error.message}` : "读取失败");
      }
    }

    void loadContent();

    return () => {
      alive = false;
    };
  }, []);

  const selectedProject = content.projects[selectedIndex] ?? content.projects[0];

  const navigation = useMemo(
    () => [
      { id: "projects" as const, label: "作品管理" },
      { id: "profile" as const, label: "关于我" },
      { id: "contact" as const, label: "联系方式" }
    ],
    []
  );

  const updateContent = (updater: (current: PortfolioContent) => PortfolioContent) => {
    setContent((current) => updater(current));
    setStatus("未保存");
  };

  const updateProject = (updater: (project: Project) => Project) => {
    updateContent((current) => ({
      ...current,
      projects: current.projects.map((project, index) => (index === selectedIndex ? updater(project) : project))
    }));
  };

  const updateSection = (eyebrow: string, body: string) => {
    updateProject((project) => ({
      ...project,
      sections: ensureSections(project).map((section) => (section.eyebrow === eyebrow ? { ...section, body } : section))
    }));
  };

  const updateProfile = (field: keyof Profile, value: string) => {
    updateContent((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value
      }
    }));
  };

  const addProject = () => {
    updateContent((current) => {
      const project = createProject(current.projects.length + 1);
      setSelectedIndex(current.projects.length);
      return {
        ...current,
        projects: [...current.projects, project]
      };
    });
    setActiveView("projects");
  };

  const deleteProject = () => {
    if (!selectedProject || content.projects.length <= 1) {
      setStatus("至少保留一个作品");
      return;
    }

    if (!window.confirm(`确认删除「${selectedProject.title}」吗？`)) return;

    updateContent((current) => {
      const projects = current.projects.filter((_, index) => index !== selectedIndex);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      return {
        ...current,
        projects
      };
    });
  };

  const moveProject = (direction: -1 | 1) => {
    updateContent((current) => {
      const projects = moveItem(current.projects, selectedIndex, direction);
      const nextIndex = Math.max(0, Math.min(projects.length - 1, selectedIndex + direction));
      setSelectedIndex(nextIndex);
      return {
        ...current,
        projects
      };
    });
  };

  const uploadCover = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    try {
      const [imageRef] = await uploadImageFiles([file]);
      updateProject((project) => ({
        ...project,
        cover: imageRef,
        detailImages: project.detailImages?.length ? project.detailImages : [imageRef]
      }));
      setStatus("图片已上传，点击保存后生效");
    } catch (error) {
      setStatus(error instanceof Error ? `封面上传失败：${error.message}` : "封面上传失败：未知错误");
    }
  };

  const uploadDetailImages = async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      const images = await uploadImageFiles(Array.from(files));
      updateProject((project) => ({
        ...project,
        detailImages: [...(project.detailImages ?? []), ...images]
      }));
      setStatus("图片已上传，点击保存后生效");
    } catch (error) {
      setStatus(error instanceof Error ? `详情图上传失败：${error.message}` : "详情图上传失败：未知错误");
    }
  };

  const uploadPortrait = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    try {
      const [imageRef] = await uploadImageFiles([file]);
      updateProfile("portrait", imageRef);
      setStatus("图片已上传，点击保存后生效");
    } catch (error) {
      setStatus(error instanceof Error ? `职业照上传失败：${error.message}` : "职业照上传失败：未知错误");
    }
  };

  const removeDetailImage = (index: number) => {
    updateProject((project) => ({
      ...project,
      detailImages: (project.detailImages ?? []).filter((_, imageIndex) => imageIndex !== index)
    }));
  };

  const moveDetailImage = (index: number, direction: -1 | 1) => {
    updateProject((project) => ({
      ...project,
      detailImages: moveItem(project.detailImages ?? [], index, direction)
    }));
  };

  const saveContent = async () => {
    try {
      const normalizedContent = normalizeContent(content);
      const response = await fetch("/api/portfolio", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(normalizedContent),
});

if (!response.ok) {
  throw new Error("保存失败");
}

const result = await response.json();

const savedContent = result.data;
      setContent(savedContent);
      setStatus("保存成功，已同步到线上数据库");
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      setStatus(`保存失败：${message}`);
    }
  };

  const restoreDefaults = async () => {
    if (!window.confirm("确认恢复默认数据吗？这会覆盖线上保存的作品、图片和个人信息。")) return;
    try {
      const savedContent = await resetPortfolioContent();
      setContent(savedContent);
      setSelectedIndex(0);
      setStatus("已恢复默认数据，并同步到线上数据库");
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      setStatus(`恢复默认失败：${message}`);
    }
  };

  const exportData = async () => {
    try {
      const exportFile = await createExportFile(content);
      const blob = new Blob([JSON.stringify(exportFile, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hewen-portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("作品数据 JSON 已导出");
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      setStatus(`导出失败：${message}`);
    }
  };

  const importData = async (file: File | null) => {
    if (!file) return;
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as PortfolioExportFile | PortfolioContent;
      const restoredContent = restoreImportedContent(parsed);
      const normalizedContent = normalizeContent(restoredContent);
      const savedContent = await writePortfolioContent(normalizedContent);
      setContent(savedContent);
      setSelectedIndex(0);
      setActiveView("projects");
      setStatus("作品数据 JSON 已导入并同步到线上数据库");
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      setStatus(`导入失败：${message}`);
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="min-h-screen bg-paper px-5 pt-28 text-ink sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[1440px] border-t border-line pt-8">
        <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[13px] uppercase tracking-[0.08em] text-graphite">Portfolio Admin</p>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight">内容管理后台</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[13px] text-graphite">{status}</p>
            <button type="button" onClick={exportData} className="border border-line px-5 py-3 text-[13px] text-ink hover:border-ink">
              导出作品数据 JSON
            </button>
            <button type="button" onClick={() => importInputRef.current?.click()} className="border border-line px-5 py-3 text-[13px] text-ink hover:border-ink">
              导入作品数据 JSON
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => void importData(event.target.files?.[0] ?? null)}
            />
            <button type="button" onClick={saveContent} className="border border-ink px-5 py-3 text-[13px] text-ink hover:bg-ink hover:text-white">
              保存
            </button>
          </div>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[180px_minmax(260px,320px)_1fr]">
          <aside className="border-r border-line pr-5">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`px-3 py-3 text-left text-[14px] transition ${
                    activeView === item.id ? "bg-ink text-white" : "text-graphite hover:bg-white hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={restoreDefaults} className="mt-6 px-3 py-3 text-left text-[14px] text-graphite hover:bg-white hover:text-ink">
                恢复默认数据
              </button>
            </nav>
          </aside>

          <section className={activeView === "projects" ? "block" : "hidden lg:block"}>
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-[16px] font-semibold">作品列表</h2>
              <button type="button" onClick={addProject} className="border border-line px-3 py-2 text-[12px] text-ink hover:border-ink">
                新增作品
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {content.projects.map((project, index) => (
                <button
                  key={`${project.slug}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index);
                    setActiveView("projects");
                  }}
                  className={`flex w-full items-center gap-3 p-3 text-left transition ${
                    index === selectedIndex && activeView === "projects" ? "bg-white text-ink" : "text-graphite hover:bg-white hover:text-ink"
                  }`}
                >
                  <span className="relative h-12 w-16 shrink-0">
                    <PortfolioImage src={project.cover} alt={project.title} fill sizes="64px" className="object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium">{project.title}</span>
                    <span className="mt-1 block truncate text-[12px]">{project.category}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0">
            {activeView === "projects" && selectedProject ? (
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => moveProject(-1)} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                    上移
                  </button>
                  <button type="button" onClick={() => moveProject(1)} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                    下移
                  </button>
                  <button type="button" onClick={deleteProject} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                    删除作品
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="项目名称" value={selectedProject.title} onChange={(value) => updateProject((project) => ({ ...project, title: value }))} />
                  <Field label="项目分类" value={selectedProject.category} onChange={(value) => updateProject((project) => ({ ...project, category: value }))} />
                </div>
                <p className="mt-4 text-[12px] leading-6 text-graphite">Slug：{selectedProject.slug}</p>

                <Textarea
                  label="项目简介"
                  value={selectedProject.description ?? ""}
                  onChange={(value) => updateProject((project) => ({ ...project, description: value }))}
                />

                <ImageUpload
                  title="封面图"
                  description="用于首页作品展示，不会作为作品详情页首图。"
                  inputId="cover-upload"
                  multiple={false}
                  onFiles={uploadCover}
                />
                <div className="mt-4">
                  <ImagePreview src={selectedProject.cover} alt={`${selectedProject.title} 封面`} />
                </div>

                <ImageUpload
                  title="详情图"
                  description="用于作品详情页展示，会按顺序从第一张开始完整呈现。"
                  inputId="detail-upload"
                  multiple
                  onFiles={uploadDetailImages}
                />
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {(selectedProject.detailImages ?? []).map((src, index) => (
                    <div key={`${src.slice(0, 32)}-${index}`}>
                      <ImagePreview src={src} alt={`${selectedProject.title} 详情图 ${index + 1}`} />
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={() => moveDetailImage(index, -1)} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                          前移
                        </button>
                        <button type="button" onClick={() => moveDetailImage(index, 1)} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                          后移
                        </button>
                        <button type="button" onClick={() => removeDetailImage(index)} className="border border-line px-3 py-2 text-[12px] text-graphite hover:border-ink hover:text-ink">
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-5">
                  {ensureSections(selectedProject).map((section) => (
                    <Textarea
                      key={section.eyebrow}
                      label={`${section.title} ${section.eyebrow}`}
                      value={section.body}
                      onChange={(value) => updateSection(section.eyebrow, value)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {activeView === "profile" ? (
              <div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="姓名" value={content.profile.name} onChange={(value) => updateProfile("name", value)} />
                  <Field label="职业标题" value={content.profile.englishRole} onChange={(value) => updateProfile("englishRole", value)} />
                  <Field label="中文身份" value={content.profile.chineseRole} onChange={(value) => updateProfile("chineseRole", value)} />
                  <Field label="经验" value={content.profile.experience} onChange={(value) => updateProfile("experience", value)} />
                  <Field label="城市" value={content.profile.city} onChange={(value) => updateProfile("city", value)} />
                  <Field label="技能" value={content.profile.skills} onChange={(value) => updateProfile("skills", value)} />
                  <Field label="方向" value={content.profile.direction} onChange={(value) => updateProfile("direction", value)} />
                  <Field label="邮箱（联系方式预留）" value={content.profile.email} onChange={(value) => updateProfile("email", value)} />
                  <Field label="微信（联系方式预留）" value={content.profile.wechat} onChange={(value) => updateProfile("wechat", value)} />
                  <Field label="合作方式（社交链接预留）" value={content.profile.collaboration} onChange={(value) => updateProfile("collaboration", value)} />
                </div>
                <Textarea label="Slogan" value={content.profile.slogan} onChange={(value) => updateProfile("slogan", value)} />
                <Textarea label="简介" value={content.profile.bio} onChange={(value) => updateProfile("bio", value)} />
                <ImageUpload
                  title="个人职业照"
                  description="上传后 About 页面会同步显示。"
                  inputId="portrait-upload"
                  multiple={false}
                  onFiles={uploadPortrait}
                />
                <div className="mt-4 max-w-[320px]">
                  <ImagePreview src={content.profile.portrait} alt={`${content.profile.name} 职业照`} />
                </div>
              </div>
            ) : null}

            {activeView === "contact" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="邮箱" value={content.profile.email} onChange={(value) => updateProfile("email", value)} />
                <Field label="微信" value={content.profile.wechat} onChange={(value) => updateProfile("wechat", value)} />
                <Field label="城市" value={content.profile.city} onChange={(value) => updateProfile("city", value)} />
                <Field label="合作方式" value={content.profile.collaboration} onChange={(value) => updateProfile("collaboration", value)} />
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-ink"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-5 block">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-[120px] w-full resize-y border border-line bg-white px-4 py-3 text-[14px] leading-7 text-ink outline-none focus:border-ink"
      />
    </label>
  );
}

function ImageUpload({
  title,
  description,
  inputId,
  multiple,
  onFiles
}: {
  title: string;
  description: string;
  inputId: string;
  multiple: boolean;
  onFiles: (files: FileList | null) => void;
}) {
  return (
    <label
      htmlFor={inputId}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onFiles(event.dataTransfer.files);
      }}
      className="mt-8 block border border-dashed border-line bg-white px-5 py-6 text-center transition hover:border-ink"
    >
      <span className="block text-[15px] font-semibold text-ink">{title}</span>
      <span className="mt-2 block text-[13px] leading-6 text-graphite">{description}</span>
      <span className="mt-4 inline-block border border-line px-4 py-2 text-[12px] text-ink">点击上传</span>
      <input id={inputId} type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={(event) => onFiles(event.target.files)} />
    </label>
  );
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex min-h-[180px] items-center justify-center bg-transparent">
      <PortfolioImage src={src} alt={alt} width={900} height={600} sizes="320px" className="h-auto max-h-[260px] w-auto max-w-full object-contain" />
    </div>
  );
}
