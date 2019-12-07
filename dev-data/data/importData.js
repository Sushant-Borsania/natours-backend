const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModels');

dotenv.config({ path: './config.env' });
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

//Reading file to create the data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data in DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted the data');
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
