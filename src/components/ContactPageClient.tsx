"use client";

import { usePortfolioContent } from "@/data/usePortfolioContent";

export function ContactPageClient() {
  const { profile, loading } = usePortfolioContent();

  if (loading) {
    return <main className="min-h-screen bg-paper" />;
  }

  return (
    <main className="min-h-screen bg-paper px-5 pt-28 text-ink sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[900px] border-t border-line pt-10">
        <p className="text-[13px] uppercase tracking-[0.08em] text-graphite">联系我</p>
        <h1 className="mt-5 text-[40px] font-semibold leading-tight">联系与合作</h1>
        <dl className="mt-14 grid gap-8 text-[15px] text-graphite sm:grid-cols-2">
          <div className="border-t border-line pt-5">
            <dt className="font-semibold text-ink">邮箱</dt>
            <dd className="mt-3">{profile.email}</dd>
          </div>
          <div className="border-t border-line pt-5">
            <dt className="font-semibold text-ink">微信</dt>
            <dd className="mt-3">{profile.wechat}</dd>
          </div>
          <div className="border-t border-line pt-5">
            <dt className="font-semibold text-ink">城市</dt>
            <dd className="mt-3">{profile.city}</dd>
          </div>
          <div className="border-t border-line pt-5">
            <dt className="font-semibold text-ink">合作</dt>
            <dd className="mt-3">{profile.collaboration}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
