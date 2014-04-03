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


			 if(this.el.requestFullscreen) {
			    this.el.requestFullscreen();
			    console.log('requestFullscreen');
			  } else if(this.el.mozRequestFullScreen) {
			    this.el.mozRequestFullScreen();
			    console.log('mozRequestFullScreen');
			  } else if(this.el.webkitRequestFullscreen) {
			    this.el.webkitRequestFullscreen();
			    console.log('webkitRequestFullscreen');
			  } else if(this.el.msRequestFullscreen) {
			    this.el.msRequestFullscreen();
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

					 if(this.el.requestFullscreen) {
					    this.el.requestFullscreen();
					    this._isFullscreen = true;
					    console.log('requestFullscreen');
					  } else if(this.el.mozRequestFullScreen) {
					    this.el.mozRequestFullScreen();
					    this._isFullscreen = true;
					    console.log('mozRequestFullScreen');
					  } else if(this.el.webkitRequestFullscreen) {
					    this.el.webkitRequestFullscreen();
					    this._isFullscreen = true;
					    console.log('webkitRequestFullscreen');
					  } else if(this.el.msRequestFullscreen) {
					    this.el.msRequestFullscreen();
					    this._isFullscreen = true;
					    console.log('msRequestFullscreen');
					  } else {
					  	console.log('unsupported!!!');
					  }

					}
					else {
					 if(this.el.exitFullscreen) {
					    this.el.exitFullscreen();
					    this._isFullscreen = false;
					    console.log('exitFullscreen');
					  } else if(this.el.mozCancelFullScreen) {
					    this.el.mozCancelFullScreen();
					    this._isFullscreen = false;
					    console.log('mozCancelFullScreen');
					  } else if(this.el.webkitExitFullscreen) {
					    this.el.webkitExitFullscreen();
					    this._isFullscreen = false;
					    console.log('webkitExitFullscreen');
					  } else {
					  	console.log('unsupported!!!');
					  }
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