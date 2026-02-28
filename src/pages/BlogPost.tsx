import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowLeft, Calendar, User, Tag, Clock, Scale, BookOpen,
  BarChart2, Wrench, Newspaper, ChevronRight, FileText, HelpCircle,
  Shield, ExternalLink,
} from "lucide-react";
import type { BlogPost as BlogPostType } from "../utils/blogLoader";

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

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// ────────────────────────────────────────────────────────────────────────────
// MARKDOWN COMPONENT SETS
// ────────────────────────────────────────────────────────────────────────────

const DARK_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white my-6 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-white/10">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-amber-400 mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-300 leading-relaxed my-4 text-[15px]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="text-slate-400 italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-amber-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-amber-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-amber-400/60 bg-amber-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  code: ({ children, className }) => {
    if (className) {
      return <code className={`${className} text-amber-300 text-sm font-mono`}>{children}</code>;
    }
    return (
      <code className="bg-slate-700/70 text-amber-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-slate-800 border border-white/10 rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-white/10 shadow-lg">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-800">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="text-amber-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-slate-300 px-4 py-3 text-[13px]">{children}</td>,
};

const LIGHT_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 my-6 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-200">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-slate-600 leading-relaxed my-4 text-[15px]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-slate-900 font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="text-slate-500 italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 space-y-2">{children}</ol>,
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-3 text-slate-600 text-[15px]">
      {ordered ? (
        <span className="text-blue-600 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-blue-500 mt-1 shrink-0">✓</span>
      )}
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-blue-800 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  code: ({ children, className }) => {
    if (className) {
      return <code className={`${className} text-blue-700 text-sm font-mono`}>{children}</code>;
    }
    return (
      <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200">
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
  thead: ({ children }) => <thead className="bg-blue-600">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-blue-50 transition-colors even:bg-slate-50/60">{children}</tr>,
  th: ({ children }) => (
    <th className="text-white font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="text-slate-700 px-4 py-3 text-[13px]">{children}</td>,
};

const EMERALD_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-emerald-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-emerald-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-emerald-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-emerald-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-emerald-400/60 bg-emerald-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-emerald-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-emerald-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-emerald-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

const ORANGE_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-orange-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-orange-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-orange-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-orange-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-400/60 bg-orange-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-orange-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-orange-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-orange-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

const ROSE_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-rose-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-rose-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-rose-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-rose-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-rose-400/60 bg-rose-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-rose-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-rose-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-rose-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

const TEAL_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-teal-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-teal-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-teal-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-teal-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-400/60 bg-teal-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-teal-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-teal-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-teal-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

// ────────────────────────────────────────────────────────────────────────────
// SHARED SIDEBAR CARDS
// ────────────────────────────────────────────────────────────────────────────

function DarkSidebarMeta({ post, navigate }: { post: BlogPostType; navigate: (path: string) => void }) {
  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informacje</h4>
        <dl className="space-y-3">
          <div>
            <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Autor</dt>
            <dd className="text-slate-300 text-sm flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-400" />
              {post.author}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Data publikacji</dt>
            <dd className="text-slate-300 text-sm flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {formatDate(post.published_at)}
            </dd>
          </div>
          {post.category && (
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Kategoria</dt>
              <dd className="text-slate-300 text-sm">{post.category}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Czas czytania</dt>
            <dd className="text-slate-300 text-sm flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              ok. {readingTime(post.content)} min
            </dd>
          </div>
        </dl>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-amber-400" /> Tagi
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20 rounded-2xl p-5">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" /> Potrzebujesz pomocy?
        </h4>
        <p className="text-slate-400 text-sm mb-4">Nasi eksperci pomogą Ci spełnić wymagania CPR 2024/3110.</p>
        <button
          onClick={() => navigate("/services")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm"
        >
          Kontakt <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <MulticertBoxDark />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MULTICERT CREDIBILITY BOX — reusable, shown in all article sidebars
// ────────────────────────────────────────────────────────────────────────────

function MulticertBoxDark() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-amber-400" /> Wydawca
      </h4>
      <div className="space-y-2">
        <p className="text-slate-200 text-sm font-medium">Multicert Sp. z o.o.</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          Akredytowana jednostka certyfikująca. Certyfikacja ZKP wyrobów budowlanych, EPD dla betonu.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25 font-mono">
            PCA nr AC 210
          </span>
        </div>
        <a
          href="https://www.multicert.com.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors mt-2"
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
        <Shield className="w-3.5 h-3.5 text-blue-600" /> Wydawca
      </h4>
      <div className="space-y-2">
        <p className="text-slate-800 text-sm font-medium">Multicert Sp. z o.o.</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          Akredytowana jednostka certyfikująca. Certyfikacja ZKP wyrobów budowlanych, EPD dla betonu.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
            PCA nr AC 210
          </span>
        </div>
        <a
          href="https://www.multicert.com.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors mt-2"
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

type HeroConfig = {
  /** Pełne klasy Tailwind dla badge'a — muszą być literalami (Tailwind purging) */
  badgeClasses: string;
  /** Klasa koloru dla ikon w meta (User, Calendar, Clock) np. "text-amber-400" */
  iconAccentClass: string;
  /** Klasa hover dla przycisku "Powrót do bloga" np. "hover:text-amber-400" */
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
    <div className="relative overflow-hidden">
      {post.image_url && (
        <div className="absolute inset-0">
          <img
            src={post.image_url}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/90 ${bottomBg}`}
          />
        </div>
      )}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <button
          onClick={() => navigate("/blog")}
          className={`flex items-center gap-2 text-slate-400 ${buttonHoverClass} transition-colors mb-8 group text-sm`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Powrót do bloga
        </button>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClasses}`}
          >
            <BadgeIcon className="w-3 h-3" /> {badgeLabel}
          </span>
          {post.category && (
            <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
          {post.title}
        </h1>
        <p className="text-slate-400 mt-4 text-sm flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            ok. {readingTime(post.content)} min czytania
          </span>
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: REGULACJA — dark navy, legal/EU document style
// ────────────────────────────────────────────────────────────────────────────

function RegulacjaTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  const KEY_DATES = [
    { date: "7 sty 2025", label: "Wejście w życie CPR 2024/3110" },
    { date: "8 sty 2026", label: "Pełne stosowanie rozporządzenia" },
    { date: "8 sty 2027", label: "Sankcje (Art. 92) zaczną obowiązywać" },
    { date: "9 sty 2031", label: "Wygasają stare EAD" },
    { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-red-500/15 border border-red-500/30 text-red-400",
            iconAccentClass: "text-amber-400",
            buttonHoverClass: "hover:text-amber-400",
            badgeLabel: "Regulacja",
            BadgeIcon: Scale,
            bottomBg: "to-slate-950",
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" /> Harmonogram
                </h4>
                <ol className="space-y-3">
                  {KEY_DATES.map((item) => (
                    <li key={item.date} className="flex items-start gap-3">
                      <span className="text-amber-400 font-mono text-xs font-bold mt-0.5 shrink-0">{item.date}</span>
                      <span className="text-slate-400 text-xs">{item.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: PRZEWODNIK — light, step-by-step guide style
// ────────────────────────────────────────────────────────────────────────────

function PrzewodnikTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-amber-400/15 border border-amber-400/30 text-amber-400",
            iconAccentClass: "text-amber-400",
            buttonHoverClass: "hover:text-amber-400",
            badgeLabel: "Przewodnik",
            BadgeIcon: BookOpen,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              {/* TL;DR — streszczenie posta */}
              {post.excerpt && (
                <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5">
                  <h4 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> TL;DR
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3: ANALIZA — dark, data-driven, emerald accents
// ────────────────────────────────────────────────────────────────────────────

function AnalizaTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-emerald-400/15 border border-emerald-400/30 text-emerald-400",
            iconAccentClass: "text-emerald-400",
            buttonHoverClass: "hover:text-emerald-400",
            badgeLabel: "Analiza",
            BadgeIcon: BarChart2,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={EMERALD_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informacje</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Autor</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />{post.author}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Opublikowano</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />{formatDate(post.published_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Czas czytania</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />ok. {readingTime(post.content)} min
                    </dd>
                  </div>
                </dl>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tagi
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gradient-to-br from-emerald-400/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-5">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" /> Potrzebujesz pomocy?
                </h4>
                <p className="text-slate-400 text-sm mb-4">Przeprowadzimy analizę i doradzimy odpowiednie rozwiązanie.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-400 text-slate-900 font-semibold rounded-xl hover:bg-emerald-300 transition-colors text-sm"
                >
                  Kontakt <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <MulticertBoxDark />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4: TECHNICZNY — dark industrial, orange accents
// ────────────────────────────────────────────────────────────────────────────

function TechnicznyTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-orange-400/15 border border-orange-400/30 text-orange-400",
            iconAccentClass: "text-orange-400",
            buttonHoverClass: "hover:text-orange-400",
            badgeLabel: "Techniczny",
            BadgeIcon: Wrench,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ORANGE_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-orange-400/5 border border-orange-400/20 rounded-2xl p-5">
                <h4 className="text-orange-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Normy i wymagania
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Artykuł dotyczy wyrobów budowlanych objętych normami zharmonizowanymi na mocy CPR 2024/3110.
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300 border border-orange-400/20">
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
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5: AKTUALNOŚCI — magazine style, full-width hero, white content
// ────────────────────────────────────────────────────────────────────────────

function AktualnosciTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-rose-400/15 border border-rose-400/30 text-rose-400",
            iconAccentClass: "text-rose-400",
            buttonHoverClass: "hover:text-rose-400",
            badgeLabel: "Aktualności",
            BadgeIcon: Newspaper,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ROSE_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              {/* Co musisz wiedzieć */}
              {post.excerpt && (
                <div className="bg-rose-400/5 border border-rose-400/20 rounded-2xl p-5">
                  <h4 className="text-rose-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Co musisz wiedzieć
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DEFAULT TEMPLATE — generic dark template for untagged posts
// ────────────────────────────────────────────────────────────────────────────

function DefaultTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Powrót do bloga
          </button>
          {post.image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img src={post.image_url} alt={post.title} className="w-full h-64 object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 text-slate-400 text-sm mb-8 pb-6 border-b border-white/10 flex-wrap">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-400" />{post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" />{formatDate(post.published_at)}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" />ok. {readingTime(post.content)} min</span>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
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
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 animate-pulse">
          <div className="h-4 w-24 bg-slate-800 rounded mb-10" />
          <div className="h-12 w-2/3 bg-slate-800 rounded mb-4" />
          <div className="h-5 w-1/3 bg-slate-800 rounded mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 bg-slate-800 rounded ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-slate-800 rounded-2xl" />
              <div className="h-32 bg-slate-800 rounded-2xl" />
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

export default function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const slug = searchParams.get("slug");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Nieprawidłowy adres URL artykułu");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { getPostBySlug } = await import("../utils/blogLoader");
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

  if (loading) return <LoadingSkeleton />;

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-12 px-4">
            <h3 className="text-xl font-semibold text-white mb-2">{error ?? "Nie znaleziono artykułu"}</h3>
            <button
              onClick={() => navigate("/blog")}
              className="mt-4 px-6 py-3 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors"
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
  const canonicalUrl = `https://www.nowycpr.pl/blog?slug=${slug}`;
  const pageTitle = `${post.title} | NowyCPR.pl`;
  const description = post.excerpt || post.content.slice(0, 160).replace(/[#*`]/g, "").trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.image_url || "https://www.nowycpr.pl/og-default.jpg",
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
    "dateModified": post.published_at,
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
      {post.image_url && <meta property="og:image" content={post.image_url} />}
      <meta property="og:site_name" content="NowyCPR.pl" />
      <meta property="og:locale" content="pl_PL" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {post.image_url && <meta name="twitter:image" content={post.image_url} />}
      <meta name="article:published_time" content={post.published_at} />
      <meta name="article:author" content={post.author} />
      {Array.isArray(post.tags) && post.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );

  // Route to correct template
  switch (post.template) {
    case "regulacja":
      return <>{seoHelmet}<RegulacjaTemplate post={post} navigate={navigate} /></>;
    case "przewodnik":
      return <>{seoHelmet}<PrzewodnikTemplate post={post} navigate={navigate} /></>;
    case "analiza":
      return <>{seoHelmet}<AnalizaTemplate post={post} navigate={navigate} /></>;
    case "techniczny":
      return <>{seoHelmet}<TechnicznyTemplate post={post} navigate={navigate} /></>;
    case "aktualnosci":
      return <>{seoHelmet}<AktualnosciTemplate post={post} navigate={navigate} /></>;
    default:
      return <>{seoHelmet}<DefaultTemplate post={post} navigate={navigate} /></>;
  }
}
