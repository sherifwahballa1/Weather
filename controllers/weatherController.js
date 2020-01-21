const request = require('request');
const catchAsync = require('./../utils/catchAsync');
const Weather = require('./../models/cityModel');
const User = require('./../models/userModel');
const _ = require('lodash');

const secret = require('./../secrets/secret');

exports.getWeather = catchAsync(async (req, res, next) => {
    var n = false;
    const city = await Weather.findOne({city: {$eq: req.body.city }});
    const userData = await User.findOne({_id: {$eq: req.user._id}});
    if(city){
      let weatherText = `It's ${city.degree} °C degrees in ${city.city}!`;
      _.forEach(req.user.favCities, function(val, i){
          if(val['cityName'] === req.body.city){
              n = true;
          }
      });
      const allWeathers = await Weather.find({});
      res.render('home', { weather: weatherText, error: null, weatherCityName:req.body.city, weatherCityId: city._id, weatherCityDegree: city.degree, userData: userData.favCities, n: n, allWeathers: allWeathers});

    }else{
        let cityForm = req.body.city;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityForm}&units=metric&APPID=${secret.apiKey}`;
        request(url, async (err, response, body) => {
          if(err){
            res.render('home', {weather: null, error: 'Error, please try again'});
          } else {
                let weather = JSON.parse(body);
                if(weather.main == undefined){
                res.render('home', {weather: null, error: 'Error, please try again'});
                } else {
                    let weatherText = `It's ${weather.main.temp} °C degrees in ${weather.name}!`;
                    const newWeather = new Weather();
                    newWeather.user = req.user._id;
                    newWeather.city = req.body.city;
                    newWeather.degree = weather.main.temp;
                    await newWeather.save((err, result)=>{
                        if(err){
                            return next(err);
                        }
                    });

                    const cityIdD = await Weather.findOne({city: {$eq: req.body.city }});
                    const allWeathers = await Weather.find({});
                    res.render('home', {weather: weatherText, error: null, weatherCityName: req.body.city, weatherCityId: cityIdD._id, weatherCityDegree: cityIdD.degree, userData: userData.favCities, n: false, allWeathers: allWeathers});
                }
          }
    });
  }
});

exports.updateWeather = async(req, res, next) => {
    await User.updateOne({
        '_id': {$eq: req.user._id},
        'favCities.cityId': {$ne: req.body.cityId}
    },{
        $push: {favCities: {
            'cityId': req.body.cityId,
            'cityName': req.body.cityName,
            'degree': req.body.cityDegree
        }}
    }, (err) => {
        if(err){ 
            console.log(err);
        }
    });
   
};

exports.updateDataWeatherEveryday = catchAsync(async(req, res, next) => {
    const firstData = await Weather.find({}).limit(1);
    if(firstData.length>0){
      var d = Date.now()/1000;
      var date = Date.parse(firstData[0].createdAt)/1000;
      var subDates = (d-date)/(60 * 24);
      if(subDates >= 24) {
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
      }
      next();
    }else{
     next();
    }
    // _.forEach(data, async(val) =>{
    //   var d = Date.now();
    //   var date = new Date(val.createdAt);
    //   console.log();
    // });
  });
   