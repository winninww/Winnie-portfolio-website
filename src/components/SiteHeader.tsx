"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/portfolio", label: "作品集" },
  { href: "/about", label: "关于我" },
  { href: "/contact", label: "联系我" }
];

export function SiteHeader() {
  const pathname = usePathname();

  const isCurrent = (href: string) => {
  if (href === "/portfolio") {
    return pathname === "/portfolio" || pathname.startsWith("/case-study/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-line bg-paper/95">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="ml-[-40px] inline-flex min-h-11 items-center px-1 text-[18px] font-semibold leading-none text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafafa]"
        >
          HE WEN
        </Link>
        <nav aria-label="主导航" className="mr-[-40px] flex items-center gap-1 text-[12px] font-medium uppercase leading-none tracking-[0.08em] text-ink sm:gap-3">
          {links.map((link) => {
            const current = isCurrent(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-2 outline-none transition after:absolute after:bottom-1.5 after:left-2 after:right-2 after:h-px after:origin-left after:bg-ink after:transition-transform hover:text-ink focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa] ${
                  current ? "after:scale-x-100" : "text-graphite after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
