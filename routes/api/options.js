var Promise = require('bluebird');
var Hotel = require('../../models').Hotel;
var Restaurant = require('../../models').Restaurant;
var Activity = require('../../models').Activity;

var options = require('express').Router();

options.get('/', function(req, res, next) {
  const fetchHotels = Hotel.findAll();
  const fetchRestaurants = Restaurant.findAll();
  const fetchActivities = Activity.findAll();

  Promise.all([fetchHotels, fetchRestaurants, fetchActivities])
  .then(function(values) {
    res.json(values);
  })
})

module.exports = options;