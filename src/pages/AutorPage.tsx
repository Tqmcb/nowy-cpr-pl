import { useParams, useNavigate } from "react-router-dom";
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
            <button
              onClick={() => navigate("/blog")}
              className="text-[#1a56a0] hover:text-[#1a3d6b] flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do bloga
            </button>
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

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-[#1a56a0] flex items-center gap-2 text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Wróć
            </button>

            <div className="flex items-start gap-6">
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-[#1a56a0]/10 border-2 border-[#1a56a0]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-[#1a56a0]">
                  {author.name
                    .split(" ")
                    .filter((w) => /^[A-ZŁŚÓĄĘŹŻĆŃ]/.test(w))
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
              </div>

              <div>
                <p className="text-[#1a56a0] text-sm font-medium uppercase tracking-wider mb-1">
                  Autor
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-[#0d2137] leading-tight mb-2">
                  {author.name}
                </h1>
                <p className="text-slate-500 text-base">{author.shortTitle}</p>
              </div>
            </div>
          </div>
        </div>

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
            <h2 className="text-[#0d2137] font-semibold text-lg flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-[#1a56a0]" /> Funkcje i role
            </h2>
            <ul className="space-y-2">
              {author.roles.map((role, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] mt-2 flex-shrink-0" />
                  {role}
                </li>
              ))}
            </ul>
          </section>

          {/* Expertise */}
          <section>
            <h2 className="text-[#0d2137] font-semibold text-lg flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#1a56a0]" /> Obszary ekspertyzy
            </h2>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((area, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-full bg-[#1a56a0]/10 text-[#1a56a0] border border-[#1a56a0]/20"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-[#0d2137] font-semibold text-lg flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-[#1a56a0]" /> Wykształcenie
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

          {/* Awards */}
          {author.awards.length > 0 && (
            <section>
              <h2 className="text-[#0d2137] font-semibold text-lg flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#1a56a0]" /> Nagrody i wyróżnienia
              </h2>
              <ul className="space-y-2">
                {author.awards.map((award, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-700 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] mt-2 flex-shrink-0" />
                    {award}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Publications */}
          {author.publications.length > 0 && (
            <section>
              <h2 className="text-[#0d2137] font-semibold text-lg flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#1a56a0]" /> Publikacje i opracowania
              </h2>
              <div className="space-y-4">
                {author.publications.map((pub, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 shadow-sm rounded-xl p-5"
                  >
                    <p className="text-[#0d2137] font-medium mb-1">
                      {pub.url ? (
                        <a
                          href={pub.url}
                          className="hover:text-[#1a56a0] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </p>
                    <p className="text-[#1a56a0] text-xs mb-2">{pub.year}</p>
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
