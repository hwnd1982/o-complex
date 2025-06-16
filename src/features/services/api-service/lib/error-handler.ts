import { ServerError, ClientError } from './errors';

// Интерфейс для системы мониторинга
interface MonitoringSystem {
  captureException(error: Error): void;
}

export class ErrorHandler {
  private monitoring?: MonitoringSystem;

  // Инициализация системы мониторинга (опционально)
  initMonitoring(monitoring: MonitoringSystem) {
    this.monitoring = monitoring;
  }

  normalize(error: unknown): Error {
    let normalizedError: Error;
    
    if (error instanceof ClientError || error instanceof ServerError) {
      normalizedError = error;
    } else if (error instanceof Error && error.name === 'AbortError') {
      normalizedError = new ServerError('Request timed out', 504);
    } else if (error instanceof TypeError) {
      normalizedError = new ServerError('Network error', 503);
    } else {
      normalizedError = new ServerError('Unknown server error', 500);
    }

    // Отправка ошибок в систему мониторинга
    this.reportToMonitoring(normalizedError);
    
    return normalizedError;
  }

  private reportToMonitoring(error: Error) {
    if (!this.monitoring) return;
    
    // Отправляем только серверные ошибки и критические клиентские
    if (error instanceof ServerError || 
        (error instanceof ClientError && error.status >= 400)) {
      this.monitoring.captureException(error);
    }
  }
}
