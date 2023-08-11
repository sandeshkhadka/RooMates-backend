type ErrorType = "server" | "client" | "auth";
class CustomError extends Error {
  type: ErrorType;
  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
  }
}

export default CustomError;
