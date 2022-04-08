// eslint-disable-next-line max-classes-per-file
export class ApplicationError extends Error {
  constructor(statusCode, message = 'an error occurred', errors) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || 'server error';
    this.errors = errors;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message) {
    super(404, message || 'Resource not found');
  }
}

export class ValidationError extends ApplicationError {
  constructor(message) {
    super(400, message || 'Path is required');
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message) {
    super(401, message || 'Authentication error');
  }
}
