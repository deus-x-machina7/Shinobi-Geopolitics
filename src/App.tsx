import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ViewProvider } from './context/ViewContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import NationDashboard from './pages/NationDashboard';
import VillageDashboard from './pages/VillageDashboard';
import ComparisonDashboard from './pages/ComparisonDashboard';
import RainComparisonDashboard from './pages/RainComparisonDashboard';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <ViewProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="nation/:nationId" element={<NationDashboard />} />
            <Route path="village/:nationId" element={<VillageDashboard />} />
            <Route path="comparison" element={<ComparisonDashboard />} />
            <Route path="rain-anomaly" element={<RainComparisonDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ViewProvider>
  );
};

export default App;