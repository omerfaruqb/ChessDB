// ApiResponse<T> is a generic interface that represents a response from an API.
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    error?: ApiError;
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
    success: true;
}

export interface ApiErrorResponse<T> extends ApiResponse<T> {
    success: false;
    error: ApiError;
}

// Error interface
export interface ApiError {
    message: string;
    code: string;
    details?: any;
}



const isApiErrorResponse = (err: unknown): err is ApiErrorResponse<any> => {
    return (
      typeof err === 'object' && 
      err !== null && 
      'error' in err &&
      typeof (err as any).error === 'object' &&
      (err as any).error !== null &&
      'message' in (err as any).error
    );
  };