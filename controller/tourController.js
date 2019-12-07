const Tour = require('../models/tourModels');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  //optionally setting only few fields
  req.query.fields = 'name,price,summary,ratingsAverage,difficulty';
  next();
};

exports.getTours = async (req, res) => {
  try {
    // const tours = await Tour.find();

    //Build Query
    //1. Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(queryObj);//{ duration: { gte: '5' } }

    //2. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`);
    // console.log(queryStr); // => {"duration":{"$gte":"5"}}
    let query = Tour.find(JSON.parse(queryStr));
    // console.log(query);

    //3. Sorting
    //req.query can still access the query parameter even though we are filtering on line # 25 hence we are
    // going to use that to tack on our query
    //So before we are finding the tours with Tour.find and than we are sorting of that output.
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);//price duration || -price -duration
      query = query.sort(sortBy);
      // console.log(query); // It will give a long object
    } else {
      //providing default sort
      query = query.sort('-createdAt');
    }

    //4.Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      //Select and pass the parameters you want to display with space oin between.
    } else {
      query = query.select('-__v');
    }

    //5.pagination
    //Mongoose require skip and limit as parameter to display pagination.
    //query would look like - query = query.skip(10).limit(100)
    //Hence we need to calculate the skip value based on the page number that user selects
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    //With the above query if we go to non-existant page such as page nu 100000 than it return blank array. Thats not ideal hence needs to add some check to throw an error.
    //To count the number of documents, mongoose provides an inbuilt method that we will check if user requested "page" in query
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('The page does not exist');
      }
    }

    //Execute Query
    const tours = await query;
    //Send response
    res.status(202).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(202).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      data: {
        message: err
      }
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'did not succeed this time',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //It is true so that we can return the updated document that we will send to client
      runValidators: true // If it is checked means custom validators will work in schema
    });
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'did not succeed this time',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'did not succeed this time',
      message: err
    });
  }
};
