export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: ResponseMeta;
  }
  
  export interface ApiError {
    success: false;
    error: {
      code: string;
      message: string;
      details?: Record<string, string[]>;
      requestId?: string;
    };
  }
  
  export interface ResponseMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    meta: Required<ResponseMeta>;
  }
  
  export interface StreamChunk {
    type: 'text' | 'action' | 'complete' | 'error';
    content: string;
    metadata?: Record<string, unknown>;
  }