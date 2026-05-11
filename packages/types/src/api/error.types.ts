export enum ErrorCode {
    // Auth
    UNAUTHORIZED           = 'UNAUTHORIZED',
    FORBIDDEN              = 'FORBIDDEN',
    TOKEN_EXPIRED          = 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS    = 'INVALID_CREDENTIALS',
    EMAIL_ALREADY_EXISTS   = 'EMAIL_ALREADY_EXISTS',
  
    // Resources
    NOT_FOUND              = 'NOT_FOUND',
    CONFLICT               = 'CONFLICT',
    VALIDATION_ERROR       = 'VALIDATION_ERROR',
  
    // Rate limiting
    RATE_LIMITED           = 'RATE_LIMITED',
    PLAN_LIMIT_EXCEEDED    = 'PLAN_LIMIT_EXCEEDED',
  
    // AI service
    AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
    AI_TIMEOUT             = 'AI_TIMEOUT',
  
    // Server
    INTERNAL_ERROR         = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE    = 'SERVICE_UNAVAILABLE',
  }