import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LuckInput from './components/LuckInput';
import ResultDisplay from './components/ResultDisplay';
import WeeklyReport from './components/WeeklyReport';
import MonthlyReport from './components/MonthlyReport';
import { DailyLog } from './types';
import { 
  BrainCircuitIcon, 
  PersonWalkingIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PartyPopperIcon,
  CloudRainIcon,
  HappyChatIcon,
  SadChatIcon,
  LightbulbIcon,
  HomeIcon
} from './components/Icons';
// FIX: Import the `AdItem` type to resolve the 'Cannot find name' error.
// Ads for RollingAdBanner are now self-loaded from JSON inside the component
import { fetchWordExamples, PositiveExpression, WordExamples } from './services/wordExampleService';
import GoogleAd from './components/GoogleAd';
import RollingAdBanner from './components/RollingAdBanner';
import VisitorCounter from './components/VisitorCounter';
import InstallCounter from './components/InstallCounter';

const toYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getInitialLogs = (): Record<string, DailyLog> => {
    try {
        const savedLogs = localStorage.getItem('luck-cultivator-logs-v2');
        if (savedLogs) {
            const parsed = JSON.parse(savedLogs);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Failed to load logs from localStorage", error);
    }
    return {};
};


const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).format(date);
};

const CounterInput: React.FC<{
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  icon: React.ReactNode;
  color: 'green' | 'rose' | 'amber' | 'sky';
}> = ({ label, count, onIncrement, onDecrement, icon, color }) => {
    const colorClasses = {
        green: 'text-green-600 border-green-200',
        rose: 'text-rose-600 border-rose-200',
        amber: 'text-amber-600 border-amber-200',
        sky: 'text-sky-600 border-sky-200',
    };
    const buttonClasses = {
        green: 'bg-green-100 hover:bg-green-200 text-green-800',
        rose: 'bg-rose-100 hover:bg-rose-200 text-rose-800',
        amber: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
        sky: 'bg-sky-100 hover:bg-sky-200 text-sky-800',
    }
    return (
        <div className={`p-4 rounded-lg border bg-white ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h4 className="font-semibold">{label}</h4>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{count}</span>
                <div className="flex gap-2">
                    <button onClick={onDecrement} className={`w-8 h-8 rounded-full font-bold text-lg ${buttonClasses[color]}`}>-</button>
                    <button onClick={onIncrement} className={`w-8 h-8 rounded-full font-bold text-lg ${buttonClasses[color]}`}>+</button>
                </div>
            </div>
        </div>
    );
};


function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allLogs, setAllLogs] = useState<Record<string, DailyLog>>(getInitialLogs);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showGoodWordExamples, setShowGoodWordExamples] = useState(false);
  const [showPositiveExpressionExamples, setShowPositiveExpressionExamples] = useState(false);
  const [goodWordText, setGoodWordText] = useState('');
  const [badWordText, setBadWordText] = useState('');
  const [wordExamples, setWordExamples] = useState<WordExamples>({ goodWords: [], positiveExpressions: [] });

  useEffect(() => {
    try {
        localStorage.setItem('luck-cultivator-logs-v2', JSON.stringify(allLogs));
    } catch (error) {
        console.error("Failed to save logs to localStorage", error);
    }
  }, [allLogs]);

  useEffect(() => {
    const loadData = async () => {
      // Load Word Examples
      const examples = await fetchWordExamples();
      setWordExamples(examples);
    };
    loadData();
  }, []);


  const todayKey = toYYYYMMDD(currentDate);
  const isToday = toYYYYMMDD(new Date()) === todayKey;

  const currentLog = allLogs[todayKey] || {
    goodWords: [], badWords: [],
    goodThoughts: 0, badThoughts: 0,
    goodActions: 0, badActions: 0,
    happyEvents: 0, toughEvents: 0,
  };
  
  const updateLog = useCallback((updatedLog: DailyLog) => {
    setAllLogs(prev => ({ ...prev, [todayKey]: updatedLog }));
  }, [todayKey]);

  const addWord = (type: 'good' | 'bad', data: { text: string; intensity: number }) => {
    const key = type === 'good' ? 'goodWords' : 'badWords';
    const newLog = { ...currentLog };
    newLog[key] = [...newLog[key], { ...data, id: Date.now() }];
    updateLog(newLog);
    if (type === 'good') {
        setGoodWordText('');
    } else {
        setBadWordText('');
    }
  };

  const handleCounterChange = (
    field: 'goodThoughts' | 'badThoughts' | 'goodActions' | 'badActions' | 'happyEvents' | 'toughEvents',
    amount: 1 | -1
  ) => {
    const newLog = { ...currentLog };
    newLog[field] = Math.max(0, newLog[field] + amount);
    updateLog(newLog);
  };
  
  const changeDate = (offset: number) => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setDate(prev.getDate() + offset);
          return newDate;
      })
  }

  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const key = toYYYYMMDD(date);
      data.push({
        date,
        log: allLogs[key] || {
          goodWords: [], badWords: [], goodThoughts: 0, badThoughts: 0,
          goodActions: 0, badActions: 0, happyEvents: 0, toughEvents: 0,
        },
      });
    }
    return data;
  }, [currentDate, allLogs]);

  const monthlyData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDays = lastDayOfMonth.getDate();

    const totals = {
      goodThoughts: 0, badThoughts: 0, goodActions: 0, badActions: 0,
      goodWords: 0, badWords: 0, happyEvents: 0, toughEvents: 0,
      goodWordScore: 0, badWordScore: 0,
    };
    const weeklyEnergies = Array.from({ length: 5 }, () => ({ goodEnergy: 0, badEnergy: 0, totalEnergy: 0 }));

    for (let day = 1; day <= numDays; day++) {
      const date = new Date(year, month, day);
      const key = toYYYYMMDD(date);
      const log = allLogs[key] || {
        goodWords: [], badWords: [], goodThoughts: 0, badThoughts: 0,
        goodActions: 0, badActions: 0, happyEvents: 0, toughEvents: 0,
      };

      const goodWordScore = log.goodWords.reduce((sum, w) => sum + w.intensity, 0);
      const badWordScore = log.badWords.reduce((sum, w) => sum + w.intensity, 0);

      totals.goodThoughts += log.goodThoughts;
      totals.badThoughts += log.badThoughts;
      totals.goodActions += log.goodActions;
      totals.badActions += log.badActions;
      totals.goodWords += log.goodWords.length;
      totals.badWords += log.badWords.length;
      totals.happyEvents += log.happyEvents;
      totals.toughEvents += log.toughEvents;
      totals.goodWordScore += goodWordScore;
      totals.badWordScore += badWordScore;

      const goodEnergy = (log.goodThoughts * 6) + goodWordScore + (log.goodActions * 20) + (log.happyEvents * 10);
      const badEnergy = (log.badThoughts * 6) + badWordScore + (log.badActions * 20) + (log.toughEvents * 10);
      
      const weekIndex = Math.floor((day - 1) / 7);
      if(weeklyEnergies[weekIndex]){
           weeklyEnergies[weekIndex].goodEnergy += goodEnergy;
           weeklyEnergies[weekIndex].badEnergy += badEnergy;
           weeklyEnergies[weekIndex].totalEnergy += goodEnergy + badEnergy;
      }
    }
    
    const maxEnergy = Math.max(...weeklyEnergies.map(e => e.totalEnergy), 10);
    const monthLabel = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(currentDate);

    return { weeklyEnergies, maxEnergy, totals, monthLabel };
  }, [currentDate, allLogs]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            해보자! 행운부르기
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-6 h-6"/></button>
              <div className="text-center">
                <p className="font-semibold text-lg text-slate-700">{formatDate(currentDate)}</p>
              </div>
              <button onClick={() => changeDate(1)} disabled={isToday} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon className="w-6 h-6"/></button>
              <button 
                onClick={() => setCurrentDate(new Date())} 
                disabled={isToday} 
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Go to today"
                aria-label="Go to today's log"
              >
                <HomeIcon className="w-6 h-6"/>
              </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="grid grid-cols-2 gap-6">
                {/* Good Vibes Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-green-600">좋은 기운 기록</h3>
                    <LuckInput
                        label="내가 한 좋은말"
                        onAdd={(data) => addWord('good', data)}
                        icon={<HappyChatIcon className="w-7 h-7 text-green-500" />}
                        color="green"
                        value={goodWordText}
                        onTextChange={setGoodWordText}
                    />
                     <div className="px-1">
                        <button
                            onClick={() => setShowGoodWordExamples(!showGoodWordExamples)}
                            className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 py-2 px-3 rounded-lg transition-colors"
                        >
                            <LightbulbIcon className="w-4 h-4" />
                            좋은말 예시 보기
                        </button>
                        {showGoodWordExamples && (
                            <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm space-y-1">
                                {wordExamples.goodWords.map((ex, i) => (
                                    <p 
                                      key={i} 
                                      className="text-green-800 p-1 rounded-md cursor-pointer hover:bg-green-100 transition-colors"
                                      onClick={() => setGoodWordText(ex)}
                                    >
                                      💡 {ex}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                    <CounterInput 
                        label="좋은 생각"
                        count={currentLog.goodThoughts}
                        onIncrement={() => handleCounterChange('goodThoughts', 1)}
                        onDecrement={() => handleCounterChange('goodThoughts', -1)}
                        icon={<BrainCircuitIcon className="w-6 h-6"/>}
                        color="green"
                    />
                     <CounterInput 
                        label="좋은 행동"
                        count={currentLog.goodActions}
                        onIncrement={() => handleCounterChange('goodActions', 1)}
                        onDecrement={() => handleCounterChange('goodActions', -1)}
                        icon={<PersonWalkingIcon className="w-6 h-6"/>}
                        color="green"
                    />
                     <CounterInput 
                        label="흐뭇한소식"
                        count={currentLog.happyEvents}
                        onIncrement={() => handleCounterChange('happyEvents', 1)}
                        onDecrement={() => handleCounterChange('happyEvents', -1)}
                        icon={<PartyPopperIcon className="w-6 h-6"/>}
                        color="amber"
                    />
                </div>

                {/* Bad Vibes Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-rose-600">나쁜 기운 기록</h3>
                     <LuckInput
                        label="내가 한 나쁜말"
                        onAdd={(data) => addWord('bad', data)}
                        icon={<SadChatIcon className="w-7 h-7 text-slate-500" />}
                        color="slate"
                        value={badWordText}
                        onTextChange={setBadWordText}
                    />
                     <div className="px-1">
                        <button
                            onClick={() => setShowPositiveExpressionExamples(!showPositiveExpressionExamples)}
                            className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-lg transition-colors"
                        >
                            <LightbulbIcon className="w-4 h-4" />
                            긍정적 표현 예시 보기
                        </button>
                        {showPositiveExpressionExamples && (
                            <div className="mt-2 p-3 bg-slate-100 rounded-lg text-sm space-y-2">
                                {wordExamples.positiveExpressions.map((ex, i) => (
                                    <div 
                                      key={i} 
                                      className="p-1 rounded-md cursor-pointer hover:bg-slate-200 transition-colors"
                                      onClick={() => setBadWordText(ex.bad)}
                                    >
                                        <p className="text-rose-600">{"❌ " + ex.bad}</p>

                                        <p className="text-sky-600">{"✨ " + ex.good}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <CounterInput 
                        label="나쁜 생각"
                        count={currentLog.badThoughts}
                        onIncrement={() => handleCounterChange('badThoughts', 1)}
                        onDecrement={() => handleCounterChange('badThoughts', -1)}
                        icon={<BrainCircuitIcon className="w-6 h-6"/>}
                        color="rose"
                    />
                    <CounterInput 
                        label="나쁜 행동"
                        count={currentLog.badActions}
                        onIncrement={() => handleCounterChange('badActions', 1)}
                        onDecrement={() => handleCounterChange('badActions', -1)}
                        icon={<PersonWalkingIcon className="w-6 h-6"/>}
                        color="rose"
                    />
                     <CounterInput 
                        label="힘겨운소식"
                        count={currentLog.toughEvents}
                        onIncrement={() => handleCounterChange('toughEvents', 1)}
                        onDecrement={() => handleCounterChange('toughEvents', -1)}
                        icon={<CloudRainIcon className="w-6 h-6"/>}
                        color="sky"
                    />
                </div>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg h-full sticky top-24">
                 <div className="flex justify-center border-b border-slate-200 mb-6">
                    <button onClick={() => setView('daily')} className={`px-4 py-2 font-semibold ${view === 'daily' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}>
                        일일 리포트
                    </button>
                    <button onClick={() => setView('weekly')} className={`px-4 py-2 font-semibold ${view === 'weekly' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}>
                        주간 리포트
                    </button>
                    <button onClick={() => setView('monthly')} className={`px-4 py-2 font-semibold ${view === 'monthly' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}>
                        월간 리포트
                    </button>
                </div>

                {view === 'daily' && <ResultDisplay log={currentLog} date={formatDate(currentDate)} /> }
                {view === 'weekly' && <WeeklyReport data={weeklyData} /> }
                {view === 'monthly' && <MonthlyReport data={monthlyData} /> }
            </div>
        </div>
      </main>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {(() => {
          const ADS_ENABLED = String((import.meta as any).env?.VITE_GOOGLE_ADSENSE_FLAG || '')
            .toString()
            .trim()
            .toUpperCase() === 'TRUE';
          if (ADS_ENABLED) {
            return (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-[30%]">
                  <RollingAdBanner />
                </div>
                <div className="w-full md:w-[70%]">
                  <GoogleAd />
                </div>
              </div>
            );
          }
          return (
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <RollingAdBanner />
              </div>
            </div>
          );
        })()}
      </div>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <p>&copy; 2025 AI 행운습관 코치. All rights reserved.</p>
          <VisitorCounter />
          <span className="text-slate-300">•</span>
          <InstallCounter />
        </div>
      </footer>
    </div>
  );
}

export default App;
