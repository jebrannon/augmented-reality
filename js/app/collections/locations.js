define([
  'jquery',
  'underscore',
  'backbone',
  'app/config',
  'app/models/location',
  ], function($, _, Backbone, Config, LocationModel) {
    var Locations = Backbone.Collection.extend({
      model: LocationModel,
      comparator: 'name',
    });
    return Locations;
  });