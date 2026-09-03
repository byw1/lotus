"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { primaryNav, site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * The mobile menu is a plain conditional, not a portal or a focus trap
 * library: it renders inside the header, the toggle keeps focus, and Escape
 * closes it. Anything more elaborate is a lot of code for a seven-item nav.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on navigation, so it does not stay open behind the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 sm:h-18 sm:px-8">
        <Link href="/" className="rounded-md text-[13px] leading-tight font-medium">
          <span className="block">Los Angeles</span>
          <span className="text-fg-muted block">Lotus Festival</span>
          <span className="sr-only">— home</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors duration-200",
                  active ? "text-fg bg-surface" : "text-fg-muted hover:text-fg hover:bg-surface",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/get-involved"
            className="bg-vermilion hover:bg-vermilion-deep hidden h-10 items-center rounded-full px-5 text-sm font-medium text-white transition-colors duration-200 sm:inline-flex"
          >
            Get involved
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="text-fg-muted hover:text-fg hover:bg-surface inline-flex size-10 items-center justify-center rounded-full transition-colors duration-200 md:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-line bg-bg border-t px-6 pt-3 pb-6 md:hidden"
        >
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="border-line flex flex-col gap-0.5 border-b py-4"
                >
                  <span className="text-[15px]">{item.label}</span>
                  {item.description ? (
                    <span className="text-fg-muted text-[13px]">{item.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${site.contact.email}`}
            className="text-fg-muted mt-5 inline-block text-[13px]"
          >
            {site.contact.email}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
