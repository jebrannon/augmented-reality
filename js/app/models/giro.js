define([
  'jquery',
  'underscore',
  'backbone',
  ], function($, _, Backbone) {
    var Giro = Backbone.Model.extend({
      defaults: {
        gamma: 0,
        beta: 0,
        alpha: 0,
      }
    });
    return Giro;
  });