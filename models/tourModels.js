const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
//mongoose require schema = blueprint kind of
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Tour must be less than 40 characters long'],
    minlength: [10, 'Tour must be atleast 10 characters long'],
  },
  slug: String,
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
    required: [true, 'A tour should have difficulty'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty should be either easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must not cross 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // This will not work in update - it works only while creating new document.
        return val < this.price; //
      },
      message: 'Discounted price should be lesser than price'
    }
  },
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
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
});

//Document Middleware - Runs before save() and create(). It will not run before insertMany();
tourSchema.pre('save', function(next) {
  // console.log('Save middleware fired!');
  // console.log(this); //Currently being saved doc
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
// })

//Query Middleware
tourSchema.pre(/^find/, function(next) {
  //Here we can access the query
  this.find({ secretTour: { $ne: true } });

  //For measurement of time
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  //here we can access  the document as query alredy fired up.
  console.log(`This query took ${Date.now() - this.start} milliseconds`);
  next();
});
//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
