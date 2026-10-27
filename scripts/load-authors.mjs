import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Both the browser and build scripts use the same author registry and name rules.
const source = readFileSync(new URL('../src/data/authors.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
export const { AUTHORS, getArticleAuthors } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
