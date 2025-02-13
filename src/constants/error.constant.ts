export const ErrorConstants = {
  BAD_REQUEST: 400,
  BAD_REQUEST_MESSAGE: 'Bad request',
  UNAUTHORIZED: 401,
  UNAUTHORIZED_MESSAGE: 'Unauthorized',
  FORBIDDEN: 403,
  FORBIDDEN_MESSAGE: 'Forbidden',
  NOT_FOUND: 404,
  NOT_FOUND_MESSAGE: 'Not found',
  METHOD_NOT_ALLOWED: 405,
  METHOD_NOT_ALLOWED_MESSAGE: 'Method not allowed',
  CONFLICT: 409,
  CONFLICT_MESSAGE: 'Conflict',
  UNPROCESSABLE_ENTITY: 422,
  UNPROCESSABLE_ENTITY_MESSAGE: 'Unprocessable entity',
  TOO_MANY_REQUESTS: 429,
  TOO_MANY_REQUESTS_MESSAGE: 'Too many requests',
  INTERNAL_SERVER_ERROR: 500,
  INTERNAL_SERVER_ERROR_MESSAGE: 'Internal server error',
  BAD_GATEWAY: 502,
  BAD_GATEWAY_MESSAGE: 'Bad gateway',
  SERVICE_UNAVAILABLE: 503,
  SERVICE_UNAVAILABLE_MESSAGE: 'Service unavailable',
  GATEWAY_TIMEOUT: 504,
  GATEWAY_TIMEOUT_MESSAGE: 'Gateway timeout',
};

// List of Exceptions available in Nest js.
// BadRequestException: Indicates a malformed request. (HTTP status code: 400)
// UnauthorizedException: Signals unauthorized access. (HTTP status code: 401)
// ForbiddenException: Denotes forbidden resources. (HTTP status code: 403)
// NotFoundException: Indicates a resource not found. (HTTP status code: 404)
// NotAcceptableException: Signals an unacceptable request. (HTTP status code: 406)
// RequestTimeoutException: Indicates a request timeout. (HTTP status code: 408)
// ConflictException: Signals a conflict with the current state of the resource. (HTTP status code: 409)
// GoneException: Indicates a resource that is no longer available. (HTTP status code: 410)
// HttpVersionNotSupportedException: Signals an unsupported HTTP version. (HTTP status code: 505)
// PayloadTooLargeException: Indicates a payload that is too large. (HTTP status code: 413)
// UnsupportedMediaTypeException: Signals an unsupported media type. (HTTP status code: 415)
// UnprocessableEntityException: Indicates an unprocessable entity. (HTTP status code: 422)
// InternalServerErrorException: Reflects a general server error. (HTTP status code: 500)
// NotImplementedException: Signals an unimplemented method. (HTTP status code: 501)
// ImATeapotException: A humorous exception for unexpected situations. (HTTP status code: 418)
// MethodNotAllowedException: Indicates an unsupported HTTP method. (HTTP status code: 405)
// BadGatewayException: Signals a bad gateway error. (HTTP status code: 502)
// ServiceUnavailableException: Indicates a service unavailable error. (HTTP status code: 503)
