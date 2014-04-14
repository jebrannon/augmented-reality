define([
  'jquery',
  'underscore',
  'backbone',
  'app/models/location',
  ], function($, _, Backbone, LocationModel) {
    var Locations = Backbone.Collection.extend({
      model: LocationModel,
      comparator: 'name',
    });
    return Locations;
  });