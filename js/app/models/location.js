define([
  'jquery',
  'underscore',
  'backbone',
  ], function($, _, Backbone) {
    var Location = Backbone.Model.extend({
      defaults: {
        slug: 'sample-location',
        name: 'Sample Location',
        latitude: 40.719762,
        longitude: -74.006699,
        heading: -210,
        pitch: 0,
        links: null,
      }
    });
    return Location;
  });