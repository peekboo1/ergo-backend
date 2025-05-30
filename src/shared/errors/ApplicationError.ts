export class ApplicationError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}
