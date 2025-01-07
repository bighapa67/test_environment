import fs from 'fs';
import path from 'path';

const LOG_ROOT = './console_logs';
const API_DIR = path.join(LOG_ROOT, 'api');

// Ensure directory structure exists
[LOG_ROOT, API_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const serverLogger = {
  log: (route: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const routeFile = path.join(API_DIR, `${route}.log`);
    
    const logEntry = `${timestamp} | ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n`;
    fs.appendFileSync(routeFile, logEntry);
  },

  error: (route: string, message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const routeFile = path.join(API_DIR, `${route}-error.log`);
    
    const logEntry = `${timestamp} | ERROR: ${message}${error ? '\n' + JSON.stringify(error, null, 2) : ''}\n`;
    fs.appendFileSync(routeFile, logEntry);
  }
}; 