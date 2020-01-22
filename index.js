const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
let request = require('request');
const path = require('path');
const ejs = require('ejs');
const cron = require('node-cron');
const cors = require('cors');
const app = express();

const viewRouter = require('./routers/viewsRouter');
const userRouter = require('./routers/userRouter');
const weatherRouter = require('./routers/weatherRouter');
const secret = require('./secrets/secret');

const Weather = require('./models/cityModel');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.locals._ = _;

// mongoose.connect('mongodb://localhost:27017/cityweather', (err)=>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log('Successfully Connect To DB');
//   }
// });

mongoose.connect(secret.db, (err)=>{
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

app.use(cors()); // receive any error from front end

cron.schedule('* */24 * * *', async() => {
    const firstData = await Weather.find({}).limit(1);
    if(firstData.length>0){
        const allData = await Weather.find({});
        _.forEach(allData, async(val) =>{
          let apiKey = secret.apiKey;
          let city = val.city;
          let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
          request(url, async (err, response, body) => {
            try{
              let weather = JSON.parse(body);
              await Weather.updateOne({user: req.user._id, city: {$eq: val.city}},
                { degree: weather.main.temp, createdAt: Date.now()}, (err, dat)=>{
                  if(err){
                    console.log(err);
                  }else{
                    console.log(dat);
                  }
                });
            }catch(err){
              console.log(err);
            }
          });
    
        });
        next();
    }else{
        next();
    }
});

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/', weatherRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });