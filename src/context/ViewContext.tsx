import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'narrative' | 'analyst';

interface ViewContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('narrative');

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'narrative' ? 'analyst' : 'narrative');
  };

  return (
    <ViewContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewProvider');
  }
  return context;
};