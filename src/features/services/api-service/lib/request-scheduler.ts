import { Logger } from './logger';

type QueueTask<T = unknown> = {
  task: () => Promise<T>;
  priority: number;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export class RequestScheduler {
  private queue: QueueTask[] = [];
  private activeRequests = 0;
  private logger = new Logger();

  constructor(private readonly maxParallelRequests: number) {}

  enqueue<T>(
    task: () => Promise<T>,
    priority: number,
    requestId: string
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        priority,
        resolve: resolve as (value: unknown) => void,
        reject
      });

      this.queue.sort((a, b) => b.priority - a.priority);
      this.logger.debug('Request queued', { 
        requestId, 
        queueSize: this.queue.length,
        priority
      });

      this.processQueue();
    });
  }

  private processQueue() {
    while (this.queue.length > 0 && this.activeRequests < this.maxParallelRequests) {
      this.activeRequests++;
      const task = this.queue.shift()!;
      
      task.task()
        .then(task.resolve)
        .catch(task.reject)
        .finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
    }
  }
}
