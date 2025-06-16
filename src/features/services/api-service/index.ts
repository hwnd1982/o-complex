import { ApiService } from './core';

export { ApiService } from './core';
export { ServerError, ClientError } from './lib';
export const apiService = new ApiService();

// import { 
//   API_TIMEOUT, 
//   MAX_RETRIES, 
//   INITIAL_RETRY_DELAY,
//   MAX_PARALLEL_REQUESTS
// } from '@/shared/config/api';

// type QueueTask<T = unknown> = {
//   task: () => Promise<T>;
//   priority: number;
//   resolve: (value: T) => void;
//   reject: (reason?: unknown) => void;
// };

// class ApiService {
//   private queue: QueueTask[] = [];
//   private activeRequests = 0;
//   private isProcessing = false;

//   private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
//     if (process.env.NODE_ENV === 'development') {
//       const timestamp = new Date().toISOString();
//       const logEntry = { timestamp, level, message, ...data };
//       console[level](JSON.stringify(logEntry));
//     }
//   }

//   async request<T>(
//     url: string, 
//     options: RequestInit = {}, 
//     priority: number = 0
//   ): Promise<T> {
//     const requestId = Math.random().toString(36).substring(2, 9);
//     this.log('info', 'Request started', { requestId, url, priority });

//     return new Promise<T>((resolve, reject) => {
//       const task = async (): Promise<T> => {
//         try {
//           const result = await this.executeRequest<T>(url, options, requestId);
//           resolve(result);
//           return result;
//         } catch (error) {
//           reject(error);
//           throw error;
//         } finally {
//           this.activeRequests--;
//           this.processQueue();
//         }
//       };

//       this.queue.push({
//         task: task as () => Promise<unknown>,
//         priority,
//         resolve: resolve as (value: unknown) => void,
//         reject
//       });

//       this.queue.sort((a, b) => b.priority - a.priority);
//       this.log('debug', 'Request queued', { 
//         requestId, 
//         queueSize: this.queue.length,
//         priority
//       });

//       this.processQueue();
//     });
//   }

//   private processQueue() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;

//     while (this.queue.length > 0 && this.activeRequests < MAX_PARALLEL_REQUESTS) {
//       this.activeRequests++;
//       const task = this.queue.shift()!;
      
//       task.task()
//         .then(task.resolve)
//         .catch(task.reject)
//         .finally(() => {
//           this.isProcessing = false;
//           this.processQueue();
//         });
//     }

//     this.isProcessing = false;
//   }

//   private async executeRequest<T>(
//     url: string,
//     options: RequestInit,
//     requestId: string,
//     attempt = 0
//   ): Promise<T> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

//     try {
//       this.log('debug', 'Attempting request', { 
//         requestId, 
//         attempt, 
//         url 
//       });

//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         if (response.status >= 500) {
//           throw new ServerError(`Server error: ${response.status}`, response.status);
//         }
//         throw new ClientError(`Client error: ${response.status}`, response.status);
//       }

//       this.log('info', 'Request successful', { 
//         requestId, 
//         attempt, 
//         status: response.status 
//       });

//       return response.json() as Promise<T>;
//     } catch (error) {
//       clearTimeout(timeoutId);
      
//       let errorToHandle: Error;
      
//       // Преобразуем системные ошибки в ServerError
//       if (error instanceof Error && error.name === 'AbortError') {
//         errorToHandle = new ServerError('Request timed out', 504);
//       } else if (error instanceof TypeError) {
//         errorToHandle = new ServerError('Network error', 503);
//       } else if (error instanceof ClientError || error instanceof ServerError) {
//         errorToHandle = error;
//       } else {
//         errorToHandle = new ServerError('Unknown server error', 500);
//       }

//       const errorMessage = errorToHandle.message;
//       this.log('error', 'Request failed', { 
//         requestId, 
//         attempt, 
//         error: errorMessage,
//         status: errorToHandle instanceof ServerError ? errorToHandle.status : undefined
//       });

//       return this.handleRetry(errorToHandle, url, options, requestId, attempt);
//     }
//   }

//   private async handleRetry<T>(
//     error: unknown,
//     url: string,
//     options: RequestInit,
//     requestId: string,
//     attempt: number
//   ): Promise<T> {
//     if (attempt >= MAX_RETRIES || error instanceof ClientError) {
//       throw error;
//     }

//     const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
//     this.log('debug', 'Retrying request', { 
//       requestId, 
//       attempt, 
//       nextAttempt: attempt + 1,
//       delay 
//     });

//     await new Promise(resolve => setTimeout(resolve, delay));

//     return this.executeRequest<T>(url, options, requestId, attempt + 1);
//   }
// }

// class ServerError extends Error {
//   status: number;

//   constructor(message: string, status: number) {
//     super(message);
//     this.name = 'ServerError';
//     this.status = status;
//   }
// }

// class ClientError extends Error {
//   status: number;

//   constructor(message: string, status: number) {
//     super(message);
//     this.name = 'ClientError';
//     this.status = status;
//   }
// }

// export const apiService = new ApiService();
// export { ServerError, ClientError };