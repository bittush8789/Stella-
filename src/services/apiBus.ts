import { ApiLogEntry, ApiResponse } from '../types/microservices';

type LogListener = (logs: ApiLogEntry[]) => void;

class ApiBus {
  private logs: ApiLogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  public logCall(
    service: ApiLogEntry['service'],
    method: ApiLogEntry['method'],
    endpoint: string,
    status: number,
    durationMs: number,
    requestPayload?: any,
    responsePayload?: any
  ) {
    const entry: ApiLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      service,
      method,
      endpoint,
      status,
      durationMs,
      requestPayload,
      responsePayload
    };

    this.logs = [entry, ...this.logs.slice(0, 99)];
    this.notify();
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => this.listeners.delete(listener);
  }

  public getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.notify();
  }

  private notify() {
    const current = [...this.logs];
    this.listeners.forEach((listener) => listener(current));
  }
}

export const apiBus = new ApiBus();

export function createSuccessResponse<T>(
  service: ApiLogEntry['service'],
  data: T,
  statusCode = 200,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    statusCode,
    service,
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse<T = undefined>(
  service: ApiLogEntry['service'],
  message: string,
  statusCode = 400
): ApiResponse<T> {
  return {
    success: false,
    message,
    statusCode,
    service,
    timestamp: new Date().toISOString()
  };
}

// Simulated network latency
export async function simulateLatency(min = 40, max = 120): Promise<number> {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, duration));
  return duration;
}
