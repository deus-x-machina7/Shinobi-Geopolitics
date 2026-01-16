import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import DataLens from './DataLens';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="bg-void min-h-screen text-slate-200 selection:bg-indigo-500/30">
        {!isLanding && (
            <nav className="fixed top-0 left-0 right-0 z-40 bg-void/80 backdrop-blur border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="font-serif font-bold text-lg tracking-tight text-white hover:text-indigo-400 transition-colors">
                        SHINOBI GEOPOLITICS
                    </Link>
                    <div className="text-xs font-mono text-slate-500">
                        SIMULATION_YEAR_60
                    </div>
                </div>
            </nav>
        )}
        
        <main className={!isLanding ? "pt-16" : ""}>
            <Outlet />
        </main>
        
        <DataLens />
    </div>
  );
};

export default Layout;