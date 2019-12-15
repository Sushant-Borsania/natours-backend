class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //We will pass all the methods that we created
  filter() {
    //1. Filtering
    const queryObj = { ...this.queryString };
    // console.log(queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(queryObj);//{ duration: { gte: '5' } }

    //2. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`);
    // console.log(queryStr); // => {"duration":{"$gte":"5"}}
    // console.log(JSON.parse(queryStr));//{ duration: { '$gte': '5' } }
    this.query = this.query.find(JSON.parse(queryStr));
    //The below query was changed to above line ▲
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //3. Sorting
    //req.query can still access the query parameter even though we are filtering on line # 25 hence we are
    // going to use that to tack on our query
    //So before we are finding the tours with Tour.find and than we are sorting of that output.
    if (this.queryString.sort) {
      // console.log(this.queryString.sort);//-price,duration
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);//price duration || -price -duration
      this.query = this.query.sort(sortBy);
      // console.log(query); // It will give a long object
    } else {
      //providing default sort
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //4.Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
      //Select and pass the parameters you want to display with space oin between.
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //5.pagination
    //Mongoose require skip and limit as parameter to display pagination.
    //query would look like - query = query.skip(10).limit(100)
    //Hence we need to calculate the skip value based on the page number that user selects
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
