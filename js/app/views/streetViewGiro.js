define([
  'jquery',
  'underscore',
  'backbone',
  'text!html/streetview/giro.html',
  ], function($, _, Backbone, GiroTemplate) {
    var streetViewGiro = Backbone.View.extend({
      el: '#streetViewTools',
      _target: null,
      render: function(Model) {
        if ($(this.el).find('.street-view-giro').length) {
          $(this.el).find('.street-view-giro').remove();
        }
        $(this.el).append(_.template(GiroTemplate, {data: Model}));
      }
    });
    
    return new streetViewGiro;
  });