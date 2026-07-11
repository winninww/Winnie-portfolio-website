"use client";

import { PortfolioImage } from "@/components/PortfolioImage";
import { usePortfolioContent } from "@/data/usePortfolioContent";

eexport default function AboutPageClient() {

  const { profile, loading } = usePortfolioContent();

  if (loading) {

    return <main className="min-h-screen bg-paper" />;

  }

  return (
    <main className="min-h-screen bg-paper px-5 pt-28 text-ink sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-[1120px] gap-12 border-t border-line pt-10 lg:grid-cols-[36%_1fr]">
        <div className="relative aspect-[4/5] bg-white">
          <PortfolioImage src={profile.portrait} alt={`${profile.name} 个人职业照`} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-contain" />
        </div>
        <div className="max-w-[620px]">
          <p className="text-[13px] text-graphite">{profile.englishRole}</p>
          <h1 className="mt-4 text-[40px] font-semibold leading-tight">{profile.name}</h1>
          <p className="mt-8 text-[15px] leading-8 text-graphite">
            {profile.slogan} {profile.bio}
          </p>
          <dl className="mt-12 grid gap-5 text-[14px] text-graphite sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">经验</dt>
              <dd className="mt-2">{profile.experience}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">城市</dt>
              <dd className="mt-2">{profile.city}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">技能</dt>
              <dd className="mt-2">{profile.skills}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">方向</dt>
              <dd className="mt-2">{profile.direction}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
