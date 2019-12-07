const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();
// router.param('id', tourController.checkID);

//alias tours -> top5, top10 like wise
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
