import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "./Container";
import { ChevronRight } from "lucide-react";
import { getPageMeta, getSection, PAGES, SECTIONS, type SectionKey } from "../data/siteStructure";

interface PageHeaderProps {
  // Override for cases where path-based lookup isn't enough
  sectionKey?: SectionKey;
  title?: string;
  titleAccent?: string;
  description?: string;
  label?: string;
  children?: React.ReactNode; // slot for secondary content (filters, CTA, etc.)
}

export function PageHeader({
  sectionKey,
  title,
  titleAccent,
  description,
  label,
  children,
}: PageHeaderProps) {
  const location = useLocation();
  const pageMeta = getPageMeta(location.pathname);
  const resolvedSection = sectionKey ? SECTIONS[sectionKey] : getSection(location.pathname);
  const resolvedTitle = title ?? pageMeta?.title ?? pageMeta?.label ?? "";
  const resolvedAccent = titleAccent ?? pageMeta?.titleAccent;
  const resolvedDescription = description ?? pageMeta?.description;
  const resolvedLabel = label ?? pageMeta?.label;

  return (
    <section className="relative pt-6 pb-5 md:pt-8 md:pb-7 bg-white">
      {/* Masthead top rules */}

      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mb-5" style={{ color: "oklch(60% .015 264)" }}>
            <Link to="/" className="transition-colors hover:text-black uppercase tracking-[0.12em] font-semibold whitespace-nowrap">Strona główna</Link>
            {resolvedSection && (
              <>
                <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                <span className="min-w-0 break-words uppercase tracking-[0.12em] font-semibold" style={{ color: "oklch(55% .22 27)" }}>
                  {resolvedSection.num} · {resolvedSection.label}
                </span>
              </>
            )}
            {resolvedLabel && (
              <>
                <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                <span className="min-w-0 break-words uppercase tracking-[0.12em] font-semibold" style={{ color: "oklch(20% .03 264)" }}>{resolvedLabel}</span>
              </>
            )}
          </nav>

          {/* Section numeral + kicker */}
          {resolvedSection && (
            <div className="flex items-baseline gap-4 mb-4">
              <span className="editorial-numeral text-5xl md:text-6xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                {resolvedSection.num}
              </span>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                <span className="editorial-kicker">{resolvedSection.label}</span>
              </div>
            </div>
          )}

          {/* Title + description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-end mb-5">
            <h1 className="lg:col-span-8 min-w-0 font-serif text-[2.2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.02] break-words" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
              {resolvedTitle}
              {resolvedAccent && (
                <>
                  {" "}
                  <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>{resolvedAccent}</span>
                </>
              )}
            </h1>
            {resolvedDescription && (
              <p className="lg:col-span-4 min-w-0 text-base md:text-lg leading-[1.6] break-words" style={{ color: "oklch(42% .02 264)" }}>
                {resolvedDescription}
              </p>
            )}
          </div>

          {/* Optional slot for filters, CTA, etc. */}
          {children && (
            <div className="pt-3" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
              {children}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

// Sibling pages navigation — rendered on bottom of every sub-page
export function RelatedPages() {
  const location = useLocation();
  const pageMeta = getPageMeta(location.pathname);
  if (!pageMeta) return null;

  const siblings = PAGES.filter(p => p.section === pageMeta.section && p.path !== pageMeta.path);
  const section = SECTIONS[pageMeta.section];
  if (siblings.length === 0) return null;

  return (
    <section className="py-12 md:py-14 bg-white" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline gap-4 mb-6 pb-3" style={{ borderBottom: "2px solid oklch(20% .03 264)" }}>
            <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
              {section.num}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
              Dalej w sekcji <span className="italic" style={{ color: "oklch(55% .22 27)" }}>{section.label}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
            {siblings.map((p, idx) => (
              <Link
                key={p.path}
                to={p.path}
                className="group block p-5 md:p-6 transition-all hover:bg-slate-50"
                style={{
                  borderRight: idx % 3 !== 2 ? "1px solid oklch(92% .008 264)" : "none",
                  borderBottom: "1px solid oklch(92% .008 264)",
                }}
              >
                <div className="editorial-kicker mb-3" style={{ color: "oklch(55% .22 27)" }}>
                  {section.num} · {section.label}
                </div>
                <h4 className="font-serif text-xl md:text-2xl leading-[1.2] mb-2 group-hover:italic transition-all" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  {p.label}
                </h4>
                {p.description && (
                  <p className="text-sm leading-[1.55] mb-4 line-clamp-2" style={{ color: "oklch(42% .02 264)" }}>
                    {p.description}
                  </p>
                )}
                <div className="editorial-kicker flex items-center group-hover:gap-3 transition-all" style={{ color: "oklch(20% .03 264)" }}>
                  <span>Przejdź</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 editorial-kicker" style={{ color: "oklch(60% .015 264)" }}>
            <Link to="/" className="transition-colors hover:text-black flex items-center gap-2">
              <ChevronRight className="w-3 h-3 rotate-180" />
              Wróć na stronę główną
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
