define([
	'jquery',
	'underscore',
	'backbone',
	'app/collections/locations',
	'app/views/streetView',
	],
	function($, _, Backbone, LocationsCollection, StreetView) {
		var AppRouter = Backbone.Router.extend({
			routes: {
				'*actions': 'index'
			},
			initialize: function(data) {
				this.locations = data;
			},
			index: function() {
				StreetView.render(this.locations.first());
			}
		});
		var init = function() {
			this.locations = new LocationsCollection([
		    {
		      slug: 'ghotsbusters-hq',
		      name: 'Ghostbusters HQ',
		      panid: 0,
		      latitude: 40.719762,
		      longitude: -74.006699,
		      heading: -210,
		      pitch: 0,
		      links: null,
		    },
		    {
		      slug: 'back-to-the-future-the-mcfly-house',
		      name: 'Back to the Future: The McFly house',
		      panid: 0,
		      latitude: 34.239086,
		      longitude: -118.433204,
		      heading: -85,
		      pitch: -4,
		      links: null,
		    },
		    {
		      slug: 'terminator-2-judgment-day-cyberdyne-building',
		      name: 'Terminator 2: Judgment Day: Cyberdyne building',
		      panid: 0,
		      latitude: 37.476012,
		      longitude: -121.937495,
		      heading: 189.92,
		      pitch: 94.55,
		      links: null,
		    }
		  ]);
		  var app_router = new AppRouter(this.locations);
			Backbone.history.start();
		};
		return {
			init: init
	 	}
	});