const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const weatherController = require('./../controllers/weatherController');

const router = express.Router();

router.get(
  '/',
  authController.isLoggedIn,
  viewsController.getSignupForm
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/home', authController.protect, authController.isLoggedIn, weatherController.updateDataWeatherEveryday, viewsController.getOverview);


module.exports = router;
