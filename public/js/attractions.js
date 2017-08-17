'use strict';
/* global $ attractionModule hotels restaurants activities */

/**
 * This module holds collection of enhanced attraction objects which can be
 * easily looked up by type and id. It is primarily used when someone clicks
 * to add an attraction in the `options` module.
 */

var attractionsModule = (function () {

    // application state

    var library = {};

    // private helper methods (only available inside the module)

    function findById(array, id) {
        return array.find(function (el) {
            return +el.id === +id;
        });
    }

    // globally accessible module methods (available to other modules)

    var publicAPI = {

        getByTypeAndId: function (type, id) {
            if (type === 'hotel') return findById(library.hotels, id);
            else if (type === 'restaurant') return findById(library.restaurants, id);
            else if (type === 'activity') return findById(library.activities, id);
            else throw Error('Unknown attraction type');
        }, 

        setAttractions: function(attractions) {
            library.hotels = attractions.hotels.map(attractionModule.create);
            library.restaurants = attractions.retaurants.map(attractionModule.create);
            library.activities = attractions.activities.map(attractionModule.create);
        }

    };

    return publicAPI;

}());
