import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_ROOT = './console_logs';
const TERMINAL_DIR = path.join(LOG_ROOT, 'terminal');
const ERROR_LOG = path.join(TERMINAL_DIR, 'error.log');
const BUILD_LOG = path.join(TERMINAL_DIR, 'build.log');
const RUNTIME_LOG = path.join(TERMINAL_DIR, 'runtime.log');
const SESSION_MARKER = path.join(TERMINAL_DIR, 'session.marker');

type LogType = 'error' | 'build' | 'runtime';

const LOG_FILES: Record<LogType, string> = {
  error: ERROR_LOG,
  build: BUILD_LOG,
  runtime: RUNTIME_LOG
};

// Ensure directory structure exists
[LOG_ROOT, TERMINAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export async function GET() {
  try {
    return NextResponse.json({
      logs: {
        error: fs.existsSync(ERROR_LOG) ? fs.readFileSync(ERROR_LOG, 'utf8') : '',
        build: fs.existsSync(BUILD_LOG) ? fs.readFileSync(BUILD_LOG, 'utf8') : '',
        runtime: fs.existsSync(RUNTIME_LOG) ? fs.readFileSync(RUNTIME_LOG, 'utf8') : ''
      },
      session: fs.existsSync(SESSION_MARKER) ? JSON.parse(fs.readFileSync(SESSION_MARKER, 'utf8')) : null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type, message, error } = await request.json();
    const timestamp = new Date().toISOString();
    
    if (!(type in LOG_FILES)) {
      return NextResponse.json({ error: 'Invalid log type' }, { status: 400 });
    }

    const logFile = LOG_FILES[type as LogType];
    const logEntry = `${timestamp} | ${message}\n${error ? JSON.stringify(error, null, 2) + '\n' : ''}`;
    fs.appendFileSync(logFile, logEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
} 