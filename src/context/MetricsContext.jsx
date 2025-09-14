import { createContext, useState, useContext } from 'react';

const MetricsContext = createContext();

export function MetricsProvider({ children }) {
  const [showMetrics, setShowMetrics] = useState(false);

  const toggleMetrics = () => {
    setShowMetrics(prev => !prev);
  };

  return (
    <MetricsContext.Provider value={{ showMetrics, toggleMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};
