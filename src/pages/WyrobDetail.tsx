import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Building2, ChevronRight, Calendar, ArrowLeft, FileText, HelpCircle } from "lucide-react";
import type { ProductFamily } from "../utils/wyrobLoader";

const KEY_DATES = [
  { date: "8 sty 2026", label: "Pełne stosowanie CPR 2024" },
  { date: "8 sty 2027", label: "Sankcje za naruszenia" },
  { date: "9 sty 2031", label: "Wygasają stare EAD" },
  { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
];

function markdownToHtml(markdown: string): string {
  if (\!markdown) return "";
  let html = markdown;
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white my-6"></h1>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-white my-5 border-b border-white/10 pb-2"></h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-amber-400 my-4"></h3>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold"></strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-slate-300"></em>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc text-slate-300 my-1"></li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-slate-300 my-1"></li>');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-amber-400/50 pl-4 italic text-slate-400 my-4"></blockquote>');
  html = html.replace(/

([^#<
].+?)

/gs, '<p class="text-slate-300 leading-relaxed my-4"></p>');
  html = html.replace(/

([^#<
].+?)$/gs, '<p class="text-slate-300 leading-relaxed my-4"></p>');
  return html;
}