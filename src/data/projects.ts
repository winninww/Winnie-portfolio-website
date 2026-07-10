export type CaseSection = {
  eyebrow: string;
  title: string;
  body: string;
};

export type Project = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description?: string;
  cover: string;
  detailImages?: string[];
  year: string;
  sections: CaseSection[];
};

export type Profile = {
  name: string;
  englishRole: string;
  chineseRole: string;
  slogan: string;
  bio: string;
  experience: string;
  skills: string;
  city: string;
  direction: string;
  email: string;
  wechat: string;
  collaboration: string;
  portrait: string;
};

export const defaultProjects: Project[] = [
  {
    slug: "yingjiu-app",
    title: "映妆 APP",
    category: "APP视觉设计 / 电商视觉",
    description: "围绕移动端美妆电商的购买路径，建立轻量、克制、清晰的商品浏览体验。",
    cover: "/work/yingjiu-app.png",
    detailImages: ["/work/yingjiu-app.png", "/work/olan-wine.png", "/work/zhenlan-detail.png"],
    year: "2026",
    sections: [
      {
        eyebrow: "Overview",
        title: "项目概述",
        body: "围绕移动端美妆电商的购买路径，建立轻量、克制、清晰的商品浏览体验。"
      },
      {
        eyebrow: "Challenge",
        title: "项目背景",
        body: "需要在高频浏览场景里保持商品信息层级明确，同时避免界面视觉过度装饰。"
      },
      {
        eyebrow: "Solution",
        title: "解决方案",
        body: "使用黑白双模式界面、紧凑信息分组和稳定的商品图比例，提升浏览效率与质感。"
      },
      {
        eyebrow: "Outcome",
        title: "设计成果",
        body: "形成可扩展的移动端视觉系统，适配商品详情、收藏和购买决策流程。"
      }
    ]
  },
  {
    slug: "olan-wine",
    title: "奥兰葡萄酒",
    category: "电商详情页 / 酒类视觉",
    description: "通过故事化视觉语言，呈现品牌的高端气质与产品品质，强化用户对品牌的记忆点。",
    cover: "/work/olan-wine.png",
    detailImages: ["/work/olan-wine.png", "/work/yingjiu-app.png", "/work/zhenlan-detail.png"],
    year: "2026",
    sections: [
      {
        eyebrow: "Overview",
        title: "项目概述",
        body: "通过故事化视觉语言，呈现品牌的高端气质与产品品质，强化用户对品牌的记忆点。"
      },
      {
        eyebrow: "Challenge",
        title: "项目背景",
        body: "品牌需要在竞争中建立差异化形象，同时突出产品的高端定位与情绪价值。"
      },
      {
        eyebrow: "Solution",
        title: "解决方案",
        body: "以极简镜棚视觉完成包装呈现，结合细腻的材质表达与信息层级，提升品牌感与购买信心。"
      },
      {
        eyebrow: "Outcome",
        title: "设计成果",
        body: "整体视觉统一且具有识别度，显著提升详情页的专业感与转化体验。"
      }
    ]
  },
  {
    slug: "jewelry-detail",
    title: "珠宝详情页",
    category: "电商详情页 / 视觉规范",
    description: "为高客单价商品建立更清晰的详情页叙事，让材质、工艺和品牌感顺序呈现。",
    cover: "/work/zhenlan-detail.png",
    detailImages: ["/work/zhenlan-detail.png", "/work/olan-wine.png", "/work/yingjiu-app.png"],
    year: "2026",
    sections: [
      {
        eyebrow: "Overview",
        title: "项目概述",
        body: "为高客单价商品建立更清晰的详情页叙事，让材质、工艺和品牌感顺序呈现。"
      },
      {
        eyebrow: "Challenge",
        title: "项目背景",
        body: "商品卖点多且信息密集，需要在视觉节奏中避免用户疲劳。"
      },
      {
        eyebrow: "Solution",
        title: "解决方案",
        body: "通过大图、局部细节、工艺说明和留白节奏控制，建立稳定的阅读路径。"
      },
      {
        eyebrow: "Outcome",
        title: "设计成果",
        body: "详情页结构更具秩序感，商品品质和购买理由能够被快速识别。"
      }
    ]
  },
  {
    slug: "tea-brand",
    title: "茶饮品牌视觉",
    category: "品牌设计 / 包装视觉",
    description: "以克制的品牌表达完成茶饮包装系统，让线下货架展示保持统一而安静。",
    cover: "/work/olan-wine.png",
    detailImages: ["/work/olan-wine.png", "/work/zhenlan-detail.png", "/work/yingjiu-app.png"],
    year: "2025",
    sections: [
      {
        eyebrow: "Overview",
        title: "项目概述",
        body: "以克制的品牌表达完成茶饮包装系统，让线下货架展示保持统一而安静。"
      },
      {
        eyebrow: "Challenge",
        title: "项目背景",
        body: "品牌需要从同质化包装中脱离出来，但不能依赖高饱和色彩制造噪音。"
      },
      {
        eyebrow: "Solution",
        title: "解决方案",
        body: "建立图形、纸张肌理和字号层级规则，使包装在不同规格中保持一致。"
      },
      {
        eyebrow: "Outcome",
        title: "设计成果",
        body: "品牌识别更稳定，适合后续延展到礼盒、单品和社交传播物料。"
      }
    ]
  },
  {
    slug: "editorial-system",
    title: "品牌画册系统",
    category: "版式设计 / 商业提案",
    description: "为品牌提案建立可复用的画册版式系统，兼顾展示性与信息密度。",
    cover: "/work/zhenlan-detail.png",
    detailImages: ["/work/zhenlan-detail.png", "/work/olan-wine.png", "/work/yingjiu-app.png"],
    year: "2025",
    sections: [
      {
        eyebrow: "Overview",
        title: "项目概述",
        body: "为品牌提案建立可复用的画册版式系统，兼顾展示性与信息密度。"
      },
      {
        eyebrow: "Challenge",
        title: "项目背景",
        body: "项目资料类型复杂，需要在图片、文字、参数和故事之间建立稳定秩序。"
      },
      {
        eyebrow: "Solution",
        title: "解决方案",
        body: "通过固定网格、图片比例和章节节奏，把不同信息纳入同一视觉系统。"
      },
      {
        eyebrow: "Outcome",
        title: "设计成果",
        body: "画册更像完整作品集而非模板页面，增强了商业提案的专业可信度。"
      }
    ]
  }
];

export const defaultProfile: Profile = {
  name: "何文",
  englishRole: "Visual Designer",
  chineseRole: "平面设计师 / 视觉设计师",
  slogan: "用视觉建立品牌记忆，用设计提升商业表达。",
  bio: "专注平面设计、视觉设计、电商视觉与 AIGC 视觉探索，擅长将商业目标转化为清晰、克制且具有质感的视觉系统。",
  experience: "2-3 年",
  skills: "Photoshop / Illustrator / Figma / AIGC",
  city: "长沙",
  direction: "品牌设计 / 电商视觉 / 商业海报",
  email: "hello@hewen.design",
  wechat: "hewen-design",
  collaboration: "可接受远程协作",
  portrait: "/work/yingjiu-app.png"
};

export const projects = defaultProjects;

export function getProject(slug: string) {
  return defaultProjects.find((project) => project.slug === slug);
}
