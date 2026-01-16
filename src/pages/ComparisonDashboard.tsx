import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { SIMULATION_DATA, NATION_METADATA, formatCurrency } from '../data/simulationData';
import { useViewMode } from '../context/ViewContext';
import { ArrowLeft, Users, Coins, TrendingUp, Play, Pause, RotateCcw, BarChart3, TrendingUp as TrendingUpIcon, History } from 'lucide-react';
import { motion } from 'framer-motion';

const GREAT_NATIONS = ['Fire', 'Lightning', 'Earth', 'Wind', 'Water'];

const WAR_YEARS = [
  { year: 16, label: "WAR I" },
  { year: 36, label: "WAR II" },
  { year: 46, label: "WAR III" }
];

const Toggle = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-full p-1 flex items-center">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
          value === option 
            ? 'bg-slate-700 text-white shadow-sm' 
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

const ViewToggle = ({ value, onChange }: { value: 'line' | 'bar', onChange: (val: 'line' | 'bar') => void }) => (
  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1 mr-4">
    <button
      onClick={() => onChange('line')}
      className={`p-1.5 rounded-md transition-all ${
        value === 'line' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
      }`}
      title="Trend View"
    >
      <TrendingUpIcon size={16} />
    </button>
    <button
      onClick={() => onChange('bar')}
      className={`p-1.5 rounded-md transition-all ${
        value === 'bar' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
      }`}
      title="Race View"
    >
      <BarChart3 size={16} />
    </button>
  </div>
);

const CustomTooltip = ({ active, payload, label, currencyMode, isCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-lg shadow-2xl backdrop-blur-md z-50">
        <p className="text-slate-400 text-xs font-mono mb-2 border-b border-slate-800 pb-1">{typeof label === 'number' ? `Year ${label}` : label}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex justify-between gap-4 text-xs font-mono">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="text-white">
                {isCurrency 
                  ? formatCurrency(entry.value, currencyMode || 'RYO')
                  : new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(entry.value)
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const SnapshotTooltip = ({ active, payload, currencyMode, isCurrency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md z-50">
        <p className="text-white font-serif mb-1 font-bold" style={{color: data.color}}>{data.name}</p>
        <p className="text-slate-200 font-mono text-sm">
            {isCurrency
                ? formatCurrency(data.value, currencyMode)
                : new Intl.NumberFormat('en-US').format(data.value)
            }
        </p>
      </div>
    );
  }
  return null;
};

const BarRaceChart = ({ metricPrefix, scope, isCurrency, currencyMode }: any) => {
  const [year, setYear] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500); 
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentData = useMemo(() => {
    return GREAT_NATIONS.map(nation => ({
      name: nation,
      value: SIMULATION_DATA[nation][year][`${scope}_${metricPrefix}` as keyof typeof SIMULATION_DATA[typeof nation][0]],
      color: NATION_METADATA[nation].color
    }));
  }, [year, scope, metricPrefix]);

  const handleReset = () => {
    setIsPlaying(false);
    setYear(0);
  };

  return (
    <div className="h-full flex flex-col">
        <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={currentData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#475569" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                        tickFormatter={(value) => isCurrency
                            ? formatCurrency(value, currencyMode)
                            : new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)
                        }
                    />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'serif' }} width={80} />
                    <Tooltip
                        cursor={{fill: '#1e293b', opacity: 0.5}}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
                                        <p className="text-white font-serif mb-1" style={{color: data.color}}>{data.name}</p>
                                        <p className="text-slate-200 font-mono text-sm">
                                            {isCurrency
                                                ? formatCurrency(data.value as number, currencyMode)
                                                : new Intl.NumberFormat('en-US').format(data.value as number)
                                            }
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="value" animationDuration={500} radius={[0, 4, 4, 0]}>
                        {currentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800 backdrop-blur-sm">
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
                onClick={handleReset}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
                <RotateCcw size={16} />
            </button>
            
            <div className="flex-1 flex items-center gap-3 px-4">
                <span className="text-xs font-mono text-slate-500">Y0</span>
                <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={year} 
                    onChange={(e) => {
                        setIsPlaying(false);
                        setYear(Number(e.target.value));
                    }}
                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                />
                <span className="text-xs font-mono text-slate-500">Y60</span>
            </div>

            <div className="min-w-[80px] text-right pl-4 border-l border-slate-700">
                <span className="text-xs text-slate-500 block font-mono">YEAR</span>
                <span className="text-2xl font-mono text-white font-bold">{year}</span>
            </div>
        </div>
    </div>
  );
};

const ComparisonSection = ({ title, icon: Icon, metricPrefix, isCurrency = false }: any) => {
  const [scope, setScope] = useState('National'); // National vs Village
  const [currencyMode, setCurrencyMode] = useState<'RYO' | 'USD'>('RYO');
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');
  const { viewMode } = useViewMode();
  const isAnalyst = viewMode === 'analyst';

  // Transform data for Recharts: [{ Year: 0, Fire: 100, Wind: 200 }, ...]
  const chartData = useMemo(() => {
    // Assume all nations have same number of years, use Fire as base
    return SIMULATION_DATA['Fire'].map((_, index) => {
      const row: any = { Year: index };
      GREAT_NATIONS.forEach(nation => {
        // Construct key dynamically e.g., "National_Pop", "Village_GDP"
        const key = `${scope}_${metricPrefix}`; 
        // @ts-ignore
        row[nation] = SIMULATION_DATA[nation][index][key];
      });
      return row;
    });
  }, [scope, metricPrefix]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
            <Icon size={20} />
          </div>
          <h2 className="text-xl font-serif text-slate-100">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <ViewToggle value={viewType} onChange={setViewType} />
          
          {isCurrency && (
             <button 
                onClick={() => setCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                className="text-[10px] font-mono border border-slate-700 rounded px-2 py-1 bg-slate-900/80 text-slate-400 hover:text-white transition-colors mr-2"
            >
                {currencyMode === 'USD' ? '$' : '両'}
            </button>
          )}
          <Toggle 
            value={scope} 
            onChange={setScope} 
            options={['National', 'Village']} 
          />
        </div>
      </div>

      <div className="w-full">
        {viewType === 'line' ? (
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    {isAnalyst && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
                    <XAxis 
                    dataKey="Year" 
                    stroke="#475569" 
                    tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis 
                    stroke="#475569" 
                    tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(value) => isCurrency 
                        ? formatCurrency(value, currencyMode)
                        : new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)
                    }
                    />
                    <Tooltip 
                    content={<CustomTooltip isCurrency={isCurrency} currencyMode={currencyMode} />}
                    cursor={{ stroke: '#475569', strokeWidth: 1 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'monospace', fontSize: '12px' }} />
                    
                    {WAR_YEARS.map(w => (
                      <ReferenceLine 
                        key={w.year} 
                        x={w.year} 
                        stroke="#ef4444" 
                        strokeDasharray="3 3" 
                        strokeOpacity={0.6}
                        label={{ value: w.label, fill: '#ef4444', fontSize: 10, position: 'insideTop', dy: -10 }} 
                      />
                    ))}

                    {GREAT_NATIONS.map(nation => (
                    <Line 
                        key={nation}
                        type="monotone" 
                        dataKey={nation} 
                        stroke={NATION_METADATA[nation].color} 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        animationDuration={1500}
                    />
                    ))}
                </LineChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <BarRaceChart 
                metricPrefix={metricPrefix} 
                scope={scope} 
                isCurrency={isCurrency} 
                currencyMode={currencyMode} 
            />
        )}
      </div>
    </div>
  );
};

const WarEraComparison = () => {
  const [scope, setScope] = useState('National');
  const [currencyMode, setCurrencyMode] = useState<'RYO' | 'USD'>('RYO');
  
  const SNAPSHOTS = [
    { year: 16, label: "First Great War" },
    { year: 36, label: "Second Great War" },
    { year: 46, label: "Third Great War" },
    { year: 60, label: "Modern Era" }
  ];

  const getDataForYear = (year: number) => {
    return GREAT_NATIONS.map(nation => ({
      name: nation,
      // @ts-ignore
      value: SIMULATION_DATA[nation][year][`${scope}_GDP`],
      color: NATION_METADATA[nation].color
    }));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm mt-8">
       {/* Header with controls */}
       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
               <History size={20} />
             </div>
             <h2 className="text-xl font-serif text-slate-100">Economic Snapshots: War & Peace</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                className="text-[10px] font-mono border border-slate-700 rounded px-2 py-1 bg-slate-900/80 text-slate-400 hover:text-white transition-colors"
            >
                {currencyMode === 'USD' ? '$' : '両'}
            </button>
            <Toggle 
              value={scope} 
              onChange={setScope} 
              options={['National', 'Village']} 
            />
          </div>
       </div>

       {/* Grid of Charts */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SNAPSHOTS.map(snap => (
             <div key={snap.year} className="bg-slate-900/80 border border-slate-700/50 rounded-lg h-64 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
                  <h3 className="text-xs font-mono text-slate-400 uppercase font-bold">{snap.label}</h3>
                  <span className="text-[10px] bg-slate-800/80 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">Y{snap.year}</span>
                </div>
                <div className="absolute top-12 bottom-0 left-0 w-full px-2 pb-2">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDataForYear(snap.year)} margin={{top: 5, bottom: 0, left: 0, right: 0}}>
                         <Tooltip 
                            content={<SnapshotTooltip isCurrency={true} currencyMode={currencyMode} />}
                            cursor={{fill: '#fff', opacity: 0.05}}
                         />
                         <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                            {getDataForYear(snap.year).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}

const ComparisonDashboard = () => {
  return (
    <div className="min-h-screen bg-void pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-mono text-xs">
            <ArrowLeft size={14} className="mr-2" /> RETURN TO ORBIT
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-4"
          >
            The Great Game <span className="text-slate-600">Analysis</span>
          </motion.h1>
          <p className="text-slate-400 max-w-2xl font-light">
            Comparative intelligence on the Five Great Nations. Analyze demographic shifts, economic capacity, and quality of life indicators across the 60-year simulation.
          </p>
        </div>

        {/* Charts */}
        <div className="space-y-12">
          <ComparisonSection 
            title="Demographics" 
            icon={Users} 
            metricPrefix="Pop" 
          />
          
          <ComparisonSection 
            title="Economic Power (GDP)" 
            icon={Coins} 
            metricPrefix="GDP" 
            isCurrency={true}
          />

          <ComparisonSection 
            title="Standard of Living (Per Capita)" 
            icon={TrendingUp} 
            metricPrefix="Per_Capita" 
            isCurrency={true}
          />
        </div>

        {/* Snapshots at bottom */}
        <WarEraComparison />

      </div>
    </div>
  );
};

export default ComparisonDashboard;