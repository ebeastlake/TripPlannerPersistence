'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

 var tripModule = (function () {

  // application state

  var days = [],
  currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  let getAllDays = function(){
    return $.ajax({
      method: 'GET',
      url: '/api/days'
    })
  }

  let renderAllDays = function(days){
    days.forEach(showDay);
  }  

 // ~~~~~~~~~~~~~~~~~~~~~~~
    // before calling `addDay` or `deleteCurrentDay` that update the frontend (the UI), we need to make sure that it happened successfully on the server
  // ~~~~~~~~~~~~~~~~~~~~~~~
  $(function () {

    $addButton.on('click', function() {
      createDay()
      .then(function(day) {
        showDay(day);
      })
    });

    $removeButton.on('click', function() {
      //$(.'day-btn').remove();
      dbDeleteDay()
      .then(function(response) {
        console.log(response.status);
        console.log("Successfully deleted a day!");
        deleteCurrentDay();
      })
    });
  });

  function createDay() {
    console.log("Trying to make a day!");
    return $.ajax({
      method: 'POST',
      url: '/api/days'
    })
  }

  function dbDeleteDay() {
    console.log("Trying to delete: " + currentDay.id);
    console.log("Sending request to  /api/days/" + currentDay.id);
    return $.ajax({
      method: 'DELETE',
      url: '/api/days/' + currentDay.id
    })
  }



  // ~~~~~~~~~~~~~~~~~~~~~~~
    // `addDay` may need to take information now that we can persist days -- we want to display what is being sent from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function showDay(day) { 
    var newDay = dayModule.create(day); // dayModule
    switchTo(newDay);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~
    // Do not delete a day until it has already been deleted from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function deleteCurrentDay() {
    getAllDays()
    .then(function(days){
      renderAllDays(days);
    }) 
  }

  // globally accessible module methods

  var publicAPI = {

    load: function () {

      getAllDays()
      .then(function(days){
        renderAllDays(days);
      }) 

      // ~~~~~~~~~~~~~~~~~~~~~~~
        //If we are trying to load existing Days, then let's make a request to the server for the day. Remember this is async. For each day we get back what do we need to do to it?
      // ~~~~~~~~~~~~~~~~~~~~~~~
    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());
