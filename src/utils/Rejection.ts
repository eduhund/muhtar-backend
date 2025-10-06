export class BusinessError extends Error {
  type = "BUSINESS";
  description: string;
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.description = message;
  }
}

export class InvalidParamsError extends Error {
  type = "VALIDATION";
  code = "INVALID_PARAMETERS";
  description: string;
  constructor(public message: string, public details?: Record<string, any>) {
    super(message);
    this.description = message;
  }
}
