export default class BusinessError extends Error {
  type = "BUSINESS";
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "Rejection";
    if (details) {
      this.details = details;
    }
  }
}
