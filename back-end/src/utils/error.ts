export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFLICT = 'CONFLICT'
}

export interface ApiError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

export class ApiError extends Error implements ApiError {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.timestamp = new Date().toISOString();
  }
}

export function handleError(error: unknown): never {
  if (error instanceof ApiError) {
    console.error(`[${error.code}] ${error.message}`, {
      statusCode: error.statusCode,
      details: error.details,
      timestamp: error.timestamp
    });
    throw error;
  }

  if (error instanceof Error) {
    console.error('[UNHANDLED_ERROR]', error);
    throw new ApiError(
      ErrorCode.INTERNAL_ERROR,
      500,
      'An unexpected error occurred',
      { originalError: error.message }
    );
  }

  console.error('[UNKNOWN_ERROR]', error);
  throw new ApiError(
    ErrorCode.INTERNAL_ERROR,
    500,
    'An unknown error occurred'
  );
}

export function createErrorResponse(error: ApiError) {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
      timestamp: error.timestamp
    }
  };
}