const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();
//1. Middlewares
//morgan will log only if it is develpment enviroment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use(express.static(`${__dirname}/public`));

// console.log(process.env);
module.exports = app;
