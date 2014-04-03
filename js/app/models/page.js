define([
	'jquery',
	'underscore',
	'backbone',
	'app/config',
	], function($, _, Backbone, Config) {
		var Page = Backbone.Model.extend({
			defaults: {
				BaseUrl: Config.justgiving.url + Config.justgiving.apiKey + "/v1/fundraising/pages/"
			},
			initialize: function() {
				if (this.has("PageUrl")) {
					var pageShortName = this.get("PageUrl").split("/")[1];
					this.url = Config.justgiving.url + Config.justgiving.apiKey + "/v1/fundraising/pages/" + pageShortName;
				}	
			}
		});
		return Page;
	});