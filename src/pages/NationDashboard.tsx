import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { SIMULATION_DATA, NATION_METADATA, formatCurrency } from '../data/simulationData';
import AnimatedChart from '../components/AnimatedChart';
import { useViewMode } from '../context/ViewContext';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldAlert, Coins, Building2 } from 'lucide-react';

const GROWTH_RATES: Record<string, number[]> = {
  Fire: [23.70, 10.59, 11.76, 9.83],
  Lightning: [12.30, 12.53, 14.63, 12.81],
  Earth: [34.10, 8.11, 7.40, 5.56],
  Wind: [44.22, 3.71, 5.75, 3.24],
  Water: [27.23, 9.41, 2.94, 10.85],
  Rain: [14.39, 3.07, 1.43, 1.12]
};

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

const NationDashboard = () => {
  const { nationId } = useParams<{ nationId: string }>();
  const { viewMode } = useViewMode();
  const [gdpCurrencyMode, setGdpCurrencyMode] = useState<'RYO' | 'USD'>('RYO');
  
  if (!nationId || !SIMULATION_DATA[nationId]) {
    return <Navigate to="/" />;
  }

  const data = SIMULATION_DATA[nationId];
  const meta = NATION_METADATA[nationId];
  const isAnalyst = viewMode === 'analyst';

  // Stats for the final year
  const finalStats = data[data.length - 1];

  const eras = [
    { start: 0, end: 15, title: "The Era of Peace", desc: "Initial stability and industrial setup. GDP growth is steady as village infrastructure solidifies." },
    { start: 16, end: 35, title: "Post First Great War", desc: "Conflict erupts. Military spending spikes while civilian sectors suffer. Population growth slows." },
    { start: 36, end: 45, title: "Post Second Great War", desc: "A brief recovery followed by intense devastation. Black ops funding reaches its peak." },
    { start: 46, end: 60, title: "Post Third Great War", desc: "Post-war rebuilding. Economies shift towards administrative power and sustainability." }
  ];

  return (
    <div className="min-h-screen bg-void pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `radial-gradient(circle at center, ${meta.color}, transparent 70%)` 
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80" /> {/* Texture overlay */}
        
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-tighter"
          >
            {meta.fullName}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto font-light"
          >
            {meta.description}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
                to={`/village/${nationId}`}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 hover:border-slate-500 border border-slate-600 rounded-full text-slate-200 transition-all font-serif tracking-wide group"
            >
                <Building2 size={18} className="text-slate-400 group-hover:text-white" />
                <span>ENTER {meta.village_name.toUpperCase()}</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard 
            label="Est. Population" 
            value={new Intl.NumberFormat('en-US', { notation: "compact" }).format(finalStats.National_Pop)} 
            icon={Users} 
          />
          <StatCard 
            label="Total GDP" 
            value={finalStats.National_GDP} 
            isCurrency={true}
            icon={Coins} 
          />
          <StatCard 
            label="Military Personnel" 
            value={new Intl.NumberFormat('en-US').format(finalStats.Field_Strength + finalStats.Support_Strength + finalStats.Admin_Strength)} 
            icon={ShieldAlert} 
          />
          <StatCard 
            label="Per Capita" 
            value={finalStats.National_Per_Capita}
            isCurrency={true}
            icon={TrendingUp} 
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Narrative (Scrollytelling) */}
          <div className="lg:col-span-5 space-y-24">
             {eras.map((era, i) => {
               const growthRate = GROWTH_RATES[nationId]?.[i] ?? 0;
               
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
                   <p className="text-slate-400 leading-relaxed">
                     {era.desc}
                   </p>
                   {isAnalyst && (
                      <div className="mt-4 p-4 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                          <div className="flex justify-between items-center">
                              <span>National GDP Growth (CAGR):</span>
                              <span className={`px-2 py-1 rounded ${growthRate > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {growthRate > 0 ? '+' : ''}{growthRate.toFixed(2)}%
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
                title="Economic Trajectory (GDP)" 
                color={meta.color}
                onToggleCurrency={() => setGdpCurrencyMode(prev => prev === 'RYO' ? 'USD' : 'RYO')}
                currencyMode={gdpCurrencyMode}
              >
                <AnimatedChart 
                  data={data} 
                  dataKey="National_GDP" 
                  color={meta.color} 
                  height={300}
                  syncId="nationSync"
                  currencyMode={gdpCurrencyMode}
                />
              </ChartContainer>

              <ChartContainer 
                title="Population Growth"
                color={meta.color}
              >
                <AnimatedChart 
                  data={data} 
                  dataKey="National_Pop"
                  color={meta.color}
                  height={200}
                  syncId="nationSync"
                  type="area"
                />
              </ChartContainer>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NationDashboard;