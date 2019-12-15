const Tour = require('../models/tourModels');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  //optionally setting only few fields
  req.query.fields = 'name,price,summary,ratingsAverage,difficulty';
  next();
};

exports.getTours = async (req, res) => {
  try {
    //Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
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
//Aggregation pipeline works in this stage: unwind > match > group >addfield >project[to show or hide field]

exports.getTourState = async (req, res) => {
  try {
    //Aggregation pipeline
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // _id: null,//Id null will give result for overall tours but if you want to group these same result with dedicated field such as difficulty we can do that by adding 'difficulty' in id as below
          _id: '$difficulty',
          TotalTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalRatings: { $sum: '$ratingsQuantity' }
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      }
      // {
      //   $match: { _id: { $ne: 'easy' } }
      // }
    ]);
    res.status(201).json({
      status: 'success',
      data: {
        stats: stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'did not succeed this time',
      message: err
    });
  }
};
//match is basically to select document
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    console.log(year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          TotalTours: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $sort: {
          TotalTours: -1
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      }
    ]);

    res.status(201).json({
      status: 'success',
      data: {
        stats: plan
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'did not succeed this time',
      message: err
    });
  }
};
