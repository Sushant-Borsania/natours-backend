const mongoose = require('mongoose');
//mongoose require schema = blueprint kind of
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour should have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Enter the summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});
//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
