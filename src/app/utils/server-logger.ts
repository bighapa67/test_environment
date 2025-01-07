type LogType = 'error' | 'build' | 'runtime';

interface Session {
  timestamp: string;
  sessionId: string;
  startedAt: number;
}

interface LogResponse {
  logs: {
    error: string;
    build: string;
    runtime: string;
  };
  session: Session | null;
}

export const serverLogger = {
  error: async (message: string, error?: any) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'error', message, error })
      });
    } catch (e) {
      console.error('Failed to write error log:', e);
    }
  },

  build: async (message: string) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'build', message })
      });
    } catch (e) {
      console.error('Failed to write build log:', e);
    }
  },

  runtime: async (message: string) => {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'runtime', message })
      });
    } catch (e) {
      console.error('Failed to write runtime log:', e);
    }
  },

  // Get all terminal logs
  getLogs: async () => {
    try {
      const response = await fetch('/api/logs');
      const data: LogResponse = await response.json();
      return data.logs;
    } catch (e) {
      console.error('Failed to read logs:', e);
      return {
        error: '',
        build: '',
        runtime: ''
      };
    }
  },

  // Get current session info
  getSession: async () => {
    try {
      const response = await fetch('/api/logs');
      const data: LogResponse = await response.json();
      return data.session;
    } catch (e) {
      console.error('Failed to get session:', e);
      return null;
    }
  },

  // Check if this is a new session since last check
  isNewSession: async (lastKnownTimestamp?: string) => {
    const session = await serverLogger.getSession();
    if (!session) return false;
    if (!lastKnownTimestamp) return true;
    return new Date(session.timestamp) > new Date(lastKnownTimestamp);
  }
}; 