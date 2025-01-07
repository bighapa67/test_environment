'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/app/utils/logger'
import { serverLogger } from '@/app/utils/server-logger'

// Create component-specific logger
const pageLogger = logger.forComponent('DarkModePage');

// Visual log indicator component
const LogIndicator = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg 
                    animate-fade-in-out text-sm max-w-md truncate">
      🔍 {message}
    </div>
  );
};

// Debug version of the page component
const DebugPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logMessage, setLogMessage] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<{
    error: string;
    build: string;
    runtime: string;
  }>({ error: '', build: '', runtime: '' });
  
  // Log with visual indicator
  const logWithIndicator = (message: string, ...args: any[]) => {
    pageLogger.log(message, ...args);
    setLogMessage(message);
  };

  // Fetch terminal logs
  const updateTerminalLogs = async () => {
    const logs = await serverLogger.getLogs();
    setTerminalLogs(logs);
  };

  useEffect(() => {
    logWithIndicator('Component mounted, initial dark mode:', isDarkMode);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    logWithIndicator('System dark mode preference:', prefersDark);
    
    // Update terminal logs periodically
    const interval = setInterval(updateTerminalLogs, 5000);
    
    return () => {
      logWithIndicator('Component will unmount');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    logWithIndicator('Dark mode changed:', { isDarkMode });
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    logWithIndicator('Theme toggle clicked, current state:', { isDarkMode });
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 
                    ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dark Mode Debug Page</h1>
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

        <div className="space-y-4">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
            <p>Current Theme: {isDarkMode ? 'Dark' : 'Light'}</p>
            <button
              onClick={() => pageLogger.export()}
              className={`mt-4 px-3 py-1 rounded-md text-sm
                        ${isDarkMode 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              Export Browser Logs
            </button>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
              className={`mt-4 px-3 py-1 rounded-md text-sm
                        ${isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Refresh Terminal Logs
            </button>
          </div>
        </div>
      </div>
      
      {logMessage && <LogIndicator message={logMessage} />}
    </div>
  );
};

export default DebugPage; 