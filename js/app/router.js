define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/environment',
	],
	function($, _, Backbone, environment) {
		var AppRouter = Backbone.Router.extend({
			routes: {
				'*actions': 'index'
			},
			index: function() {
				environment.render(36.740588, -5.167985);
			}
		});
		var init = function() {
			var app_router = new AppRouter;
			Backbone.history.start();
		};
		return {
			init: init
	 	}
	});