'use client'

import { useState, useEffect } from 'react'
import { DarkModeDataGrid, LayerData } from '@/app/components/DarkModeDataGrid'
import { logger } from '@/app/utils/logger'
import { serverLogger } from '@/app/utils/server-logger'

// Create component-specific logger
const pageLogger = logger.forComponent('DebugGridPage');

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
  const [terminalLogs, setTerminalLogs] = useState<{
    error: string;
    build: string;
    runtime: string;
  }>({ error: '', build: '', runtime: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch terminal logs
  const updateTerminalLogs = async () => {
    const logs = await serverLogger.getLogs();
    setTerminalLogs(logs);
  };

  useEffect(() => {
    pageLogger.log('Component mounted with initial data:', gridData);
    
    // Update terminal logs periodically
    const interval = setInterval(updateTerminalLogs, 5000);
    
    return () => {
      pageLogger.log('Component will unmount');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

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

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white p-2 rounded-lg shadow-sm border">
          <DarkModeDataGrid 
            onChange={handleChange}
            value={gridData}
            height={352}
            className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
            title="Layer Configuration"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Terminal Logs Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Terminal Logs</h2>
          
          {/* Error Logs */}
          {terminalLogs.error && (
            <div className="mb-4">
              <h3 className="text-red-500 font-medium mb-2">Errors</h3>
              <pre className="bg-red-50 text-red-800 p-3 rounded text-sm overflow-auto max-h-40">
                {terminalLogs.error}
              </pre>
            </div>
          )}

          {/* Build Logs */}
          {terminalLogs.build && (
            <div className="mb-4">
              <h3 className="text-blue-500 font-medium mb-2">Build Output</h3>
              <pre className="bg-blue-50 text-blue-800 p-3 rounded text-sm overflow-auto max-h-40">
                {terminalLogs.build}
              </pre>
            </div>
          )}

          {/* Runtime Logs */}
          {terminalLogs.runtime && (
            <div>
              <h3 className="text-green-500 font-medium mb-2">Runtime Output</h3>
              <pre className="bg-green-50 text-green-800 p-3 rounded text-sm overflow-auto max-h-40">
                {terminalLogs.runtime}
              </pre>
            </div>
          )}

          <button
            onClick={updateTerminalLogs}
            className="mt-4 px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
          >
            Refresh Terminal Logs
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebugPage 