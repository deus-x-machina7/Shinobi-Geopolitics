import React, { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { SIMULATION_DATA, NATION_METADATA, formatCurrency, SimulationYear } from '../data/simulationData';
import AnimatedChart from '../components/AnimatedChart';
import VillageEntrance from '../components/VillageEntrance';
import { useViewMode } from '../context/ViewContext';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldAlert, Coins, ArrowLeft, Building2 } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, isCurrency = false }: any) => {
  const [currencyMode, setCurrencyMode] = useState<'RYO' | 'USD'>('RYO');

  let displayValue = value;
  if (isCurrency && typeof value === 'number') {
      displayValue = formatCurrency(value, currencyMode);
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg backdrop-blur-sm relative group">
        {isCurrency && (
            <button 
                onClick={() => setCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                className="absolute top-2 right-2 text-[10px] font-mono border border-slate-700 rounded px-1.5 py-0.5 bg-slate-900 text-slate-500 hover:text-white hover:border-slate-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                {currencyMode === 'USD' ? '$' : '両'}
            </button>
        )}
        <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Icon size={14} />
            <span className="text-xs font-mono uppercase">{label}</span>
        </div>
        <div className="text-xl font-serif text-white">{displayValue}</div>
    </div>
  );
};

const ChartContainer = ({ title, color, children, onToggleCurrency, currencyMode }: any) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif text-slate-200">{title}</h3>
            <div className="flex items-center gap-4">
                {onToggleCurrency && (
                    <button 
                        onClick={onToggleCurrency}
                        className="text-[10px] font-mono border border-slate-700 rounded px-2 py-1 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                        {currencyMode === 'USD' ? 'USD ($)' : 'RYO (両)'}
                    </button>
                )}
                {color && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>}
            </div>
        </div>
        {children}
    </div>
);

const VillageDashboard = () => {
  const { nationId } = useParams<{ nationId: string }>();
  const { viewMode } = useViewMode();
  const [gdpCurrencyMode, setGdpCurrencyMode] = useState<'RYO' | 'USD'>('RYO');
  // No opacity state needed, reveal is handled by Entrance component wiping away
  
  if (!nationId || !SIMULATION_DATA[nationId]) {
    return <Navigate to="/" />;
  }

  const data = SIMULATION_DATA[nationId];
  const meta = NATION_METADATA[nationId];
  const isAnalyst = viewMode === 'analyst';

  // Stats for the final year
  const finalStats = data[data.length - 1];
  
  // Use village_name directly from metadata
  const fullVillageName = meta.village_name;

  const eras = [
    { start: 0, end: 15, title: "Village Foundation", desc: "The consolidation of clan power into a unified hidden village structure. Establishing the Kage system and academy infrastructure." },
    { start: 16, end: 35, title: "Shinobi Mobilization", desc: "The village transitions to a war footing. Mission revenue spikes while attrition rates in the field increase significantly." },
    { start: 36, end: 45, title: "Crisis & Retaliation", desc: "A period of intense conflict and potential devastation. The village faces existential threats requiring maximum force projection." },
    { start: 46, end: 60, title: "The Modern Era", desc: "Post-war stabilization. The village diversifies its income streams and focuses on administrative efficiency and technological integration." }
  ];

  const calculateCAGR = (start: number, end: number) => {
      const startVal = data.find(d => d.Year === start)?.Village_GDP || 1;
      const endVal = data.find(d => d.Year === end)?.Village_GDP || 1;
      const years = end - start;
      if (years <= 0) return 0;
      return ((Math.pow(endVal / startVal, 1 / years) - 1) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-void pb-24">
      {/* Entrance Animation Overlay */}
      <VillageEntrance nationId={nationId} />

      {/* Main Content - Visible underneath immediately */}
      <div>
        {/* Hero Header */}
        <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
            <div 
            className="absolute inset-0 opacity-20"
            style={{ 
                background: `radial-gradient(circle at center, ${meta.color}, transparent 70%)` 
            }}
            />
            <div className="absolute inset-0 bg-slate-950/90" /> {/* Darker overlay for Village vibe */}
            
            <div className="relative z-10 text-center px-4 flex flex-col items-center">
            <Link 
                to={`/nation/${nationId}`} 
                className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
            >
                <ArrowLeft size={14} /> RETURN TO {nationId} NATION
            </Link>
            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }} // Slight delay for text so it pops after wipe
                className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-tighter"
            >
                {fullVillageName}
            </motion.h1>
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-lg text-slate-400 max-w-2xl mx-auto font-light"
            >
                The Hidden Village of {meta.village_name}
            </motion.p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard 
                label="Village Population" 
                value={new Intl.NumberFormat('en-US', { notation: "compact" }).format(finalStats.Village_Pop)} 
                icon={Users} 
            />
            <StatCard 
                label="Village Revenue (GDP)" 
                value={finalStats.Village_GDP} 
                isCurrency={true}
                icon={Coins} 
            />
            <StatCard 
                label="Active Personnel" 
                value={new Intl.NumberFormat('en-US').format(finalStats.Field_Strength + finalStats.Support_Strength + finalStats.Admin_Strength + finalStats.Black_Ops_Field)} 
                icon={ShieldAlert} 
            />
            <StatCard 
                label="Shinobi Per Capita" 
                value={finalStats.Village_Per_Capita}
                isCurrency={true}
                icon={TrendingUp} 
            />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Narrative (Scrollytelling) */}
            <div className="lg:col-span-5 space-y-24">
                {eras.map((era, i) => {
                const cagr = calculateCAGR(era.start, era.end);
                const isPositive = Number(cagr) > 0;
                
                return (
                    <motion.div 
                    key={i}
                    initial={{ opacity: 0.5 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}
                    className="min-h-[40vh] flex flex-col justify-center border-l-2 border-slate-800 pl-8"
                    >
                    <span className="text-xs font-mono text-slate-500 mb-2 block">Years {era.start}-{era.end}</span>
                    <h2 className="text-2xl font-serif text-white mb-4">{era.title}</h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        {era.desc}
                    </p>
                    {isAnalyst && (
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-300">
                            <div className="flex justify-between items-center">
                                <span>Village GDP Growth (CAGR):</span>
                                <span className={`px-2 py-1 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {isPositive ? '+' : ''}{cagr}%
                                </span>
                            </div>
                        </div>
                    )}
                    </motion.div>
                );
                })}
            </div>

            {/* Right Column: Sticky Charts */}
            <div className="lg:col-span-7 relative">
                <div className="sticky top-24 space-y-8">
                
                <ChartContainer 
                    title="Village Economy (GDP)" 
                    color={meta.color}
                    onToggleCurrency={() => setGdpCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                    currencyMode={gdpCurrencyMode}
                >
                    <AnimatedChart 
                    data={data} 
                    dataKey="Village_GDP" 
                    color={meta.color} 
                    height={300}
                    syncId="villageSync"
                    currencyMode={gdpCurrencyMode}
                    />
                </ChartContainer>

                <ChartContainer 
                    title="Military Strength"
                    color={meta.color}
                >
                    <AnimatedChart 
                    data={data} 
                    dataKey="Field_Strength" 
                    color={meta.color} 
                    height={200}
                    syncId="villageSync"
                    type="area"
                    />
                </ChartContainer>

                </div>
            </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default VillageDashboard;