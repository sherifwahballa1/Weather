const express = require('express');
const authController = require('../controllers/authController');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.post('/home', authController.protect, authController.isLoggedIn, weatherController.getWeather);
router.patch('/updateweather', authController.isLoggedIn, authController.protect, weatherController.updateWeather);

module.exports = router;
