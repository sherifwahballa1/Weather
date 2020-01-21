const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
let request = require('request');
const path = require('path');
const ejs = require('ejs');

const app = express();

const viewRouter = require('./routers/viewsRouter');
const userRouter = require('./routers/userRouter');
const weatherRouter = require('./routers/weatherRouter');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.locals._ = _;

mongoose.connect('mongodb://localhost:27017/cityweather', (err)=>{
  if(err){
    console.log(err);
  }else{
    console.log('Successfully Connect To DB');
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/', weatherRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });