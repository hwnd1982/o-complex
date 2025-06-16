export class Logger {
  log(
    level: 'debug' | 'info' | 'warn' | 'error', 
    message: string, 
    data?: Record<string, unknown>
  ) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logEntry = { timestamp, level, message, ...data };
      console[level](JSON.stringify(logEntry));
    }
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data);
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', message, data);
  }

  error(message: string, data?: Record<string, unknown>) {
    this.log('error', message, data);
  }
}
