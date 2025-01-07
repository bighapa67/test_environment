# React Component Debugging Workflow

## Overview
This document outlines a systematic approach to debugging React components using file-based logging. The workflow enables AI assistants to directly analyze component behavior through persistent logs rather than relying on manual console output sharing.

## Logging Structure

### Root Directory
All logs are stored in the `./console_logs` directory at the workspace root. This is the standard location that all AI assistants should use for reading and writing logs.

```
./console_logs/
├── components/           # Component-specific logs
│   ├── DataGrid/        # Example component logs
│   │   ├── debug.log    # Current debug session
│   │   └── archive/     # Previous debug sessions
│   └── OtherComponent/
├── features/            # Feature-specific logs
│   └── delete_row/      # Example feature logs
└── system/              # System-level logs
    └── errors.log
```

### 1. Logger Utility (`src/app/utils/logger.ts`)
```typescript
// Client-side logger implementation
export const logger = {
  // Create a new logger instance for a component
  forComponent: (componentName: string) => {
    const storageKey = `debug_logs_${componentName}`;
    
    const appendToStorage = (entry: string) => {
      const currentLogs = localStorage.getItem(storageKey) || '';
      localStorage.setItem(storageKey, currentLogs + entry);
    };

    return {
      log: (...args: any[]) => {
        // Log to console
        console.log(...args);
        
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

      // Export logs as downloadable file
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

      // Get all logs as string
      getLogs: () => localStorage.getItem(storageKey) || '',

      // Get archived logs
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

  // Similar implementations for feature and system loggers...
};

// Optional: Server-side API for persistent storage
export const saveLogsToServer = async (componentName: string, logs: string) => {
  try {
    await fetch('/api/debug-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ componentName, logs })
    });
  } catch (error) {
    console.error('Failed to save logs to server:', error);
  }
};
```

### 2. Server-Side API Route (`src/app/api/debug-logs/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_ROOT = './console_logs';

export async function POST(request: Request) {
  const { componentName, logs } = await request.json();
  
  const componentDir = path.join(LOG_ROOT, 'components', componentName);
  const logFile = path.join(componentDir, 'debug.log');

  // Ensure directory exists
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Write logs to file
  fs.writeFileSync(logFile, logs);

  return NextResponse.json({ success: true });
}
```

## Workflow Steps

### 1. Initial Setup
1. Create a debug version of the component (e.g., `DebugComponentName.tsx`)
2. Import the logger utility
3. Add initial logging points:
   - Component mounting
   - Prop changes
   - State updates
   - Event handlers
   - Critical operations

### 2. Development Phase
1. Implement new features in the debug version first
2. Add strategic log points:
```typescript
// Component lifecycle
useEffect(() => {
  logger.clear();
  logger.log('Component mounted with props:', props);
}, []);

// State changes
useEffect(() => {
  logger.log('State updated:', {
    previous: prevState,
    current: newState
  });
}, [dependencyValue]);

// Event handlers
const handleEvent = () => {
  logger.log('Event triggered with:', {
    currentState,
    eventData
  });
};
```

### 3. Testing & Debugging
1. Create a dedicated debug page/route
2. Exercise the component through various scenarios
3. Review logs to:
   - Track state changes
   - Verify event handling
   - Identify unexpected behavior
   - Debug edge cases

### 4. Analysis & Iteration
1. AI assistant can read logs directly
2. Add more detailed logging around problem areas
3. Compare behavior across different implementations
4. Verify fixes don't introduce new issues

### 5. Production Implementation
1. Port working solution to production component
2. Optionally retain key logging points
3. Consider adding production monitoring

## Best Practices

### Log Point Strategy
- Log entry/exit of critical functions
- Log state changes with before/after values
- Log user interactions and their effects
- Log any unexpected conditions
- Include timestamps for sequence analysis
- Structure complex data for easy parsing

### Example Log Points
```typescript
// Function entry/exit
logger.log('Function started:', { inputs });
try {
  // ... function logic
  logger.log('Function completed:', { result });
} catch (error) {
  logger.log('Function failed:', { error });
}

// State changes
logger.log('State update:', {
  trigger: 'user_action',
  previous: oldState,
  next: newState,
  diff: computeDiff(oldState, newState)
});

// User interactions
logger.log('User action:', {
  type: 'button_click',
  target: 'delete_row',
  context: { rowId, currentState }
});
```

### Debug Component Template
```typescript
import { logger } from '@/app/utils/logger';

// Create component-specific logger
const componentLogger = logger.forComponent('MyComponent');

export const DebugComponent = (props) => {
  // Add export button for logs if needed
  const handleExportLogs = () => {
    componentLogger.export();
  };

  useEffect(() => {
    componentLogger.clear();
    componentLogger.log('Component mounted');
    
    // Optionally save logs to server periodically
    const interval = setInterval(() => {
      const logs = componentLogger.getLogs();
      saveLogsToServer('MyComponent', logs);
    }, 5000);

    return () => {
      componentLogger.log('Component will unmount');
      clearInterval(interval);
    };
  }, []);

  // ... rest of the component
};
```

## Benefits
1. Persistent record of component behavior
2. Timestamped sequence of events
3. Detailed state tracking
4. Easy sharing of debugging information
5. AI assistant can directly analyze logs
6. No manual console copying required

## When to Use
- Implementing complex features
- Debugging state management
- Investigating race conditions
- Analyzing component lifecycle issues
- Testing edge cases
- Verifying fixes

## Note for AI Assistants
When this workflow is referenced:
1. Create debug versions of components
2. Implement comprehensive logging
3. Read logs directly for analysis
4. Suggest logging improvements
5. Help identify patterns in logs
6. Propose solutions based on log analysis 

## For AI Assistants: Log Access and Analysis

### Reading Logs
1. Check for existing logs in `./console_logs` first
2. Look in appropriate subdirectory:
   - Component-specific: `./console_logs/components/[ComponentName]/`
   - Feature-specific: `./console_logs/features/[FeatureName]/`
   - System-level: `./console_logs/system/`
3. Review both current (`debug.log`) and archived logs if available

### Writing Logs
1. Use appropriate logger instance:
   - `logger.forComponent()` for component-specific logs
   - `logger.forFeature()` for feature-specific logs
   - `logger.system` for system-level logs
2. Always use structured logging with timestamps
3. Archive previous logs when starting new debug sessions

### Analysis
1. Compare logs across debug sessions
2. Look for patterns in archived logs
3. Cross-reference component and feature logs
4. Check system logs for broader context 

## For AI Assistants: Accessing Browser Logs

### Local Development
1. Request the user to:
   - Open the debug version of the component
   - Perform the actions to reproduce the issue
   - Click the export button or run `componentLogger.export()`
   - Share the downloaded log file

### Production Debugging
1. If server-side logging is implemented:
   - Check logs in `./console_logs` directory
2. If using browser storage:
   - Request logs export from user
   - Analyze downloaded logs

### Log Analysis Tools
1. Browser logs will be available as downloadable text files
2. Server logs will be available in the filesystem
3. Both formats maintain the same structure and timestamp format
4. Compare logs from different sources to track issues across environments 