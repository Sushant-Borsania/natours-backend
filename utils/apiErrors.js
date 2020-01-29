class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    //Adding the below line just to print error stack in console - didn't give much explanation
    //Just add it when creating project
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
