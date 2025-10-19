import React, { useMemo, useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { generateAdvice, LogSummaryForAdvice } from '../services/localAdviceService';
import { SparklesIcon, LightbulbIcon } from './Icons';

// This represents the aggregated logs from weekly/monthly reports
interface AggregatedLog {
    goodThoughts: number;
    badThoughts: number;
    goodActions: number;
    badActions: number;
    goodWords: number; // This is a count
    badWords: number; // This is a count
    happyEvents: number;
    toughEvents: number;
}

interface AdviceCoachProps {
  logSummary: DailyLog | AggregatedLog | null;
  periodLabel: string;
}

const AdviceCoach: React.FC<AdviceCoachProps> = ({ logSummary, periodLabel }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvice, setShowAdvice] = useState(false);

  const summaryForAdvice = useMemo<LogSummaryForAdvice | null>(() => {
    if (!logSummary) return null;
    return {
      goodThoughts: logSummary.goodThoughts || 0,
      badThoughts: logSummary.badThoughts || 0,
      goodActions: logSummary.goodActions || 0,
      badActions: logSummary.badActions || 0,
      goodWordsCount: Array.isArray(logSummary.goodWords) ? logSummary.goodWords.length : logSummary.goodWords || 0,
      badWordsCount: Array.isArray(logSummary.badWords) ? logSummary.badWords.length : logSummary.badWords || 0,
      happyEvents: logSummary.happyEvents || 0,
      toughEvents: logSummary.toughEvents || 0,
    };
  }, [logSummary]);

  useEffect(() => {
    // Reset everything when the source data changes
    setShowAdvice(false);
    setAdvice(null);
    setIsLoading(true);

    if (!summaryForAdvice) {
        setIsLoading(false);
        return;
    }
    
    const totalActions = Object.values(summaryForAdvice).reduce((sum: number, val: number) => sum + val, 0);
    if(totalActions === 0) {
        setIsLoading(false);
        return;
    }

    let period: 'daily' | 'weekly' | 'monthly' = 'daily';
    if (periodLabel.includes('주')) {
        period = 'weekly';
    } else if (periodLabel.includes('월')) {
        period = 'monthly';
    }

    // Generate advice in the background
    generateAdvice(summaryForAdvice, period, periodLabel)
      .then(newAdvice => {
        setAdvice(newAdvice);
      })
      .catch(err => {
        console.error("Failed to generate advice:", err);
        setAdvice("조언을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [summaryForAdvice, periodLabel]);
  
  const renderAdviceText = (text: string) => {
    return text.split('\n').map((line, lineIndex) => {
        if(line.trim() === '') return null; // Don't render empty lines
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
        return (
            <p key={lineIndex} className="mb-2 last:mb-0">
                {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex} className="font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={partIndex}>{part}</span>;
                })}
            </p>
        );
    });
  };

  if (!summaryForAdvice || Object.values(summaryForAdvice).reduce((sum: number, val: number) => sum + val, 0) === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-50 p-4 sm:p-5 rounded-lg">
      <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-indigo-500" />
        기운 코치
      </h3>

      {!showAdvice ? (
        <div className="text-center py-4">
          <button
            onClick={() => setShowAdvice(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LightbulbIcon className="w-5 h-5" />
            <span>{periodLabel} 조언 보기</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-indigo-700">분석 중입니다...</p>
        </div>
      ) : advice ? (
        <div className="text-indigo-800 text-sm sm:text-base leading-relaxed">
          {renderAdviceText(advice)}
        </div>
      ) : null}
    </div>
  );
};

export default AdviceCoach;