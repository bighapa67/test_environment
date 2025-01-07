// Client-side logger implementation
interface LoggerInstance {
  log: (...args: any[]) => void;
  clear: () => void;
  export: () => void;
  getLogs: () => string;
  getArchived: () => Record<string, string>;
}

interface Logger {
  forComponent: (componentName: string) => LoggerInstance;
  forFeature: (featureName: string) => LoggerInstance;
  system: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
}

export const logger: Logger = {
  forComponent: (componentName: string) => {
    const storageKey = `debug_logs_${componentName}`;
    
    const appendToStorage = (entry: string) => {
      const currentLogs = localStorage.getItem(storageKey) || '';
      localStorage.setItem(storageKey, currentLogs + entry);
    };

    return {
      log: (...args: any[]) => {
        // Log to console
        console.log(`[${componentName}]`, ...args);
        
        // Log to storage with timestamp
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} | ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ')}\n`;
        
        appendToStorage(logEntry);
      },

      clear: () => {
        // Archive existing logs if any
        const currentLogs = localStorage.getItem(storageKey);
        if (currentLogs) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          localStorage.setItem(`${storageKey}_archive_${timestamp}`, currentLogs);
        }
        localStorage.setItem(storageKey, '');
      },

      export: () => {
        const logs = localStorage.getItem(storageKey) || '';
        const blob = new Blob([logs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${componentName}_debug.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      getLogs: () => localStorage.getItem(storageKey) || '',

      getArchived: () => {
        const archives: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(`${storageKey}_archive_`)) {
            archives[key] = localStorage.getItem(key) || '';
          }
        }
        return archives;
      }
    };
  },

  forFeature: (featureName: string) => {
    // Similar implementation as forComponent
    return logger.forComponent(`feature_${featureName}`);
  },

  system: {
    log: (...args: any[]) => {
      console.log('[System]', ...args);
    },
    error: (...args: any[]) => {
      console.error('[System Error]', ...args);
    }
  }
}; 