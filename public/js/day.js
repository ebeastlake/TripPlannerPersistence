'use strict';
/* global $ utilsModule tripModule attractionsModule */

/**
 * A module for constructing front-end `day` objects, optionally from back-end
 * data, and managing the `attraction`s associated with a day.
 *
 * Day objects contain `attraction` objects. Each day also has a `.$button`
 * with its day number. Days can be drawn or erased via `.show()` and
 * `.hide()`, which updates the UI and causes the day's associated attractions
 * to `.show()` or `.hide()` themselves.
 *
 * This module has one public method: `.create()`, used by `days.js`.
 */

var dayModule = (function () {

  // jQuery selections

  var $dayButtons, $dayTitle;
  $(function () {
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
  });

  // ~~~~~~~~~~~~~~~~~~~~~~~
    // If you follow the logic of `attractionsModule.getEnhanced` (try following it!), you will note that it depends on `loadEnhanceAttractions` to have run.
    //Note that `loadEnhancedAttractions` is already being called for you in `/public/js/options.js` and that it utilizes another method given to us by the `attractionModule` (singular). 
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function Day (data) {
    // for brand-new days
    this.number = data.number;
    this.hotel = data.hotel;
    this.restaurants = [];
    this.activities = [];
    // for days based on existing data
    utilsModule.merge(data, this);
    if (this.hotel) this.hotel = attractionModule.create(this.hotel);
    this.restaurants = this.restaurants.map(attractionModule.create);
    this.activities = this.activities.map(attractionModule.create);
    // remainder of constructor
    this.buildButton().showButton();
  }

  // automatic day button handling

  Day.prototype.setNumber = function (num) {
    this.number = num;
    this.$button.text(num);
  };

  Day.prototype.buildButton = function () {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function (){
      this.blur(); // removes focus box from buttons
      tripModule.switchTo(self);
    });
    return this;
  };

  Day.prototype.showButton = function () {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function () {
    this.$button.detach(); // detach removes from DOM but not from memory
    return this;
  };

  Day.prototype.show = function () {
    // day UI
    this.$button.addClass('current-day');
    $dayTitle.text('Day ' + this.number);
    // attractions UI
    function show (attraction) { attraction.show(); }
    if (this.hotel) show(this.hotel);
    this.restaurants.forEach(show);
    this.activities.forEach(show);
  };

  Day.prototype.hide = function () {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide (attraction) { attraction.hide(); }
    if (this.hotel) hide(this.hotel);
    this.restaurants.forEach(hide);
    this.activities.forEach(hide);
  };


  // ~~~~~~~~~~~~~~~~~~~~~~~
    // Do not add an attraction to the page until you have added it to the DB.
    // es6 template literals might be helpful for the url route path for your AJAX request
  // ~~~~~~~~~~~~~~~~~~~~~~~
  Day.prototype.addAttraction = function (attraction) {
    
    var addToDb;
    // adding to the day object
    switch (attraction.type) {
      case 'hotel':
        if (this.hotel) this.hotel.hide();
        this.hotel = attraction;
        addToDb = $.ajax({
          method: 'PUT',
          url: '/days/' + this.id + '/hotel',
          data: {
            hotelId: attraction.id
          }
        });
        break;
      case 'restaurant':
        utilsModule.pushUnique(this.restaurants, attraction);
        addToDb = $.ajax({
          method: 'PUT',
          url: '/days/' + this.id + '/restaurant',
          data: {
            restaurantId: attraction.id
          }
        });
        break;
      case 'activity':
        utilsModule.pushUnique(this.activities, attraction);
        addToDb = $.ajax({
          method: 'PUT',
          url: '/days/' + this.id + '/activity',
          data: {
            activityId: attraction.id
          }
        });
        break;
      default: console.error('bad type:', attraction);
    }
    addToDb
    .then(function() {
      // activating UI
      attraction.show();
    })
    .catch(err);
  };


  // ~~~~~~~~~~~~~~~~~~~~~~~
    // Do not remove an attraction until you have removed it from the DB
    // es6 template literals might be helpful for the url route path for your AJAX request
  // ~~~~~~~~~~~~~~~~~~~~~~~
  Day.prototype.removeAttraction = function (attraction) {
    var removeFromDb;
    // removing from the day object
    switch (attraction.type) {
      case 'hotel':
        this.hotel = null;
        removeFromDb = $.ajax({
          method: 'DELETE',
          url: '/days/' + this.id + '/hotel';
        });
        break;
      case 'restaurant':
        utilsModule.remove(this.restaurants, attraction);
        removeFromDb = $.ajax({
          method: 'DELETE',
          url: '/days/' + this.id + '/restaurant' + attraction.id;
        });
        break;
      case 'activity':
        utilsModule.remove(this.activities, attraction);
        removeFromDb = $.ajax({
          method: 'DELETE',
          url: '/days/' + this.id + '/activity' + attraction.id;
        });
        break;
      default: console.error('bad type:', attraction);
    }
    removeFromDb
    .then(function(){
      // deactivating UI
      attraction.hide();
    })
    .catch(err);
  };

  // globally accessible module methods

  var publicAPI = {

    create: function (databaseDay) {
      return new Day(databaseDay);
    }

  };

  return publicAPI;

}());
