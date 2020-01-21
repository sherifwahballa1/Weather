const request = require('request');
const catchAsync = require('./../utils/catchAsync');
const Weather = require('./../models/cityModel');

exports.getWeather = catchAsync(async (req, res, next) => {

    const weather1 = await Weather.findOne({user: req.user._id, city: {$eq: req.body.city }});
    if(weather1){
      let weatherText2 = `It's ${weather1.degree} °C degrees in ${weather1.city}!`;
      res.render('home', { favCity: weather1, weather: weatherText2, error: null, weatherCity:req.body.city});

    }else{
    let apiKey = 'e8f2c08895164e963bd7a8524214bb50';
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
    request(url, async (err, response, body) => {
          if(err){
            res.render('home', {weather: null, error: 'Error, please try again'});
          } else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
              res.render('home', {weather: null, error: 'Error, please try again'});
            } else {
              let weatherText = `It's ${weather.main.temp} °C degrees in ${weather.name}!`;
             
              const city = await Weather.findOne({ user: req.user._id, city: {$eq: req.body.city}});
              if (city) {
                res.render('home', { favCity: city, weather: weatherText, error: null, weatherCity:req.body.city});
              } else {

              const newWeather = new Weather();
              newWeather.user = req.user._id;
              newWeather.city = req.body.city;
              newWeather.degree = weather.main.temp;
              await newWeather.save((err, result)=>{
                  if(err){
                      return next(err);
                  }
              });

              res.render('home', {favCity: city, weather: weatherText, error: null, weatherCity: req.body.city});
            }
            }
          }
    });
  }
});