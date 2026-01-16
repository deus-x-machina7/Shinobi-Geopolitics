import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line
} from 'recharts';
import { useViewMode } from '../context/ViewContext';
import { SimulationYear, formatCurrency } from '../data/simulationData';

interface AnimatedChartProps {
  data: SimulationYear[];
  dataKey: keyof SimulationYear;
  color: string;
  height?: number;
  syncId?: string;
  type?: 'area' | 'line';
  currencyMode?: 'RYO' | 'USD';
}

const WAR_YEARS = [16, 36, 46];

const CustomTooltip = ({ active, payload, label, currencyMode }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = currencyMode 
        ? formatCurrency(value, currencyMode)
        : new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(value);

    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-400 text-xs font-mono mb-1">Year {label}</p>
        <p className="text-white font-mono font-bold text-sm">
          {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};

const AnimatedChart: React.FC<AnimatedChartProps> = ({ 
  data, 
  dataKey, 
  color, 
  height = 300,
  syncId,
  type = 'area',
  currencyMode
}) => {
  const { viewMode } = useViewMode();
  const isAnalyst = viewMode === 'analyst';

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <div className="w-full transition-all duration-500" style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          data={data}
          syncId={syncId}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="Year" 
            hide={!isAnalyst} 
            stroke="#475569"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
          />
          
          <YAxis 
            hide={!isAnalyst} 
            stroke="#475569"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(value) => currencyMode 
                ? formatCurrency(value, currencyMode) 
                : new Intl.NumberFormat('en-US', { notation: "compact" }).format(value)
            }
          />
          
          {isAnalyst && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
          
          <Tooltip 
            content={<CustomTooltip currencyMode={currencyMode} />} 
            cursor={{ stroke: '#475569', strokeWidth: 1 }} 
          />

          {WAR_YEARS.map(year => (
            <ReferenceLine 
              key={year} 
              x={year} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={isAnalyst ? { value: 'WAR', fill: '#ef4444', fontSize: 10, position: 'insideTop' } : ''} 
            />
          ))}

          {/* @ts-ignore */}
          <DataComponent
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={isAnalyst ? 1 : 3}
            fillOpacity={1}
            fill={`url(#color${dataKey})`}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </ChartComponent>
      </ResponsiveContainer>
      
      {/* Narrative Mode Simple Label */}
      {!isAnalyst && (
        <div className="flex justify-between text-xs text-slate-500 font-mono mt-2 px-2">
          <span>Year 0</span>
          <span>Year 60</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedChart;