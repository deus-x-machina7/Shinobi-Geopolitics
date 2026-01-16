import React from 'react';
import { useViewMode } from '../context/ViewContext';
import { Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const DataLens = () => {
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full p-2 pointer-events-auto shadow-2xl flex items-center gap-4"
      >
        <div className="px-4 py-1 text-xs font-mono text-slate-400 border-r border-slate-700">
          DATA LENS OS v2.4
        </div>
        
        <button
          onClick={toggleViewMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            viewMode === 'narrative' 
              ? 'bg-slate-100 text-slate-900' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={16} />
          <span>Narrative</span>
        </button>

        <button
          onClick={toggleViewMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            viewMode === 'analyst' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity size={16} />
          <span>Analyst</span>
        </button>
      </motion.div>
    </div>
  );
};

export default DataLens;