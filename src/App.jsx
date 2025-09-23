import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
