'use strict';
/* global $ tripModule attractionsModule hotels restaurants activities */

/**
 * This module fills the `select` tags with `option`s.
 * It runs immediately upon document ready (not called by other modules).
 * Each `option` displays the name of an attraction and is has a value of
 * that attraction's id. Selecting an option looks up the attraction by id,
 * then tells the trip module to add the attraction.
 */
 
 $(function () {

    // jQuery selects
    var $optionsPanel = $('#options-panel');
    var $hotelSelect = $optionsPanel.find('#hotel-choices');
    var $restaurantSelect = $optionsPanel.find('#restaurant-choices');
    var $activitySelect = $optionsPanel.find('#activity-choices');

  // ~~~~~~~~~~~~~~~~~~~~~~~
    // This looks like a great place to start AJAX work with a request for all attractions. Don't forget that these kinds of requests are async, so we won't have all of the attractions until it comes back, but once it comes back we can make the option tags
  // ~~~~~~~~~~~~~~~~~~~~~~~

    function getAllData() {
        return $.ajax({
            method: 'GET', 
            url: '/api/options'
        })
    }

    function renderOptions(values) {
        const hotels = values[0];
        const restaurants = values[1];
        const activities = values[2];

        attractionsModule.setAttractions(attractions);
        attractions.hotels.forEach(makeOption, $hotelSelect);
        attractions.restaurants.forEach(makeOption, $restaurantSelect);
        attractions.activities.forEach(makeOption, $activitySelect);

    }

    getAllData()
    .then(function(response) {
        renderOptions(response);
    })
    .catch(utilsModule.logErr);

    function makeOption(databaseAttraction) {
        var $option = $('<option></option>') // makes a new option tag
        .text(databaseAttraction.name)
        .val(databaseAttraction.id);
        this.append($option); // add the option to the specific select
    }

    // what to do when the `+` button next to a `select` is clicked
    $optionsPanel.on('click', 'button[data-action="add"]', function () {
        var $select = $(this).siblings('select');
        var type = $select.data('type'); // from HTML data-type attribute
        var id = $select.find(':selected').val();

        function addOption() {
            console.log("trying to add option");
            return $.ajax({
                method: 'POST',
                url: '/api/days/' + currentDay.id + '/' + type,
                data: {'optionId': id}
            })
        }

        addOption()
        .then(function(attraction) {
            console.log("You got back...");
            console.log(attraction);
        })
        // get associated attraction and add it to the current day in the trip
        // var attraction = attractionsModule.getByTypeAndId(type, id);
        // tripModule.addToCurrent(attraction);
    });

});
