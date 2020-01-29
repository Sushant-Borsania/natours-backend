module.exports = fn => {
  //Express will call below function  - if we dont add this additional function than express won't know what to call
  // and with all route the catch async gets called!
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
