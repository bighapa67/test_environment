import fs from 'fs';
import path from 'path';

const LOG_ROOT = './console_logs';
const TERMINAL_DIR = path.join(LOG_ROOT, 'terminal');
const ERROR_LOG = path.join(TERMINAL_DIR, 'error.log');
const BUILD_LOG = path.join(TERMINAL_DIR, 'build.log');
const RUNTIME_LOG = path.join(TERMINAL_DIR, 'runtime.log');

// Ensure directory structure exists
[LOG_ROOT, TERMINAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const serverLogger = {
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | ${message}\n${error ? JSON.stringify(error, null, 2) + '\n' : ''}`;
    fs.appendFileSync(ERROR_LOG, logEntry);
  },

  build: (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | ${message}\n`;
    fs.appendFileSync(BUILD_LOG, logEntry);
  },

  runtime: (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | ${message}\n`;
    fs.appendFileSync(RUNTIME_LOG, logEntry);
  },

  // Get all terminal logs
  getLogs: () => {
    return {
      error: fs.existsSync(ERROR_LOG) ? fs.readFileSync(ERROR_LOG, 'utf8') : '',
      build: fs.existsSync(BUILD_LOG) ? fs.readFileSync(BUILD_LOG, 'utf8') : '',
      runtime: fs.existsSync(RUNTIME_LOG) ? fs.readFileSync(RUNTIME_LOG, 'utf8') : ''
    };
  },

  // Clear all logs
  clear: () => {
    [ERROR_LOG, BUILD_LOG, RUNTIME_LOG].forEach(file => {
      if (fs.existsSync(file)) {
        fs.writeFileSync(file, '');
      }
    });
  }
}; 