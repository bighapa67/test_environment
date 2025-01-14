const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOG_ROOT = './console_logs';
const TERMINAL_DIR = path.join(LOG_ROOT, 'terminal');
const BUILD_LOG = path.join(TERMINAL_DIR, 'build.log');
const SESSION_MARKER = path.join(TERMINAL_DIR, 'session.marker');

// Ensure directory structure exists
[LOG_ROOT, TERMINAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate session marker
const createSessionMarker = () => {
  const timestamp = new Date().toISOString();
  const sessionId = crypto.randomBytes(4).toString('hex');
  const marker = {
    timestamp,
    sessionId,
    startedAt: Date.now()
  };
  
  fs.writeFileSync(SESSION_MARKER, JSON.stringify(marker, null, 2));
  return marker;
};

// Clear previous logs
fs.writeFileSync(BUILD_LOG, '');

// Create new session marker
const session = createSessionMarker();

// Start Next.js dev server and capture output
const devProcess = spawn('next', ['dev'], {
  stdio: 'pipe',
  shell: true
});

// Log session start
const sessionStartLog = `\n[${session.timestamp}] Starting new debug session ${session.sessionId}\n`;
fs.appendFileSync(BUILD_LOG, sessionStartLog);

// Capture stdout
devProcess.stdout.on('data', (data) => {
  const timestamp = new Date().toISOString();
  const output = `[${timestamp}] ${data}`;
  fs.appendFileSync(BUILD_LOG, output);
  process.stdout.write(data); // Still show in terminal
});

// Capture stderr
devProcess.stderr.on('data', (data) => {
  const timestamp = new Date().toISOString();
  const output = `[${timestamp}] ERROR: ${data}`;
  fs.appendFileSync(BUILD_LOG, output);
  process.stderr.write(data); // Still show in terminal
});

// Handle process exit
devProcess.on('close', (code) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(BUILD_LOG, `\n[${timestamp}] Dev server exited with code ${code}\n`);
}); 