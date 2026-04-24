import type { ProductFamily } from "./wyrobLoader";

export interface WyrobSnapshot {
  familySummary: string;
  currentStatus: string;
  changes: string[];
  actions: string[];
}

const headingPattern = /^(#{1,6})\s+(.*)$/;
const listPattern = /^(-|\*|\d+\.)\s+/;

function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMarkdownSection(content: string, headings: string[]) {
  const lines = content.split("\n");
  const normalizedHeadings = headings.map((heading) => heading.toLowerCase());
  const sectionLines: string[] = [];
  let inSection = false;
  let sectionLevel = 0;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(headingPattern);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = stripMarkdown(headingMatch[2]).toLowerCase();

      if (!inSection && normalizedHeadings.some((heading) => headingText.includes(heading))) {
        inSection = true;
        sectionLevel = level;
        continue;
      }

      if (inSection && level <= sectionLevel) {
        break;
      }
    }

    if (inSection) {
      sectionLines.push(line);
    }
  }

  return sectionLines.join("\n").trim();
}

function extractListItems(section: string, limit: number) {
  const items = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => listPattern.test(line))
    .map((line) => stripMarkdown(line.replace(listPattern, "")))
    .filter(Boolean);

  return items.slice(0, limit);
}

function extractParagraphs(section: string, limit: number) {
  return section
    .split(/\n\s*\n/)
    .map((block) =>
      stripMarkdown(
        block
          .split("\n")
          .filter((line) => line.trim() && !line.trim().startsWith("|") && !line.trim().match(headingPattern))
          .join(" "),
      ),
    )
    .filter((block) => block && !listPattern.test(block))
    .slice(0, limit);
}

export function buildWyrobSnapshot(wyrob: ProductFamily | null): WyrobSnapshot | null {
  if (!wyrob) {
    return null;
  }

  const familySection = extractMarkdownSection(wyrob.content, ["o rodzinie wyrobów"]);
  const changesSection = extractMarkdownSection(wyrob.content, ["zmiany względem cpr 305/2011"]);
  const checklistSection = extractMarkdownSection(wyrob.content, ["checklist producenta"]);

  const familyParagraphs = extractParagraphs(familySection, 2);
  const changeListItems = extractListItems(changesSection, 4);
  const checklistItems = extractListItems(checklistSection, 5);
  const changes = changeListItems.length > 0 ? changeListItems : extractParagraphs(changesSection, 4);
  const actions = checklistItems.length > 0 ? checklistItems : extractParagraphs(checklistSection, 5);

  return {
    familySummary: familyParagraphs.join(" ").trim() || wyrob.excerpt,
    currentStatus:
      "Na dziś dla tej rodziny trzeba opierać się przede wszystkim na obowiązującej hEN lub ETA, aktualnym systemie AVCP i klasycznej DoP. Nowe obowiązki CPR 2024 dla konkretnego wyrobu materializują się dopiero po publikacji odpowiedniej hTS, aktów KE i zakończeniu okresu przejściowego.",
    changes,
    actions,
  };
}
