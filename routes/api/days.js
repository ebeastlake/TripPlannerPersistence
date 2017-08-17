var Promise = require('bluebird');
var Hotel = require('../../models').Hotel;
var Restaurant = require('../../models').Restaurant;
var Activity = require('../../models').Activity;
var Day = require('../../models').Day;

var days = require('express').Router();

// get a list of all the days
days.get('/', function(req, res, next) {
  // retrieve all the days
  res.json("You're trying to list the days!");
})

// get one specific day
days.get('/:id', function(req, res, next) {
  // retrieve one day
  res.json("You're trying to retrieve one day!");
})

// delete one specific day
days.delete('/:id', function(req, res, next) {
  // delete a day from the database
  res.json("You're trying to delete a day!");
})

// create a new day
days.put('/:id', function(req, res, next) {
  // add a new day to the database
  res.json("You're trying to make a new day!");
})

// add an attraction to that day
days.put('/:id/:attraction', function(req, res, next) {
  res.json("You're trying to add an attraction!");
})

// remove an attraction from that day
days.delete('/:id/:attraction', function(req, res, next) {
  res.json("You're trying to remove an attraction!");
})

module.exports = days;
