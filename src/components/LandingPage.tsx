"use client";

import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();

  return (
    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-paper
      text-ink
      "
    >

      {/* 中央主体 */}
      <section
        className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        px-6
        text-center
        "
      >

        {/* 英文名字 */}
        <h1
          className="
          text-[clamp(64px,8vw,120px)]
          font-light
          tracking-[0.14em]
          leading-none
          "
        >
          HE WEN
        </h1>


        {/* 职业 */}
        <p
          className="
          mt-8
          text-[14px]
          font-light
          tracking-[0.16em]
          text-graphite
          "
        >
          平面与视觉设计师
        </p>


        {/* 简介 */}
        <p
          className="
          mt-8
          max-w-[460px]
          text-[14px]
          font-light
          leading-[2]
          tracking-[0.06em]
          text-graphite
          "
        >
          专注品牌视觉、电商视觉与商业内容设计，
          <br />
          将商业策略转化为具有传播力的视觉系统。
        </p>


        {/* 进入作品集 */}
        <button
          onClick={() => router.push("/portfolio")}
          className="
          group
          mt-12
          flex
          items-center
          gap-8
          text-[13px]
          font-light
          tracking-[0.18em]
          "
        >

          <span
            className="
            border-b
            border-black
            pb-2
            "
          >
            进入作品集
          </span>


          <span
            className="
            text-[28px]
            font-light
            transition-transform
            duration-300
            group-hover:translate-x-2
            "
          >
            →
          </span>

        </button>


      </section>



      {/* 左下版权 */}
      <footer
        className="
        absolute
        bottom-[40px]
        left-[50px]
        text-[11px]
        font-light
        tracking-[0.08em]
        "
      >
        © 2026 HE WEN. ALL RIGHTS RESERVED.
      </footer>


    </main>
  );
}