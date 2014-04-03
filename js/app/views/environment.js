define([
	'jquery',
	'underscore',
	'backbone',
	'app/config',
	// 'app/collections/pages',
	// 'text!html/pledge/item.html',
	// 'text!html/pledge/page.html',
	], function($, _, Backbone, Config) {
		var pledgeView = Backbone.View.extend({
			el: '#environment',
			events: {
				"click": "handleEvent"
			},
			initialize: function() {
				this._isFullscreen = false;
				// var charityId = Config.justgiving.charityId;
				// var eventId = Config.justgiving.eventId;
				// var limit = Config.justgiving.limit;
				// this.pages = new PagesCollection(charityId, eventId, limit);


				window.addEventListener('deviceorientation', function(event) {
					// console.log('alpha: ', event.alpha, ' - beta: ', event.beta, ' - gamma: ', event.gamma)
				}, false);
			},
			render: function(where) {
				console.log('where : ', where, this.el);


			 if(element.requestFullscreen) {
			    element.requestFullscreen();
			    console.log('requestFullscreen');
			  } else if(element.mozRequestFullScreen) {
			    element.mozRequestFullScreen();
			    console.log('mozRequestFullScreen');
			  } else if(element.webkitRequestFullscreen) {
			    element.webkitRequestFullscreen();
			    console.log('webkitRequestFullscreen');
			  } else if(element.msRequestFullscreen) {
			    element.msRequestFullscreen();
			    console.log('msRequestFullscreen');
			  } else {
			  	console.log('unsupported!!!');
			  }




				// var that = this;
				// this.pages.fetch({
				// 	success: function () {
				// 		var total = that.pages.length;
				// 		var i = 0;
				// 		that.pages.each(function(page) {
				// 			page.fetch({
				// 				success: function () {
				// 					i++;
				// 					if (i === total) {
				// 						that.output();
				// 					}
				// 				}
				// 			});
				// 		})
				// 	}
				// });
			},
			handleEvent: function(e) {
				if (e.target && e.target.getAttribute('data-app-action')) {
					if (!this._isFullscreen) {
						this.el.requestFullscreen();
					}
					else {
						this.el.exitFullscreen();
					}
					
				}
			},
			output: function() {
				// $('#loading').hide();
				// $(this.el).append(_.template(ItemTemplate, {pledges: this.pages.models}));
			},
			expand: function(model) {
				// if ($('#pledgePage').length > 0) {
				// 	$('#pledgePage').remove();
				// }
				// $(this.el).prepend(_.template(PageTemplate, {pledge: model}));
			}
		});
		
		return new pledgeView;
	});