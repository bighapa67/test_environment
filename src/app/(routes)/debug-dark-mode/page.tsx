'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/app/utils/logger'

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
  
  // Log with visual indicator
  const logWithIndicator = (message: string, ...args: any[]) => {
    pageLogger.log(message, ...args);
    setLogMessage(message);
  };

  useEffect(() => {
    logWithIndicator('Component mounted, initial dark mode:', isDarkMode);
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    logWithIndicator('System dark mode preference:', prefersDark);
    
    return () => {
      logWithIndicator('Component will unmount');
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
              Export Logs
            </button>
          </div>
        </div>
      </div>
      
      {logMessage && <LogIndicator message={logMessage} />}
    </div>
  );
};

export default DebugPage; 