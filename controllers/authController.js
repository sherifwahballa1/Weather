const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');
const Weather = require('./../models/cityModel');

const signToken = id => {
  return jwt.sign(
    {
      id: id
    },
    'my-secret-signature-for-do-jwtoke-hhh-long',
    {
      expiresIn: '90d'
    }
  );
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  //res.cookie('name of the cookie', 'token', 'options')
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  //remove the password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    date: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('please provide email and password');
    err.statusCode = 400;
    err.status = 'fail';
    next(err);
  }

  const user = await User.findOne({
    email: email
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    const err = new Error('Incorrect email or password');
    err.statusCode = 401;
    err.status = 'fail';
    next(err);
  }
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1 Getting Token and check of its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    const err = new Error('You are not logged in! please login to get access');
    err.statusCode = 401;
    err.status = 'fail';
    next(err);
  }
  //2 Vertification token with signature

  const decode = await promisify(jwt.verify)(token, 'my-secret-signature-for-do-jwtoke-hhh-long');

  //3 check if user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    const err = new Error('The user belong to this token not exists');
    err.statusCode = 401;
    err.status = 'fail';
    next(err);
  }


  //Grant access to protected route
  req.user = freshUser;
  res.locals.user = freshUser; //locals used in render (pug pages)
  next();
});

//only for rendered pages , no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //1 Vertification token with signature
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        'my-secret-signature-for-do-jwtoke-hhh-long'
      );

      //2 check if user still exists
      const freshUser = await User.findById(decode.id);
      if (!freshUser) {
        return next();
      }

      //3 check if user change password  after the token issued
      if (freshUser.changedPasswordAfter(decode.iat)) {
        return next();
      }

      //There is Logged in user
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
