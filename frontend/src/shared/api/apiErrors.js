export class ApiError extends Error {
  constructor(message, options) {
    super(message);
    this.name = 'ApiError';
    this.status = options && options.status;
    this.payload = options && options.payload;
  }
}
