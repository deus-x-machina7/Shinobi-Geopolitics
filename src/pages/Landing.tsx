import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NATION_METADATA, SIMULATION_DATA, formatCurrency } from '../data/simulationData';
import { ArrowRight, Globe, BarChart2, CloudRain, Building2 } from 'lucide-react';
import { useViewMode } from '../context/ViewContext';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Landing = () => {
  const { viewMode } = useViewMode();
  const isAnalyst = viewMode === 'analyst';
  const [currencyMode, setCurrencyMode] = useState<'RYO' | 'USD'>('RYO');
  const [greatNationsMode, setGreatNationsMode] = useState<'nation' | 'village'>('village');
  const [minorNationsMode, setMinorNationsMode] = useState<'nation' | 'village'>('village');

  // Aggregate GDP for the Five Great Nations only (excluding Rain)
  const GREAT_NATIONS = ['Fire', 'Lightning', 'Earth', 'Wind', 'Water'];
  const MINOR_NATIONS = ['Rain'];

  const globalData = SIMULATION_DATA.Fire.map((fireYear, index) => {
    let total = 0;
    GREAT_NATIONS.forEach(nation => {
        if (SIMULATION_DATA[nation]) {
            total += SIMULATION_DATA[nation][index].National_GDP;
        }
    });
    return {
        Year: fireYear.Year,
        Total_GDP: total
    };
  });

  const renderNationCard = (key: string, mode: 'nation' | 'village', isFeatured: boolean = false) => {
      const meta = NATION_METADATA[key];
      const isVillage = mode === 'village';
      const title = isVillage ? meta.village_name : key;
      const targetLink = isVillage ? `/village/${key}` : `/nation/${key}`;

      return (
        <Link 
            to={targetLink} 
            key={key}
            className={`group relative bg-slate-900 border border-slate-800 hover:border-slate-600 p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isFeatured ? 'md:col-span-2' : ''}`}
        >
            <div 
                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" 
                style={{ backgroundColor: `${meta.color}10` }}
            />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-serif text-white mb-2 group-hover:text-slate-200">{title}</h2>
                    {isFeatured && (
                        <div className="relative group/icon" title="Legacy of the Uzumaki">
                            <div className="absolute -inset-1 bg-red-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700/50 text-red-500/90 shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 12c0-1.38-.62-2.5-2-2.5S8 10.62 8 12s1.62 2.5 3.5 2.5 4-1.62 4-4-1.62-5-5-5-6 2.12-6 6 2.62 7 7 7 7-3.12 7-8" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-0.5 w-8 mb-4 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: meta.color }}></div>
                <p className="text-sm text-slate-400 mb-6 font-light line-clamp-2">
                    {meta.description}
                </p>
                <div className="flex items-center text-xs font-mono text-slate-500 group-hover:text-white transition-colors">
                    {isVillage ? 'ENTER VILLAGE' : 'ANALYZE NATION'} <ArrowRight size={12} className="ml-2" />
                </div>
            </div>
        </Link>
      );
  };

  return (
    <div className="min-h-screen bg-void flex flex-col relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center">
            
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-900/50 rounded-full px-4 py-1 text-sm font-mono text-slate-400 mb-6 backdrop-blur-sm">
                    <Globe size={14} />
                    <span>GREAT NATIONS SIMULATION: Y0 - Y60</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 tracking-tighter">
                    SHINOBI<br />GEOPOLITICS
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                    A data-driven exploration of economic warfare, industrialization, and conflict cycles in a fictional shinobi world.
                </p>
            </div>

            {/* Global Chart Preview */}
            <div className="mb-16 bg-slate-900/30 border-y border-slate-800/50 h-64 w-full max-w-4xl mx-auto relative group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1 rounded font-mono">Five Great Nations GDP</span>
                </div>
                <div className="absolute bottom-8 right-2 z-20">
                    <button 
                        onClick={() => setCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                        className="text-[10px] font-mono border border-slate-700 rounded px-2 py-1 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                        {currencyMode === 'USD' ? 'USD ($)' : 'RYO (両)'}
                    </button>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={globalData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="globalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        {isAnalyst && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
                        {isAnalyst && (
                            <XAxis 
                                dataKey="Year" 
                                stroke="#475569" 
                                tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                            />
                        )}
                        {isAnalyst && (
                            <YAxis 
                                stroke="#475569" 
                                tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                                tickFormatter={(val) => formatCurrency(val, currencyMode)}
                            />
                        )}
                        <Area 
                            type="monotone" 
                            dataKey="Total_GDP" 
                            stroke="#475569" 
                            fill="url(#globalGradient)" 
                            strokeWidth={1}
                            animationDuration={1500}
                        />
                        {isAnalyst && (
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                                labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
                                formatter={(value: number) => [formatCurrency(value, currencyMode), "Total GDP"]}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Five Great Nations Section */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 pl-3 border-l-2 border-slate-700 gap-4">
                    <h2 className="text-xl font-serif text-slate-200">
                        {greatNationsMode === 'nation' ? 'The Five Great Nations' : 'The Five Great Hidden Villages'}
                    </h2>
                    <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setGreatNationsMode('village')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                                greatNationsMode === 'village' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Building2 size={14} />
                            <span>HIDDEN VILLAGES</span>
                        </button>
                        <button
                            onClick={() => setGreatNationsMode('nation')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                                greatNationsMode === 'nation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Globe size={14} />
                            <span>GREAT NATIONS</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GREAT_NATIONS.map(key => renderNationCard(key, greatNationsMode, key === 'Fire'))}
                </div>
            </div>

            {/* Minor Nations Section */}
            <div className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 pl-3 border-l-2 border-slate-700 gap-4">
                    <h2 className="text-xl font-serif text-slate-200">
                        {minorNationsMode === 'nation' ? 'Minor Nations' : 'Minor Hidden Villages'}
                    </h2>
                    <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setMinorNationsMode('village')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                                minorNationsMode === 'village' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Building2 size={14} />
                            <span>HIDDEN VILLAGES</span>
                        </button>
                        <button
                            onClick={() => setMinorNationsMode('nation')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                                minorNationsMode === 'nation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Globe size={14} />
                            <span>MINOR NATIONS</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {MINOR_NATIONS.map(key => renderNationCard(key, minorNationsMode))}
                </div>
            </div>

            {/* Global Intelligence Section */}
            <div>
                <h2 className="text-xl font-serif text-slate-200 mb-6 pl-3 border-l-2 border-slate-700">Global Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                        to="/comparison"
                        className="group flex items-center w-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-indigo-900/20 rounded-full p-1 transition-all duration-300"
                    >
                        <div className="w-full flex items-center justify-between px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-500/10 p-3 rounded-full text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                    <BarChart2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif text-white group-hover:text-indigo-100">Compare The Five Great Nations</h3>
                                    <p className="text-sm text-slate-400 font-light">Cross-reference GDP, population, and living standards.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 rounded-full p-2 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </Link>

                    <Link 
                        to="/rain-anomaly"
                        className="group flex items-center w-full bg-slate-900 border border-slate-800 hover:border-slate-400 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-700/20 rounded-full p-1 transition-all duration-300"
                    >
                        <div className="w-full flex items-center justify-between px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-500/10 p-3 rounded-full text-slate-400 group-hover:text-slate-300 transition-colors">
                                    <CloudRain size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif text-white group-hover:text-slate-200">The Rain Anomaly</h3>
                                    <p className="text-sm text-slate-400 font-light">Deep dive into the volatility of Rain Country.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 rounded-full p-2 text-slate-400 group-hover:bg-slate-600 group-hover:text-white transition-all duration-300">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    </div>
  );
};

export default Landing;