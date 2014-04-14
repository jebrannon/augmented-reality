define([
  'jquery',
  'underscore',
  'backbone',
  'text!html/streetview/data.html',
  ], function($, _, Backbone, DataTemplate) {
    var streetViewData = Backbone.View.extend({
      el: '#streetViewTools',
      render: function(Model) {
        if ($(this.el).find('.street-view-data').length) {
          $(this.el).find('.street-view-data').remove();
        }
        $(this.el).prepend(_.template(DataTemplate, {data: Model}));
      }
    });
    
    return new streetViewData;
  });