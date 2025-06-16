import { 
  API_TIMEOUT, 
  MAX_RETRIES, 
  INITIAL_RETRY_DELAY,
  MAX_PARALLEL_REQUESTS
} from '@/shared/config/api';
import { Logger, ErrorHandler, RequestScheduler, RequestExecutor } from './lib';

// Импорт системы мониторинга (пример для Sentry)
import * as Sentry from '@sentry/nextjs';

export class ApiService {
  private readonly logger = new Logger();
  private readonly errorHandler = new ErrorHandler();
  private readonly scheduler = new RequestScheduler(MAX_PARALLEL_REQUESTS);
  private readonly executor: RequestExecutor;

  constructor() {
    // Инициализируем мониторинг в продакшн режиме
    if (process.env.NODE_ENV === 'production') {
      this.errorHandler.initMonitoring({
        captureException: (error) => {
          Sentry.captureException(error);
          
          // Дополнительные действия при ошибке
          console.error('[MONITORING] Reported error:', error);
        }
      });
    }

    this.executor = new RequestExecutor(
      API_TIMEOUT,
      MAX_RETRIES,
      INITIAL_RETRY_DELAY,
      this.logger,
      this.errorHandler
    );
  }

  async request<T>(
    url: string, 
    options: RequestInit = {}, 
    priority: number = 0
  ): Promise<T> {
    const requestId = this.generateRequestId();
    this.logger.info('Request started', { requestId, url, priority });

    return this.scheduler.enqueue(
      () => this.executor.execute<T>(url, options, requestId),
      priority,
      requestId
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
