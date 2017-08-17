/* eslint-disable camelcase */
var Sequelize = require('sequelize');
var db = require('./_db');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');

var Day = db.define('day', {
  number: {
    type: Sequelize.INTEGER,
    validate: { min: 1 }
  }
}, {
  hooks: {
  	afterDestroy: function() {
  		Day.findAll()
  		.then(function(days) {
  			var promises = [];
  			days.forEach(function(day, i) {
  				day.number = i + 1;
  				promises.push(day.save());
  			})
  			return Promise.all(promises);
  		})
  		.then(function(days) {
  			console.log("Successfully updated day numbers!");
  		})
  	}
  }
})



// might want to write instance methods for getting hotel, restaurant, activities

module.exports = Day;
