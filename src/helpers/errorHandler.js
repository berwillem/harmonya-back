const errorHandler = function (err, req, res, next) {
    const response = {
      message: err.message || "InternalServerError",
      status: err.statusCode || 500,
    };
  
    console.error(err);
  
    res.status(err.statusCode || 500).json(response);
  };
  
  class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
      super(message, 401);
    }
  }
  
  class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
      super(message, 403);
    }
  }
  
  class NotFoundError extends ApiError {
    constructor(message = "NotFound") {
      super(message, 404);
    }
  }
  
  class BadRequestError extends ApiError {
    constructor(message = "BadRequest") {
      super(message, 400);
    }
  }
  
  class InternalServerError extends ApiError {
    constructor(message = "InternalServerError") {
      super(message, 500);
    }
  }
  
  const HttpError = {
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    BadRequestError,
    InternalServerError,
  };
  
  exports.ApiError = ApiError;
  exports.HttpError = HttpError;
  exports.errorHandler = errorHandler;
  