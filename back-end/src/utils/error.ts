export interface ApiError extends Error {
  statusCode?: number;
}

export function handleError(error: unknown) {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    console.log("Server Error", apiError.message);
    throw {
      statusCode: apiError.statusCode || 500,
      message: apiError.message || 'An unexpected error occurred'
    };
  } else {
    throw {
      statusCode: 500,
      message: 'An unknown error occurred'
    };
  }
}