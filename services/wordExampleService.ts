// Load word examples at build time to avoid runtime fetch/path issues (works on GitHub Pages)
// Vite supports importing JSON as a module by default
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - typing JSON import via cast below
import wordExamplesRaw from '../wordExamples.json';

export interface PositiveExpression {
    bad: string;
    good: string;
}

export interface WordExamples {
    goodWords: string[];
    positiveExpressions: PositiveExpression[];
}

let cachedExamples: WordExamples | null = null;

const fallbackExamples: WordExamples = {
    goodWords: ["고마워요", "덕분이에요", "최고예요!"],
    positiveExpressions: [{ bad: "짜증나", good: "어떻게 해결할까?" }]
};

export async function fetchWordExamples(): Promise<WordExamples> {
    if (cachedExamples) {
        return cachedExamples;
    }
    try {
        const data = wordExamplesRaw as WordExamples;
        cachedExamples = {
            goodWords: Array.isArray((data as any).goodWords) ? (data as any).goodWords : [],
            positiveExpressions: Array.isArray((data as any).positiveExpressions) ? (data as any).positiveExpressions : []
        };
        return cachedExamples;
    } catch (error) {
        console.error("Error loading word examples module:", error);
        return fallbackExamples;
    }
}
