
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
        const response = await fetch('/wordExamples.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch wordExamples.json: ${response.statusText}`);
        }
        const data = await response.json();
        cachedExamples = {
            goodWords: data.goodWords || [],
            positiveExpressions: data.positiveExpressions || []
        };
        return cachedExamples;
    } catch (error) {
        console.error("Error fetching or parsing word examples:", error);
        // Return hardcoded fallbacks on error
        return fallbackExamples;
    }
}
