import { ClientError, ServerError } from './errors';
import { Logger } from './logger';
import { ErrorHandler } from './error-handler';

export class RequestExecutor {
  constructor(
    private readonly timeout: number,
    private readonly maxRetries: number,
    private readonly initialRetryDelay: number,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler
  ) {}

  async execute<T>(
    url: string,
    options: RequestInit,
    requestId: string,
    attempt = 0
  ): Promise<T> {
    try {
      this.logger.debug('Attempting request', { requestId, attempt, url });
      const response = await this.fetchWithTimeout(url, options);
      return this.handleResponse<T>(response, requestId, attempt);
    } catch (error) {
      return this.handleError(error, url, options, requestId, attempt);
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private handleResponse<T>(
    response: Response,
    requestId: string,
    attempt: number
  ): Promise<T> {
    if (!response.ok) {
      if (response.status >= 500) {
        throw new ServerError(`Server error: ${response.status}`, response.status);
      }
      throw new ClientError(`Client error: ${response.status}`, response.status);
    }

    this.logger.info('Request successful', { 
      requestId, 
      attempt, 
      status: response.status 
    });

    return response.json() as Promise<T>;
  }

  private async handleError<T>(
    error: unknown,
    url: string,
    options: RequestInit,
    requestId: string,
    attempt: number
  ): Promise<T> {
    const normalizedError = this.errorHandler.normalize(error);
    this.logger.error('Request failed', { 
      requestId, 
      attempt, 
      error: normalizedError.message,
      status: normalizedError instanceof ServerError ? normalizedError.status : undefined
    });

    if (attempt >= this.maxRetries || normalizedError instanceof ClientError) {
      throw normalizedError;
    }

    return this.retry(url, options, requestId, attempt, normalizedError);
  }

  private async retry<T>(
    url: string,
    options: RequestInit,
    requestId: string,
    attempt: number,
    error: Error
  ): Promise<T> {
    const delay = this.initialRetryDelay * Math.pow(2, attempt);
    this.logger.debug('Retrying request', { 
      requestId, 
      attempt, 
      nextAttempt: attempt + 1,
      delay 
    });

    console.log(error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return this.execute<T>(url, options, requestId, attempt + 1);
  }
}
