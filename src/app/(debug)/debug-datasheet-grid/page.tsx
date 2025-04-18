'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DarkModeDataGrid, LayerData } from '@/app/components/DarkModeDataGrid'
import { logger } from '@/app/utils/logger'
import { serverLogger } from '@/app/utils/server-logger'

// Create component-specific logger
const pageLogger = logger.forComponent('DarkModeDataGridPage');

const DummyCard = ({ title, isDarkMode }: { title: string; isDarkMode: boolean }) => (
  <div className={`p-6 mb-4 rounded-lg shadow-sm border
                  ${isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-200' 
                    : 'bg-white border-gray-200 text-gray-900'}`}>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
    </p>
  </div>
);

const defaultData: LayerData[] = [
  { layer: 1, spread: "0.50", max_waves: 5, filled_waves: 5 },
  { layer: 2, spread: "0.75", max_waves: 5, filled_waves: 2 },
  { layer: 3, spread: "1.00", max_waves: 5, filled_waves: 0 },
  { layer: 4, spread: "1.25", max_waves: 5, filled_waves: 0 },
  { layer: 5, spread: "1.50", max_waves: 5, filled_waves: 0 },
  { layer: 6, spread: "1.75", max_waves: 5, filled_waves: 0 },
  { layer: 7, spread: "2.00", max_waves: 5, filled_waves: 0 },
  { layer: 8, spread: "2.25", max_waves: 5, filled_waves: 0 },
  { layer: 9, spread: "2.50", max_waves: 5, filled_waves: 0 },
  { layer: 10, spread: "2.75", max_waves: 5, filled_waves: 0 },
];

const DebugPage = () => {
  const [gridData, setGridData] = useState<LayerData[]>(defaultData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{
    error: string;
    build: string;
    runtime: string;
  }>({ error: '', build: '', runtime: '' });
  const [isPolling, setIsPolling] = useState(true);
  const pollTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);
  const errorCountRef = useRef(0);

  // Fetch terminal logs with error handling and backoff
  const updateTerminalLogs = useCallback(async () => {
    if (!isPolling || !isMountedRef.current) return;

    try {
      const logs = await serverLogger.getLogs();
      if (!isMountedRef.current) return; // Check again before state update
      setTerminalLogs(logs);
      errorCountRef.current = 0; // Reset error count on success
      
      // Schedule next poll only if still mounted and polling
      if (isMountedRef.current && isPolling) {
        pollTimeoutRef.current = setTimeout(() => {
          updateTerminalLogs();
        }, 5000);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      errorCountRef.current++;
      console.error('Failed to fetch logs:', error);
      
      // Exponential backoff with max delay of 30 seconds
      const backoffDelay = Math.min(Math.pow(2, errorCountRef.current) * 1000, 30000);
      
      // Schedule retry only if still mounted and polling
      if (isMountedRef.current && isPolling) {
        pollTimeoutRef.current = setTimeout(() => {
          updateTerminalLogs();
        }, backoffDelay);
      }
    }
  }, [isPolling]);

  // Initialize polling and dark mode
  useEffect(() => {
    pageLogger.log('Component mounted with initial data:', gridData);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    pageLogger.log('System dark mode preference:', prefersDark);
    
    // Start polling
    updateTerminalLogs();
    
    // Watch for visibility changes
    const handleVisibilityChange = () => {
      setIsPolling(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false; // Mark as unmounted
      pageLogger.log('Component will unmount');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = undefined;
      }
      setIsPolling(false);
    };
  }, []);

  // Restart polling when isPolling changes
  useEffect(() => {
    if (isPolling && isMountedRef.current) {
      updateTerminalLogs();
    } else if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = undefined;
    }
  }, [isPolling, updateTerminalLogs]);

  // Dark mode effect
  useEffect(() => {
    pageLogger.log('Dark mode changed:', { isDarkMode });
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleChange = (data: LayerData[]) => {
    pageLogger.log('Grid data changed:', {
      previousData: gridData,
      newData: data,
      diff: data.map((row, i) => ({
        layer: row.layer,
        changes: Object.entries(row).filter(([key, value]) => 
          gridData[i]?.[key as keyof LayerData] !== value
        )
      })).filter(d => d.changes.length > 0)
    });
    setGridData(data);
  }

  // Manual refresh handler
  const handleManualRefresh = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    updateTerminalLogs();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 
                    ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-8 space-y-6">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Debug Mode: Datasheet Grid
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Testing dark mode implementation with live logging
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className={`px-4 py-2 rounded-md transition-colors duration-200
                      ${isDarkMode 
                        ? 'bg-white text-gray-900 hover:bg-gray-100' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left column with cards */}
          <div className="w-2/3 space-y-4">
            <DummyCard title="Overview" isDarkMode={isDarkMode} />
            <DummyCard title="Statistics" isDarkMode={isDarkMode} />
            <DummyCard title="Recent Activity" isDarkMode={isDarkMode} />
            <DummyCard title="Performance" isDarkMode={isDarkMode} />
            <DummyCard title="Analytics" isDarkMode={isDarkMode} />
          </div>
          
          {/* Right column with grid */}
          <div className="w-1/3">
            <div className={`rounded-lg shadow-sm border
                          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <DarkModeDataGrid 
                onChange={handleChange}
                value={gridData}
                height={352}
                className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                title="Layer Configuration"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Terminal Logs Section */}
        <div className={`rounded-lg shadow-sm border p-4
                      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Terminal Logs
          </h2>
          
          {/* Error Logs */}
          {terminalLogs.error && (
            <div className="mb-4">
              <h3 className="text-red-500 font-medium mb-2">Errors</h3>
              <pre className={`p-3 rounded text-sm overflow-auto max-h-40
                           ${isDarkMode 
                             ? 'bg-red-900/20 text-red-200' 
                             : 'bg-red-50 text-red-800'}`}>
                {terminalLogs.error}
              </pre>
            </div>
          )}

          {/* Build Logs */}
          {terminalLogs.build && (
            <div className="mb-4">
              <h3 className="text-blue-500 font-medium mb-2">Build Output</h3>
              <pre className={`p-3 rounded text-sm overflow-auto max-h-40
                           ${isDarkMode 
                             ? 'bg-blue-900/20 text-blue-200' 
                             : 'bg-blue-50 text-blue-800'}`}>
                {terminalLogs.build}
              </pre>
            </div>
          )}

          {/* Runtime Logs */}
          {terminalLogs.runtime && (
            <div>
              <h3 className="text-green-500 font-medium mb-2">Runtime Output</h3>
              <pre className={`p-3 rounded text-sm overflow-auto max-h-40
                           ${isDarkMode 
                             ? 'bg-green-900/20 text-green-200' 
                             : 'bg-green-50 text-green-800'}`}>
                {terminalLogs.runtime}
              </pre>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            className={`mt-4 px-3 py-1 rounded-md text-sm
                     ${isDarkMode 
                       ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                       : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
          >
            Refresh Terminal Logs
          </button>
        </div>
      </div>
    </div>
  );
}

export default DebugPage; 