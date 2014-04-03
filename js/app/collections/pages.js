define([
	'jquery',
	'underscore',
	'backbone',
	'app/config',
	'app/models/page',
	], function($, _, Backbone, Config, PageModel) {
		var Pages = Backbone.Collection.extend({
			model: PageModel,
			comparator: Config.justgiving.sortBy,
			url: Config.justgiving.url + Config.justgiving.apiKey + '/v1/fundraising/search',
			initialize: function(charityId, eventId, limit) {
				this.url = this.url + "?charityId=" + charityId + "&eventId=" + eventId + "&pageSize=" + limit + "&format=json&callback=?";
			},
	    parse: function(resp, xhr) {
	      return resp.SearchResults;
	    }
		});
		
		return Pages;
	});