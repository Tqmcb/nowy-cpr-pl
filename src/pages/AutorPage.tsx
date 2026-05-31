import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  FileText,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthorBySlug } from "../data/authors";

export default function AutorPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const author = slug ? getAuthorBySlug(slug) : null;

  if (!author) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 text-lg mb-6">Nie znaleziono autora.</p>
            <Link
              to="/blog"
              className="text-[oklch(55% .22 27)] hover:text-[#1a3d6b] flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do bloga
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Helmet>
        <title>{author.name} – Autor | NowyCPR.pl</title>
        <meta name="description" content={author.shortBio} />
      </Helmet>

      <Header />

      <main className="flex-1 bg-white">
        {/* Hero — editorial */}
        <section className="relative pt-16 pb-12 md:pt-20 md:pb-16 bg-white">

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => navigate(-1)}
              className="editorial-kicker flex items-center gap-2 mt-6 mb-10 transition-colors hover:text-black"
              style={{ color: "oklch(60% .015 264)" }}
            >
              <ArrowLeft className="w-4 h-4" /> Wróć
            </button>

            <div className="flex items-baseline gap-6 mb-8">
              <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                <span className="editorial-kicker">Autor</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-2 flex justify-start">
                <img
                  src={`/images/authors/${author.slug}.jpg`}
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (!t.dataset.fb) { t.dataset.fb = "1"; t.src = `/images/authors/${author.slug}.svg`; }
                  }}
                  alt={`Autor ${author.name}`}
                  className="w-24 h-24 rounded-full object-cover"
                  style={{ border: "1px solid oklch(86% .012 264)" }}
                />
              </div>
              <div className="lg:col-span-10">
                <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] mb-3" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  {author.name}
                </h1>
                <p className="text-base md:text-lg italic font-serif" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>{author.shortTitle}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Bio */}
          <section>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
              {author.fullBio.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Roles */}
          <section>
            <h2 className="text-[oklch(20% .03 264)] font-semibold text-lg flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-[oklch(55% .22 27)]" /> Funkcje i role
            </h2>
            <ul className="space-y-2">
              {author.roles.map((role, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(55% .22 27)] mt-2 flex-shrink-0" />
                  {role}
                </li>
              ))}
            </ul>
          </section>

          {/* Expertise */}
          <section>
            <h2 className="text-[oklch(20% .03 264)] font-semibold text-lg flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[oklch(55% .22 27)]" /> Obszary ekspertyzy
            </h2>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((area, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-full bg-[oklch(55% .22 27)]/10 text-[oklch(55% .22 27)] border border-[oklch(55% .22 27)]/20"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          {author.education.length > 0 && (
          <section>
            <h2 className="text-[oklch(20% .03 264)] font-semibold text-lg flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-[oklch(55% .22 27)]" /> Wykształcenie
            </h2>
            <ul className="space-y-2">
              {author.education.map((edu, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                  {edu}
                </li>
              ))}
            </ul>
          </section>
          )}

          {/* Awards */}
          {author.awards.length > 0 && (
            <section>
              <h2 className="text-[oklch(20% .03 264)] font-semibold text-lg flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[oklch(55% .22 27)]" /> Nagrody i wyróżnienia
              </h2>
              <ul className="space-y-2">
                {author.awards.map((award, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-700 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[oklch(55% .22 27)] mt-2 flex-shrink-0" />
                    {award}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Publications */}
          {author.publications.length > 0 && (
            <section>
              <h2 className="text-[oklch(20% .03 264)] font-semibold text-lg flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[oklch(55% .22 27)]" /> Publikacje i opracowania
              </h2>
              <div className="space-y-4">
                {author.publications.map((pub, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 shadow-sm rounded-xl p-5"
                  >
                    <p className="text-[oklch(20% .03 264)] font-medium mb-1">
                      {pub.url ? (
                        <a
                          href={pub.url}
                          className="hover:text-[oklch(55% .22 27)] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </p>
                    <p className="text-[oklch(55% .22 27)] text-xs mb-2">{pub.year}</p>
                    <p className="text-slate-500 text-sm">{pub.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
