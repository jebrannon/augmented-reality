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

				//  Memory
				this._recall = {};
			  this._recall.giro = {};
			  this._recall.giro.z = false;
			  this._recall.giro.y = false;
			  this._recall.touch = {};
			  this._recall.touch.x = false;
			  this._recall.touch.y = false;

			  //  Image
			  this._image = {};
			  this._image.touchSensitivity = 1;
			  this._image.giroSensitivity = 1;
			  this._image.el = $(this.el).find('#panorama')[0];
			  this._image.offset = {};
			  this._image.offset.width = this._image.el.offsetWidth - this.el.offsetWidth;
			  this._image.offset.height = this._image.el.offsetHeight- this.el.offsetHeight;
			  this._image.ratio = {};
			  this._image.ratio.z = Math.abs(this._image.offset.width / 360);
			  this._image.ratio.y = Math.abs(this._image.offset.height / 180);
			  this._image.orig = {};
			  this._image.orig.x = this._image.el.offsetLeft;
			  this._image.orig.y = this._image.el.offsetTop;
			  this._image.now = {};
			  this._image.now.x = 0;
			  this._image.now.y = 0;
			  this._image.limit = {};
			  this._image.limit.left = Math.abs(this._image.orig.x);
			  this._image.limit.right = -(this._image.offset.width - Math.abs(this._image.orig.x));
			  this._image.limit.top = Math.abs(this._image.orig.y);
			  this._image.limit.bottom = -(this._image.offset.height - Math.abs(this._image.orig.y));

			  // 
			  var that = this;
				window.addEventListener('deviceorientation', function(event) {
					that.handleDeviceOrientation(event);
				}, false);
			},
			render: function(where) {
				console.log('where : ', where, this.el);

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
			handleDeviceOrientation: function(e) {
  			var z = Math.round(event.alpha);  //  0 > 360
  			var y = Math.abs(Math.round(event.gamma));  //  -180 > 180
  			this.updatePanoramaPositionGiro(z, y);
			},
			handleEvent: function(e) {
				if (e.target && e.target.getAttribute('data-app-action')) {
					// if (!this._isFullscreen) {

					//  if(this.el.requestFullscreen) {
					//     this.el.requestFullscreen();
					//     this._isFullscreen = true;
					//     console.log('requestFullscreen');
					//   } else if(this.el.mozRequestFullScreen) {
					//     this.el.mozRequestFullScreen();
					//     this._isFullscreen = true;
					//     console.log('mozRequestFullScreen');
					//   } else if(this.el.webkitRequestFullscreen) {
					//     this.el.webkitRequestFullscreen();
					//     this._isFullscreen = true;
					//     console.log('webkitRequestFullscreen');
					//   } else if(this.el.msRequestFullscreen) {
					//     this.el.msRequestFullscreen();
					//     this._isFullscreen = true;
					//     console.log('msRequestFullscreen');
					//   } else {
					//   	console.log('unsupported!!!');
					//   }

					// }
					// else {
					//  if(this.el.exitFullscreen) {
					//     this.el.exitFullscreen();
					//     this._isFullscreen = false;
					//     console.log('exitFullscreen');
					//   } else if(this.el.mozCancelFullScreen) {
					//     this.el.mozCancelFullScreen();
					//     this._isFullscreen = false;
					//     console.log('mozCancelFullScreen');
					//   } else if(this.el.webkitExitFullscreen) {
					//     this.el.webkitExitFullscreen();
					//     this._isFullscreen = false;
					//     console.log('webkitExitFullscreen');
					//   } else {
					//   	console.log('unsupported!!!');
					//   }
					// }
					
				}
			},
			updatePanoramaPositionGiro: function(angleZ, angleY) {
			  if (!this._recall.giro.z) {
			   this._recall.giro.z = angleZ;
			  }
			  if (!this._recall.giro.y) {
			    this._recall.giro.y = angleY;
			  }
			  var diffX = Math.abs(angleZ - this._recall.giro.z) > 100 ? 0 : angleZ - this._recall.giro.z;
			  var diffY = angleY - this._recall.giro.y;
			  var newX = Math.round(this._image.now.x + (diffX * this._image.ratio.z));
			  var newY = Math.round(this._image.now.y + ((diffY * this._image.ratio.y) * this._image.giroSensitivity));
			  var translate = 'translate(';

			  //  X position
			  if (newX < this._image.limit.left && newX > this._image.limit.right) {
			    this._image.now.x = newX;
			    translate += newX + 'px,';
			  } else {
			    translate += this._image.now.x + 'px,';
			  }

			  //  Y position
			  if (newY < this._image.limit.top && newY > this._image.limit.bottom) {
			    this._image.now.y = newY;
			    translate += newY + 'px';
			  } else {
			    translate += this._image.now.y + 'px';
			  }

			  //  close and update
			  this._image.el.style.webkitTransform = translate + ')';

			  //  record for 'diff' calculation
			  this._recall.giro.z = angleZ;
			  this._recall.giro.y = angleY;
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