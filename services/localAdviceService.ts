// types.ts or a new types file might be better, but for simplicity let's define it here.
export interface LogSummaryForAdvice {
  goodThoughts: number;
  badThoughts: number;
  goodActions: number;
  badActions: number;
  goodWordsCount: number;
  badWordsCount: number;
  happyEvents: number;
  toughEvents: number;
}

interface AdviceTemplate {
  type: 'intro' | 'strength' | 'growth' | 'tip' | 'closing';
  period?: 'daily' | 'weekly' | 'monthly';
  criteria: string;
  template: string;
}

interface AdviceData {
  fragments: Record<string, string[]>;
  advice: AdviceTemplate[];
}

let adviceData: AdviceData | null = null;

async function loadAdviceData(): Promise<AdviceData> {
  if (adviceData) {
    return adviceData;
  }
  try {
      // Use Vite base-aware path so it works under GitHub Pages (e.g., /MakeLucky/)
      const base = (import.meta as any).env?.BASE_URL ?? '/';
      // Prefer the asset under public/ (copied to dist root)
      const url = `${base.replace(/\/$/, '/') }advice.json`;
      const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error('Failed to load advice data');
    }
    const data = await response.json();
    adviceData = data;
    return data;
  } catch (error) {
    console.error('Error loading advice.json:', error);
    // Return a fallback or throw
    throw error;
  }
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function evaluateCriteria(criteria: string, summary: LogSummaryForAdvice): boolean {
    if (criteria === 'ALWAYS_MATCH') {
        return true;
    }
    
    // Allow for simple arithmetic in criteria, e.g., (goodA + goodB) > badA
    // This is a safe evaluation for the known structure.
    try {
        const keys = Object.keys(summary) as (keyof LogSummaryForAdvice)[];
        const values = keys.map(key => summary[key]);
        const evaluator = new Function(...keys, `"use strict"; return ${criteria};`);
        return evaluator(...values);
    } catch (e) {
        console.error("Error evaluating criteria:", criteria, e);
        return false;
    }
}


function fillTemplate(template: string, fragments: Record<string, string[]>, context: LogSummaryForAdvice & { periodLabel: string }): string {
  // Step 1: Fill fragment placeholders like [[intro_greeting]]
  const withFragments = template.replace(/\[\[(.*?)\]\]/g, (match, key) => {
    const fragmentKey = key.trim();
    if (fragments[fragmentKey] && fragments[fragmentKey].length > 0) {
      return getRandomItem(fragments[fragmentKey]);
    }
    return match; // Return placeholder if key not found
  });

  // Step 2: Fill data placeholders like {goodWordsCount}
  const withData = withFragments.replace(/{(\w+)}/g, (match, key) => {
    return context[key as keyof typeof context]?.toString() ?? match;
  });
  
  return withData;
}

export async function generateAdvice(summary: LogSummaryForAdvice, period: 'daily' | 'weekly' | 'monthly', periodLabel: string): Promise<string> {
    const data = await loadAdviceData();
    const adviceParts: string[] = [];
    
    const context = { ...summary, periodLabel };

    const findAndFill = (type: AdviceTemplate['type']) => {
        const candidates = data.advice.filter(a => {
            const typeMatch = a.type === type;
            const periodMatch = !a.period || a.period === period;
            const criteriaMatch = evaluateCriteria(a.criteria, summary);
            return typeMatch && periodMatch && criteriaMatch;
        });

        if (candidates.length > 0) {
            const selectedTemplate = getRandomItem(candidates);
            return fillTemplate(selectedTemplate.template, data.fragments, context);
        }
        return null;
    };

    const intro = findAndFill('intro');
    if (intro) adviceParts.push(intro);

    const strength = findAndFill('strength');
    if (strength) adviceParts.push(strength);
    
    // Only add growth if bad actions/thoughts/words are significant
    const hasNegative = summary.badWordsCount > 0 || summary.badThoughts > 0 || summary.badActions > 0 || summary.toughEvents > 0;
    if (hasNegative) {
        const growth = findAndFill('growth');
        if (growth) adviceParts.push(growth);
    }

    const tip = findAndFill('tip');
    if (tip) adviceParts.push(tip);

    const closing = findAndFill('closing');
    if (closing) adviceParts.push(closing);
    
    return adviceParts.join('\n\n');
}