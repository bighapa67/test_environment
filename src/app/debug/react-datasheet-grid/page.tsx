'use client'

import { useState, useEffect } from 'react'
import { DebugDatasheetGrid, LayerData } from '@/app/components/DebugDatasheetGrid'
import { logger } from '@/app/utils/logger'
import { serverLogger } from '@/app/utils/server-logger'

// Create component-specific logger
const pageLogger = logger.forComponent('DebugDatasheetGridPage');

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

  // Fetch terminal logs
  const updateTerminalLogs = async () => {
    const logs = await serverLogger.getLogs();
    setTerminalLogs(logs);
  };

  useEffect(() => {
    pageLogger.log('Component mounted with initial data:', gridData);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    pageLogger.log('System dark mode preference:', prefersDark);
    
    // Update terminal logs periodically
    const interval = setInterval(updateTerminalLogs, 5000);
    
    return () => {
      pageLogger.log('Component will unmount');
      clearInterval(interval);
    };
  }, []);

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

  const toggleTheme = () => {
    pageLogger.log('Theme toggle clicked, current state:', { isDarkMode });
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-[calc(100vh-8rem)] p-6 transition-colors duration-200
                    ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Debug Datasheet Grid
          </h1>
          <button
            onClick={toggleTheme}
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
            <DebugDatasheetGrid 
              onChange={handleChange}
              value={gridData}
              height={352}
              className="mb-4"
              title="Layer Configuration"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Terminal Logs Section */}
        <div className={`p-4 rounded-lg shadow-sm border
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
            onClick={updateTerminalLogs}
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
};

export default DebugPage; 