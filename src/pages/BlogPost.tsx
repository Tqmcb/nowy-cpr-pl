import { Children, isValidElement, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowLeft, Calendar, User, Tag, Clock, Scale, BookOpen,
  BarChart2, Wrench, Newspaper, ChevronRight, ChevronDown, FileText, HelpCircle,
  Shield, ExternalLink, CheckSquare, Building2, RefreshCw,
} from "lucide-react";
import type { BlogPost as BlogPostType } from "../utils/blogLoader";
import { getPostBySlug } from "../utils/blogLoader";
import { getAuthorSlug } from "../data/authors";
import type { ProductFamily } from "../utils/wyrobLoader";

// ────────────────────────────────────────────────────────────────────────────
// SHARED UTILITIES
// ────────────────────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ORGS = new Set(['Redakcja NowyCPR.pl', 'Multicert Sp. z o.o.', 'EPD Polska', 'NowyCPR.pl']);

function AuthorLink({ authorField, className }: { authorField: string; className?: string }) {
  const navigate = useNavigate();
  const segments = authorField.split(' | ').map(s => s.trim());
  const named = segments.filter(s => !ORGS.has(s));

  if (named.length === 0) {
    return <span className={className}>{segments[0]}</span>;
  }

  return (
    <>
      {named.map((name, i) => {
        const slug = getAuthorSlug(name);
        return (
          <span key={i} className="inline-flex items-center">
            {i > 0 && <span className="mx-1 opacity-40">·</span>}
            {slug ? (
              <button
                onClick={() => navigate(`/autor/${slug}`)}
                className={`hover:text-[oklch(55% .22 27)] underline underline-offset-2 transition-colors cursor-pointer ${className ?? ""}`}
              >
                {name}
              </button>
            ) : (
              <span className={className}>{name}</span>
            )}
          </span>
        );
      })}
    </>
  );
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement(node)) return textFromNode(node.props.children as ReactNode);
  return Children.toArray(node).map(textFromNode).join("");
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headingIdFromChildren(children: ReactNode) {
  return slugifyHeading(textFromNode(children));
}

function stripMarkdownInline(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+$/g, "")
    .trim();
}

function extractTableOfContents(content: string) {
  const items: Array<{ id: string; text: string }> = [];
  let inCodeBlock = false;

  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^##\s+(.+)$/.exec(line);
    if (!match) continue;

    const text = stripMarkdownInline(match[1]);
    const id = slugifyHeading(text);
    if (text && id) {
      items.push({ id, text });
    }
  }

  return items;
}

const GLOSSARY_TERMS = [
  { term: "DoP&C", explanation: "deklaracja właściwości użytkowych i zgodności", aliases: ["Declaration of Performance and Conformity"] },
  { term: "DoPC", explanation: "deklaracja właściwości użytkowych i zgodności" },
  { term: "AVCP", explanation: "stary system oceny i weryfikacji stałości właściwości użytkowych" },
  { term: "CPR", explanation: "rozporządzenie w sprawie wyrobów budowlanych" },
  { term: "hTS", explanation: "zharmonizowana specyfikacja techniczna" },
  { term: "AVS", explanation: "system oceny i weryfikacji stałości właściwości użytkowych" },
  { term: "FPC", explanation: "zakładowa kontrola produkcji", aliases: ["Factory Production Control"] },
  { term: "ZKP", explanation: "zakładowa kontrola produkcji" },
  { term: "EPD", explanation: "deklaracja środowiskowa wyrobu", aliases: ["Environmental Product Declaration"] },
  { term: "DPP", explanation: "cyfrowy paszport produktu" },
  { term: "GWP", explanation: "potencjał tworzenia efektu cieplarnianego" },
  { term: "GWR", explanation: "klasa emisyjna betonu", aliases: ["Global Warming Rating"] },
  { term: "LCA", explanation: "ocena cyklu życia", aliases: ["Life Cycle Assessment"] },
  { term: "EAD", explanation: "europejski dokument oceny" },
  { term: "ETA", explanation: "europejska ocena techniczna" },
  { term: "SVHC", explanation: "substancje wzbudzające szczególnie duże obawy" },
  { term: "REACH", explanation: "unijne rozporządzenie chemiczne" },
  { term: "GUNB", explanation: "Główny Urząd Nadzoru Budowlanego" },
  { term: "JN", explanation: "jednostka notyfikowana" },
  { term: "NTL", explanation: "notyfikowane laboratorium badawcze" },
  { term: "DWU", explanation: "deklaracja właściwości użytkowych" },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expandGlossaryTerms(content: string) {
  const seen = new Set<string>();
  let inCodeBlock = false;

  return content
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }

      const trimmedLine = line.trim();
      if (inCodeBlock || trimmedLine.startsWith("#") || trimmedLine.startsWith("|")) return line;

      let nextLine = line;
      for (const { term, explanation, aliases } of GLOSSARY_TERMS) {
        if (seen.has(term)) continue;

        const alias = aliases?.find((value) => nextLine.includes(`${term} (${value})`));
        if (alias) {
          nextLine = nextLine.replace(`${term} (${alias})`, `${term} (${alias}, ${explanation})`);
          seen.add(term);
          continue;
        }

        const pattern = new RegExp(`(^|[^\\p{L}\\p{N}&])(${escapeRegExp(term)})(?![\\p{L}\\p{N}&])`, "u");
        nextLine = nextLine.replace(pattern, (fullMatch, prefix: string, matchedTerm: string, offset: number, source: string) => {
          const termStart = offset + prefix.length;
          const rest = source.slice(termStart + matchedTerm.length);
          seen.add(term);

          if (prefix === "(" || /^\s*(?:\(|—|-)/.test(rest)) {
            return fullMatch;
          }

          return `${prefix}${matchedTerm} (${explanation})`;
        });
      }

      return nextLine;
    })
    .join("\n");
}

// ────────────────────────────────────────────────────────────────────────────
// MARKDOWN COMPONENT SETS
// ────────────────────────────────────────────────────────────────────────────

const DARK_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="font-serif text-[2.5rem] md:text-[3rem] leading-[1.05] mt-16 mb-8" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 id={headingIdFromChildren(children)} className="scroll-mt-24 font-serif text-[2rem] md:text-[2.4rem] leading-[1.1] mt-16 mb-6 pt-8" style={{ color: "oklch(20% .03 264)", fontWeight: 500, borderTop: "2px solid oklch(20% .03 264)" }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingIdFromChildren(children)} className="scroll-mt-24 font-serif italic text-[1.5rem] md:text-[1.75rem] leading-[1.2] mt-12 mb-4" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[17px] md:text-[18px] leading-[1.75]" style={{ color: "oklch(25% .02 264)", fontFeatureSettings: '"kern" 1, "liga" 1' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "oklch(20% .03 264)", fontWeight: 600, backgroundImage: "linear-gradient(transparent 60%, oklch(55% .22 27 / 0.15) 60%)" }}>
      {children}
    </strong>
  ),
  em: ({ children }) => <em className="font-serif italic" style={{ color: "oklch(55% .22 27)" }}>{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="underline underline-offset-[3px] decoration-[1.5px] transition-colors hover:opacity-70" style={{ color: "oklch(55% .22 27)", textDecorationColor: "oklch(55% .22 27 / 0.4)" }} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-6 space-y-3 pl-0">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 space-y-3 pl-0">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-baseline gap-4 text-[17px] leading-[1.65]" style={{ color: "oklch(25% .02 264)" }}>
      {ordered ? (
        <span className="editorial-numeral text-[1.4rem] min-w-[2rem] shrink-0" style={{ color: "oklch(55% .22 27)", fontWeight: 400 }}>
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>
      ) : (
        <span className="shrink-0 mt-[0.6em] w-3 h-[2px]" style={{ backgroundColor: "oklch(55% .22 27)" }} />
      )}
      <span className="flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-12 relative">
      <div className="absolute left-0 top-0 font-serif text-[5rem] leading-[0.5] -translate-x-2" style={{ color: "oklch(55% .22 27 / 0.3)", fontWeight: 500 }}>
        "
      </div>
      <div className="font-serif italic text-[1.6rem] md:text-[1.85rem] leading-[1.35] pl-10 pr-4 py-4" style={{ color: "oklch(20% .03 264)", fontWeight: 400, borderLeft: "3px solid oklch(55% .22 27)" }}>
        {children}
      </div>
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-0 h-[2px] w-16 mx-auto" style={{ backgroundColor: "oklch(55% .22 27)" }} />,
  code: ({ children, className }) => {
    if (className) {
      return <code className={`${className} text-sm font-mono`} style={{ color: "oklch(55% .22 27)" }}>{children}</code>;
    }
    return (
      <code className="px-1.5 py-0.5 text-[0.9em] font-mono" style={{ backgroundColor: "oklch(55% .22 27 / 0.08)", color: "oklch(55% .22 27)", borderRadius: "2px" }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="p-6 overflow-x-auto my-8 text-sm font-mono leading-relaxed text-slate-200" style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}>
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-10" style={{ borderTop: "2px solid oklch(20% .03 264)", borderBottom: "2px solid oklch(20% .03 264)" }}>
      <table className="w-full border-collapse text-[15px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ borderBottom: "1px solid oklch(20% .03 264)" }}>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: "1px solid oklch(92% .008 264)" }}>{children}</tr>,
  th: ({ children }) => (
    <th className="editorial-kicker text-left px-4 py-3 whitespace-nowrap" style={{ color: "oklch(20% .03 264)" }}>
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-4 text-[15px] leading-[1.55]" style={{ color: "oklch(25% .02 264)" }}>{children}</td>,
};

const LIGHT_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 my-6 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 id={headingIdFromChildren(children)} className="scroll-mt-24 text-2xl font-semibold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-200">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingIdFromChildren(children)} className="scroll-mt-24 text-lg font-semibold text-[oklch(55%_.22_27)] mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-600 leading-relaxed my-4 text-[15px]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-slate-900 font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="text-slate-500 italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-[oklch(55%_.22_27)] hover:text-[#1a3d6b] underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-3 text-slate-600 text-[15px]">
      {ordered ? (
        <span className="text-[oklch(55%_.22_27)] font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-[oklch(55%_.22_27)] mt-1 shrink-0">✓</span>
      )}
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[oklch(55%_.22_27/0.5)] bg-[oklch(55%_.22_27/0.05)] pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-[oklch(20%_.03_264)] italic text-[15px]">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  code: ({ children, className }) => {
    if (className) {
      return <code className={`${className} text-[oklch(55%_.22_27)] text-sm font-mono`}>{children}</code>;
    }
    return (
      <code className="bg-slate-100 text-[oklch(55%_.22_27)] px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-slate-800 text-slate-200 rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-md">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[oklch(20%_.03_264)]">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-[oklch(55%_.22_27/0.04)] transition-colors even:bg-slate-50/60">{children}</tr>,
  th: ({ children }) => (
    <th className="text-white font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-slate-700 px-4 py-3 text-[13px]">{children}</td>,
};

const EMERALD_COMPONENTS: Components = DARK_COMPONENTS;
const ORANGE_COMPONENTS: Components = DARK_COMPONENTS;
const ROSE_COMPONENTS: Components = DARK_COMPONENTS;
const TEAL_COMPONENTS: Components = DARK_COMPONENTS;

// ────────────────────────────────────────────────────────────────────────────
// SHARED SIDEBAR CARDS
// ────────────────────────────────────────────────────────────────────────────

function DarkSidebarMeta({ post, navigate }: { post: BlogPostType; navigate: (path: string) => void }) {
  return (
    <>
      <div className="pt-6" style={{ borderTop: "3px solid oklch(55% .22 27)" }}>
        <h4 className="editorial-kicker mb-5" style={{ color: "oklch(55% .22 27)" }}>Informacje</h4>
        <dl className="space-y-5">
          <div>
            <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Autor</dt>
            <dd className="font-serif italic text-base flex items-center gap-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
              <AuthorLink authorField={post.author} />
            </dd>
          </div>
          <div>
            <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Data publikacji</dt>
            <dd className="text-sm" style={{ color: "oklch(42% .02 264)" }}>
              {formatDate(post.published_at)}
            </dd>
          </div>
          {post.updated_at && (
            <div>
              <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Ostatnia aktualizacja</dt>
              <dd className="text-sm flex items-center gap-2" style={{ color: "oklch(55% .22 27)" }}>
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                {formatDate(post.updated_at)}
              </dd>
            </div>
          )}
          {post.reviewed && (
            <div>
              <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Zweryfikowano</dt>
              <dd className="text-sm flex items-center gap-2" style={{ color: "oklch(55% .14 155)" }}>
                <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                {formatDate(post.reviewed)}
              </dd>
            </div>
          )}
          {post.category && (
            <div>
              <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Kategoria</dt>
              <dd className="text-sm" style={{ color: "oklch(20% .03 264)" }}>{post.category}</dd>
            </div>
          )}
          <div>
            <dt className="editorial-kicker mb-1.5" style={{ color: "oklch(60% .015 264)" }}>Czas czytania</dt>
            <dd className="text-sm flex items-center gap-2" style={{ color: "oklch(42% .02 264)" }}>
              <Clock className="w-3.5 h-3.5" style={{ color: "oklch(55% .22 27)" }} />
              ok. {readingTime(post.content)} min
            </dd>
          </div>
        </dl>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
          <h4 className="editorial-kicker mb-4 flex items-center gap-2" style={{ color: "oklch(55% .22 27)" }}>
            <Tag className="w-3 h-3" /> Tagi
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="editorial-kicker px-2.5 py-1" style={{ color: "oklch(42% .02 264)", border: "1px solid oklch(86% .012 264)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {post.sources && post.sources.length > 0 && (
        <div className="pt-6" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
          <h4 className="editorial-kicker mb-4 flex items-center gap-2" style={{ color: "oklch(55% .22 27)" }}>
            <BookOpen className="w-3 h-3" /> Źródła
          </h4>
          <ul className="space-y-3">
            {post.sources.map((source, i) => {
              const [label, url] = source.includes('|') ? source.split('|') : [source, source];
              return (
                <li key={i}>
                  <a
                    href={url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-1.5 text-xs transition-colors leading-snug hover:opacity-70"
                    style={{ color: "oklch(55% .22 27)" }}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />
                    {label.trim()}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="bg-[oklch(55% .22 27)]/5 border border-[oklch(55% .22 27)]/20 rounded-2xl p-5">
        <h4 className="text-[oklch(20% .03 264)] font-semibold mb-2 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[oklch(55% .22 27)]" /> Potrzebujesz pomocy?
        </h4>
        <p className="text-slate-500 text-sm mb-4">Nasi eksperci pomogą Ci spełnić wymagania CPR 2024/3110.</p>
        <button
          onClick={() => navigate("/services")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[oklch(20% .03 264)] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors text-sm"
        >
          <span>Kontakt</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
      <MulticertBoxDark />
    </>
  );
}

function PostToc({ post }: { post: BlogPostType }) {
  const items = extractTableOfContents(post.content);
  if (items.length === 0) return null;

  return (
    <div className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <h4 className="editorial-kicker mb-4 flex items-center gap-2" style={{ color: "oklch(55% .22 27)" }}>
        <BookOpen className="w-3.5 h-3.5" />
        Spis treści
      </h4>
      <nav aria-label="Spis treści artykułu">
        <ol className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block border-l pl-3 py-1.5 text-sm leading-snug text-slate-700 font-medium transition-colors hover:text-[oklch(55%_.22_27)] hover:border-[oklch(55%_.22_27)]"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MULTICERT CREDIBILITY BOX — reusable, shown in all article sidebars
// ────────────────────────────────────────────────────────────────────────────

function MulticertBoxDark() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h4 className="text-[oklch(20% .03 264)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-[oklch(55% .22 27)]" /> Wydawca
      </h4>
      <div className="space-y-2">
        <p className="text-slate-800 text-sm font-medium">Multicert Sp. z o.o.</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          Akredytowana jednostka certyfikująca. Certyfikacja ZKP wyrobów budowlanych, EPD dla betonu.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55% .22 27)]/10 text-[oklch(55% .22 27)] border border-[oklch(55% .22 27)]/25 font-mono">
            PCA nr AC 210
          </span>
        </div>
        <a
          href="https://www.multicert.com.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[oklch(55% .22 27)] hover:text-[#1a3d6b] transition-colors mt-2"
        >
          <ExternalLink className="w-3 h-3" /> www.multicert.com.pl
        </a>
      </div>
    </div>
  );
}

function MulticertBoxLight() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <h4 className="text-slate-800 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" /> Wydawca
      </h4>
      <div className="space-y-2">
        <p className="text-slate-800 text-sm font-medium">Multicert Sp. z o.o.</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          Akredytowana jednostka certyfikująca. Certyfikacja ZKP wyrobów budowlanych, EPD dla betonu.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.1)] text-[oklch(55%_.22_27)] border border-[oklch(55%_.22_27/0.2)] font-mono">
            PCA nr AC 210
          </span>
        </div>
        <a
          href="https://www.multicert.com.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[oklch(55%_.22_27)] hover:text-[#1a3d6b] transition-colors mt-2"
        >
          <ExternalLink className="w-3 h-3" /> www.multicert.com.pl
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SHARED HERO — jednolity nagłówek/hero dla wszystkich szablonów
// Struktura: zdjęcie w tle (opacity-15) + gradient overlay + badge + tytuł + meta
// ────────────────────────────────────────────────────────────────────────────

type TemplateBaseProps = {
  post: BlogPostType;
  articleContent: string;
  navigate: (p: string) => void;
  bottomSection?: React.ReactNode;
};

type HeroConfig = {
  /** Pełne klasy Tailwind dla badge'a — muszą być literalami (Tailwind purging) */
  badgeClasses: string;
  /** Klasa koloru dla ikon w meta (User, Calendar, Clock) np. "text-[oklch(55% .22 27)]" */
  iconAccentClass: string;
  /** Klasa hover dla przycisku "Powrót do bloga" np. "hover:text-[oklch(55% .22 27)]" */
  buttonHoverClass: string;
  /** Etykieta badge'a np. "Regulacja", "Przewodnik" */
  badgeLabel: string;
  /** Ikona lucide-react do badge'a */
  BadgeIcon: React.ComponentType<{ className?: string }>;
  /** Kolor końcowy gradientu overlay (dopasuj do bg strony) — domyślnie "to-slate-900" */
  bottomBg?: string;
};

function SharedHero({
  post,
  navigate,
  config,
}: {
  post: BlogPostType;
  navigate: (p: string) => void;
  config: HeroConfig;
}) {
  const {
    badgeClasses,
    iconAccentClass,
    buttonHoverClass,
    badgeLabel,
    BadgeIcon,
    bottomBg = "to-slate-900",
  } = config;

  return (
    <section
      className="relative pt-14 pb-10 md:pt-16 md:pb-12 overflow-hidden"
      style={{ backgroundColor: "oklch(20% .03 264)" }}
    >
      {/* Photo background */}
      {post.image_url && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${post.image_url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {/* Dark overlay — readability */}
      {post.image_url && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(20% .03 264 / 0.55) 0%, oklch(20% .03 264 / 0.92) 100%)",
          }}
        />
      )}

      {/* Masthead rules — white on dark */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mt-5 mb-6 text-white/60">
          <button onClick={() => navigate("/")} className="uppercase tracking-[0.12em] font-semibold transition-colors hover:text-white">Strona główna</button>
          <span className="opacity-50">›</span>
          <button onClick={() => navigate("/blog")} className="uppercase tracking-[0.12em] font-semibold transition-colors hover:opacity-80" style={{ color: "oklch(75% .15 27)" }}>05 · Aktualności</button>
          {post.category && (<>
            <span className="opacity-50">›</span>
            <span className="uppercase tracking-[0.12em] font-semibold text-white">{post.category}</span>
          </>)}
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <span className="editorial-numeral text-3xl" style={{ color: "oklch(75% .15 27)", fontWeight: 300 }}>05</span>
          <div className="h-[2px] w-8" style={{ backgroundColor: "oklch(75% .15 27)" }} />
          <span className="editorial-kicker text-white/70">{badgeLabel}</span>
        </div>

        <h1 className="font-serif text-[2rem] md:text-[2.75rem] lg:text-[3.5rem] leading-[1.08] max-w-4xl mb-6 text-white" style={{ fontWeight: 500 }}>
          {post.title}
        </h1>

        <div className="flex items-center gap-5 flex-wrap pt-4 border-t border-white/20">
          <span className="editorial-kicker flex items-center gap-2 text-white">
            <User className="w-3.5 h-3.5" />
            <AuthorLink authorField={post.author} />
          </span>
          <span className="editorial-kicker flex items-center gap-2 text-white/60">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)}
          </span>
          <span className="editorial-kicker flex items-center gap-2 text-white/60">
            <Clock className="w-3.5 h-3.5" />
            ok. {readingTime(post.content)} min
          </span>
        </div>
      </div>

      {/* Scroll hint — brand-red indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-pulse">
        <span className="editorial-kicker text-white/60" style={{ fontSize: "0.65rem" }}>Czytaj</span>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: REGULACJA — dark navy, legal/EU document style
// ────────────────────────────────────────────────────────────────────────────

function RegulacjaTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  const KEY_DATES = [
    { date: "7 sty 2025", label: "Wejście w życie CPR 2024/3110" },
    { date: "8 sty 2026", label: "Pełne stosowanie rozporządzenia" },
    { date: "8 sty 2027", label: "Sankcje (Art. 92) zaczną obowiązywać" },
    { date: "9 sty 2031", label: "Wygasają stare EAD" },
    { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
  ];
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-red-100 border border-red-300 text-red-700",
            iconAccentClass: "text-[oklch(55% .22 27)]",
            buttonHoverClass: "hover:text-[oklch(55% .22 27)]",
            badgeLabel: "Regulacja",
            BadgeIcon: Scale,
            bottomBg: "to-slate-50",
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="text-[oklch(20% .03 264)] font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[oklch(55% .22 27)]" /> Harmonogram
                </h4>
                <ol className="space-y-3">
                  {KEY_DATES.map((item) => (
                    <li key={item.date} className="flex items-start gap-3">
                      <span className="text-[oklch(55% .22 27)] font-mono text-xs font-bold mt-0.5 shrink-0">{item.date}</span>
                      <span className="text-slate-500 text-xs">{item.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: PRZEWODNIK — light, step-by-step guide style
// ────────────────────────────────────────────────────────────────────────────

function PrzewodnikTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-[oklch(55% .22 27)]/10 border border-[oklch(55% .22 27)]/30 text-[oklch(55% .22 27)]",
            iconAccentClass: "text-[oklch(55% .22 27)]",
            buttonHoverClass: "hover:text-[oklch(55% .22 27)]",
            badgeLabel: "Przewodnik",
            BadgeIcon: BookOpen,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              {/* TL;DR — streszczenie posta */}
              {post.excerpt && (
                <div className="bg-[oklch(55% .22 27)]/5 border border-[oklch(55% .22 27)]/20 rounded-2xl p-5">
                  <h4 className="text-[oklch(55% .22 27)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> W skrócie
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3: ANALIZA — dark, data-driven, emerald accents
// ────────────────────────────────────────────────────────────────────────────

function AnalizaTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.25)] text-[oklch(55%_.22_27)]",
            iconAccentClass: "text-[oklch(55%_.22_27)]",
            buttonHoverClass: "hover:text-[oklch(55%_.22_27)]",
            badgeLabel: "Analiza",
            BadgeIcon: BarChart2,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={EMERALD_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="text-[oklch(20% .03 264)] font-semibold text-sm uppercase tracking-wider mb-4">Informacje</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Autor</dt>
                    <dd className="text-slate-700 text-sm flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" />
                      <AuthorLink authorField={post.author} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Opublikowano</dt>
                    <dd className="text-slate-700 text-sm flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" />{formatDate(post.published_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Czas czytania</dt>
                    <dd className="text-slate-700 text-sm flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" />ok. {readingTime(post.content)} min
                    </dd>
                  </div>
                  {post.reviewed && (
                    <div>
                      <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Zweryfikowano</dt>
                      <dd className="text-sm flex items-center gap-2 text-[oklch(55%_.22_27)] font-medium">
                        <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                        {formatDate(post.reviewed)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-[oklch(20% .03 264)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" /> Tagi
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[oklch(55%_.22_27/0.08)] text-[oklch(55%_.22_27)] border border-[oklch(55%_.22_27/0.18)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {post.sources && post.sources.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-[oklch(20% .03 264)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[oklch(55%_.22_27)]" /> Źródła
                  </h4>
                  <ul className="space-y-2">
                    {post.sources.map((source, i) => {
                      const [label, url] = source.includes('|') ? source.split('|') : [source, source];
                      return (
                        <li key={i}>
                          <a href={url.trim()} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-1.5 text-xs text-[oklch(55%_.22_27)] hover:text-[#1a3d6b] transition-colors leading-snug">
                            <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />{label.trim()}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] rounded-2xl p-5">
                <h4 className="text-[oklch(20% .03 264)] font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[oklch(55%_.22_27)]" /> Potrzebujesz pomocy?
                </h4>
                <p className="text-slate-500 text-sm mb-4">Przeprowadzimy analizę i doradzimy odpowiednie rozwiązanie.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[oklch(20% .03 264)] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors text-sm"
                >
                  Kontakt <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
              <MulticertBoxDark />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4: TECHNICZNY — dark industrial, orange accents
// ────────────────────────────────────────────────────────────────────────────

function TechnicznyTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.25)] text-[oklch(55%_.22_27)]",
            iconAccentClass: "text-[oklch(55%_.22_27)]",
            buttonHoverClass: "hover:text-[oklch(55%_.22_27)]",
            badgeLabel: "Techniczny",
            BadgeIcon: Wrench,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ORANGE_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              <div className="bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] rounded-2xl p-5">
                <h4 className="text-[oklch(55%_.22_27)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Normy i wymagania
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Artykuł dotyczy wyrobów budowlanych objętych normami zharmonizowanymi na mocy CPR 2024/3110.
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.08)] text-[oklch(55%_.22_27)] border border-[oklch(55%_.22_27/0.18)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5: AKTUALNOŚCI — magazine style, full-width hero, white content
// ────────────────────────────────────────────────────────────────────────────

function AktualnosciTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.25)] text-[oklch(55%_.22_27)]",
            iconAccentClass: "text-[oklch(55%_.22_27)]",
            buttonHoverClass: "hover:text-[oklch(55%_.22_27)]",
            badgeLabel: "Aktualności",
            BadgeIcon: Newspaper,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ROSE_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              {/* Co musisz wiedzieć */}
              {post.excerpt && (
                <div className="bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] rounded-2xl p-5">
                  <h4 className="text-[oklch(55%_.22_27)] font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Co musisz wiedzieć
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6: PRAKTYCZNY — dark teal, action-oriented, checklist sidebar
// ────────────────────────────────────────────────────────────────────────────

function PraktycznyTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  const CHECKLIST = [
    "Sprawdź wymagania CPR dla swojego wyrobu",
    "Zidentyfikuj właściwy system AVS",
    "Skontaktuj się z jednostką notyfikowaną",
    "Przygotuj dokumentację techniczną",
    "Wystaw Deklarację Właściwości Użytkowych (DoP&C)",
    "Umieść oznakowanie CE na wyrobie",
  ];
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.25)] text-[oklch(55%_.22_27)]",
            iconAccentClass: "text-[oklch(55%_.22_27)]",
            buttonHoverClass: "hover:text-[oklch(55%_.22_27)]",
            badgeLabel: "Praktyczny",
            BadgeIcon: CheckSquare,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={TEAL_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              {/* Lista kontrolna */}
              <div className="bg-[oklch(55%_.22_27/0.05)] border border-[oklch(55%_.22_27/0.2)] rounded-2xl p-5">
                <h4 className="text-[oklch(55%_.22_27)] font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" /> Lista kontrolna
                </h4>
                <ol className="space-y-2.5">
                  {CHECKLIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[oklch(55%_.22_27)] font-mono text-xs font-bold mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="text-slate-500 text-xs leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DEFAULT TEMPLATE — generic dark template for untagged posts
// ────────────────────────────────────────────────────────────────────────────

function DefaultTemplate({ post, articleContent, navigate, bottomSection }: TemplateBaseProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      <main className="flex-grow pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "",
            iconAccentClass: "text-[oklch(55% .22 27)]",
            buttonHoverClass: "hover:text-[oklch(55% .22 27)]",
            badgeLabel: "Artykuł",
            BadgeIcon: Newspaper,
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <article className="prose-editorial max-w-[680px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {articleContent}
              </ReactMarkdown>
            </article>
            <aside className="space-y-8">
              <PostToc post={post} />
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
        {bottomSection}
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON
// ────────────────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded mb-10" />
          <div className="h-12 w-2/3 bg-slate-200 rounded mb-4" />
          <div className="h-5 w-1/3 bg-slate-200 rounded mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 bg-slate-200 rounded ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="h-32 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// RELATED WYROBY SECTION — shown at the bottom of all blog post templates
// ────────────────────────────────────────────────────────────────────────────

function RelatedWyrobySection({ wyroby }: { wyroby: ProductFamily[] }) {
  if (wyroby.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-xl font-semibold text-[oklch(20% .03 264)] mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[oklch(55% .22 27)]" />
          Powiązane wyroby budowlane
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wyroby.map((w) => (
            <Link
              key={w.slug}
              to={`/wyrob/${w.slug}/`}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-[oklch(55% .22 27)]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(55% .22 27)]/10 border border-[oklch(55% .22 27)]/20 text-[oklch(55% .22 27)] font-bold">
                  #{w.family_number}
                </span>
                <span className="text-xs text-slate-500">{w.category}</span>
              </div>
              <h3 className="text-sm font-semibold text-[oklch(20% .03 264)] group-hover:text-[oklch(55% .22 27)] transition-colors line-clamp-2">
                {w.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{w.excerpt}</p>
              {w.normy && w.normy.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {w.normy.slice(0, 3).map((n) => (
                    <span key={n} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                      {n}
                    </span>
                  ))}
                  {w.normy.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{w.normy.length - 3}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ slug?: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWyroby, setRelatedWyroby] = useState<ProductFamily[]>([]);

  // Support both /blog/:slug (new, SEO-friendly) and /blog-post?slug= (legacy)
  const searchParams = new URLSearchParams(location.search);
  const slug = params.slug ?? searchParams.get("slug");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Nieprawidłowy adres URL artykułu");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const foundPost = await getPostBySlug(slug);
        if (foundPost) {
          setPost({ ...foundPost, tags: Array.isArray(foundPost.tags) ? foundPost.tags : [] });
          setError(null);
        } else {
          setError("Nie znaleziono artykułu");
        }
      } catch (err) {
        console.error("Błąd pobierania artykułu:", err);
        setError("Wystąpił błąd podczas ładowania artykułu");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Load related wyroby when post is available
  useEffect(() => {
    if (!post) return;
    const fetchRelatedWyroby = async () => {
      try {
        const { getAllWyroby } = await import("../utils/wyrobLoader");
        const { findRelatedWyroby } = await import("../utils/crossLinkUtils");
        const allWyroby = await getAllWyroby();
        setRelatedWyroby(findRelatedWyroby(post, allWyroby, 3));
      } catch (err) {
        console.error("Error loading related wyroby:", err);
      }
    };
    fetchRelatedWyroby();
  }, [post]);

  if (loading) return <LoadingSkeleton />;

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-12 px-4">
            <h3 className="text-xl font-semibold text-[oklch(20% .03 264)] mb-2">{error ?? "Nie znaleziono artykułu"}</h3>
            <button
              onClick={() => navigate("/blog")}
              className="mt-4 px-6 py-3 bg-[oklch(20% .03 264)] text-white font-semibold rounded-xl hover:bg-[#1a3d6b] transition-colors"
            >
              Wróć do bloga
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // SEO / GEO meta tags
  const canonicalUrl = `https://www.nowycpr.pl/blog/${slug}/`;
  const pageTitle = `${post.title} | NowyCPR.pl`;
  const description = post.excerpt || post.content.slice(0, 160).replace(/[#*`]/g, "").trim();
  const modifiedDate = post.updated_at || post.reviewed || post.published_at;
  const imageUrl = post.image_url
    ? (post.image_url.startsWith("http") ? post.image_url : `https://www.nowycpr.pl${post.image_url}`)
    : "https://www.nowycpr.pl/og-image.jpg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": post.author,
      "worksFor": {
        "@type": "Organization",
        "name": "Multicert Sp. z o.o.",
        "url": "https://www.nowycpr.pl"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "NowyCPR.pl — Multicert Sp. z o.o.",
      "url": "https://www.nowycpr.pl",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.nowycpr.pl/logo.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": Array.isArray(post.tags) ? post.tags.join(", ") : "",
    "articleSection": post.category || "CPR 2024",
    "inLanguage": "pl-PL",
    "about": {
      "@type": "Thing",
      "name": "Rozporządzenie CPR (EU) 2024/3110",
      "sameAs": "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R3110"
    }
  };

  const seoHelmet = (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="NowyCPR.pl" />
      <meta property="og:locale" content="pl_PL" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="article:published_time" content={post.published_at} />
      <meta name="article:modified_time" content={modifiedDate} />
      <meta property="article:section" content={post.category || "CPR 2024"} />
      <meta name="article:author" content={post.author} />
      {Array.isArray(post.tags) && post.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );

  // Shared related wyroby section passed to all templates
  const relatedSection = <RelatedWyrobySection wyroby={relatedWyroby} />;
  const articleContent = expandGlossaryTerms(post.content);

  const templateProps: TemplateBaseProps = { post, articleContent, navigate, bottomSection: relatedSection };

  // Route to correct template
  switch (post.template) {
    case "regulacja":
      return <>{seoHelmet}<RegulacjaTemplate {...templateProps} /></>;
    case "przewodnik":
      return <>{seoHelmet}<PrzewodnikTemplate {...templateProps} /></>;
    case "analiza":
      return <>{seoHelmet}<AnalizaTemplate {...templateProps} /></>;
    case "techniczny":
      return <>{seoHelmet}<TechnicznyTemplate {...templateProps} /></>;
    case "aktualnosci":
      return <>{seoHelmet}<AktualnosciTemplate {...templateProps} /></>;
    case "praktyczny":
      return <>{seoHelmet}<PraktycznyTemplate {...templateProps} /></>;
    default:
      return <>{seoHelmet}<DefaultTemplate {...templateProps} /></>;
  }
}
