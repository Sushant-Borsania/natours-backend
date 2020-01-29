const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/apiErrors');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const globalErrorHandler = require('./controller/errorController');

const app = express();
//1. Middlewares
//morgan will log only if it is develpment enviroment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//catch all route
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: 'Unhandled route chief!'
  // });

  // const err = new Error('cant find the route');
  // err.status = 'fail';
  // err.statusCode = 404;

  //Whenever there is parameters defined in next function means it is an error and it will find the error handling
  //middleware leaving all others.
  next(new AppError('Could not find the route', 404));
});

//Creating middleware for error handling ▼
app.use(globalErrorHandler);
// console.log(process.env);
module.exports = app;
