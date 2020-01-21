const _ = require('lodash');
const request = require('request');
const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');
const Weather = require('./../models/cityModel');


exports.getOverview = catchAsync(async (req, res) => {
  res.status(200).render('home', {
    title: 'Weather - Home',
    weather: null,
    error: null,
    userData: req.user.favCities
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: `Log into your account`
  });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: `Sign Up your account`
  });
});
