const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_ROOT = './console_logs';
const TERMINAL_DIR = path.join(LOG_ROOT, 'terminal');
const BUILD_LOG = path.join(TERMINAL_DIR, 'build.log');

// Ensure directory structure exists
[LOG_ROOT, TERMINAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Clear previous logs
fs.writeFileSync(BUILD_LOG, '');

// Start Next.js dev server and capture output
const devProcess = spawn('next', ['dev'], {
  stdio: 'pipe',
  shell: true
});

// Log timestamp
const timestamp = new Date().toISOString();
fs.appendFileSync(BUILD_LOG, `\n[${timestamp}] Starting dev server\n`);

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