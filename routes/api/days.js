var Promise = require('bluebird');
var Hotel = require('../../models').Hotel;
var Restaurant = require('../../models').Restaurant;
var Activity = require('../../models').Activity;
var Day = require('../../models').Day;

var days = require('express').Router();

// retrieve all days
days.get('/', function(req, res, next) {
  Day.findAll({
    include: [Hotel, Restaurant, Activity]
  })
  .then(function(days){
    res.json(days);
  })
  .catch(next);
})

// create a new day
days.post('/', function(req, res, next) {
  Day.count()
  .then(function(c) {
    return Day.create({number: c + 1});
  })
  .then(function(newDay) {
    res.json(newDay);
  })
  .catch(next);
})

// delete one specific day
days.delete('/:id', function(req, res, next) {
  Day.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function() {
    res.sendStatus(204);
  })
  .catch(next);
})

days.param('id', function(req, res, next, dayId) {
  Day.findById(dayId)
  .then(function(day) {
    req.day = day;
    next();
  })
  .catch(next)
})

// add a hotel to a day
days.put('/:id/hotel', function(req, res, next) {
  req.day.setHotel(req.body.hotelId)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

// add a restaurant to a day
days.put('/:id/restaurant', function(req, res, next) {
  req.day.addRestaurant(req.body.restaurantId)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

// add an activity to a day
days.put('/:id/activity', function(req, res, next) {
  req.day.addActivity(req.body.activityId)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

// remove a hotel from a day
days.delete('/:id/hotel', function(req, res, next) {
  req.day.setHotel(null)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

// remove a restaurant from a day
days.delete('/:id/restaurant/:restaurantId', function(req, res, next) {
  req.day.removeRestaurant(req.params.restaurantId)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

// remove an activity from a day
days.delete('/:id/activity/:activityId', function(req, res, next) {
  req.day.removeActivity(req.params.activityId)
  .then(function(day) {
    res.sendStatus(204);
  })
  .catch(next);
})

module.exports = days;
