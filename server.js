const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

//Adding port to access the app
const { PORT } = process.env;

//Database stuff
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connect method returns the promise
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful');
  });

//After schema, model  - create the test tour
// const testTour = new Tour({
//   name: 'The Sasan Gir',
//   rating: 4.8,
//   price: 688
// });

// const testTour2 = new Tour({
//   name: 'Calgary Forester',
//   rating: 3.9,
//   price: 250
// });

//Saving to DB
// testTour
//   .save()
//   .then(doc => console.log(doc))
//   .catch(err => console.error(err));

// testTour2
//   .save()
//   .then(doc => console.log(doc))
//   .catch(err => console.log(err));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${PORT}`);
});
