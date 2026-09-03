import Link from "next/link";

import { Rule } from "@/components/ui/layout";
import { footerNav, site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-line bg-bg-sunken border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-[clamp(1.5rem,3vw,2rem)] leading-tight">
              {site.editionOrdinal} Los Angeles
              <br />
              Lotus Festival
            </p>
            <p className="text-fg-muted mt-4 max-w-[38ch] text-sm leading-relaxed">
              {site.venue.name} · {site.venue.address}
              <br />
              <time dateTime="2027-07">{site.dates.display}</time> · {site.dates.detail}
            </p>
            <a
              href={`mailto:${site.contact.email}`}
              className="text-fg hover:text-gold mt-5 inline-block rounded text-sm transition-colors duration-200"
            >
              {site.contact.email}
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="eyebrow font-sans">{group.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-fg-muted hover:text-fg rounded text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Rule className="my-12" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[62ch]">
            <p className="text-fg-muted text-[13px] leading-relaxed">
              Presented by the City of Los Angeles Department of Recreation and Parks with{" "}
              {site.nonprofit.legalName}, a {site.nonprofit.status} (EIN {site.nonprofit.ein}). Held
              at Echo Park Lake since 1972.
            </p>
            <p className="text-fg-subtle mt-3 text-[13px]">
              © {year} {site.nonprofit.legalName}. This website is{" "}
              <a
                href={site.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg underline underline-offset-4 transition-colors duration-200"
              >
                open source
              </a>
              .
            </p>
          </div>

          <nav aria-label="Social" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {(
              [
                ["Instagram", site.social.instagram],
                ["Facebook", site.social.facebook],
                ["LinkedIn", site.social.linkedin],
              ] as const
            ).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg rounded text-[13px] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
