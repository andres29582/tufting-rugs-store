type ApiErrorOptions = {
  status: number;
  payload: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.payload = options.payload;
  }
}
