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
			  this.image = {};
			  this.image.touchSensitivity = 1;
			  this.image.giroSensitivity = 1;
			  this.image.el = $(this.el).find('#panorama')[0];
			  this.image.offset = {};
			  this.image.offset.width = this.image.el.offsetWidth - this.el.offsetWidth;
			  this.image.offset.height = this.image.el.offsetHeight- this.el.offsetHeight;
			  this.image.ratio = {};
			  this.image.ratio.z = Math.abs(this.image.offset.width / 360);
			  this.image.ratio.y = Math.abs(this.image.offset.height / 180);
			  this.image.orig = {};
			  this.image.orig.x = this.image.el.offsetLeft;
			  this.image.orig.y = this.image.el.offsetTop;
			  this.image.now = {};
			  this.image.now.x = 0;
			  this.image.now.y = 0;
			  this.image.limit = {};
			  this.image.limit.left = Math.abs(this.image.orig.x);
			  this.image.limit.right = -(this.image.offset.width - Math.abs(this.image.orig.x));
			  this.image.limit.top = Math.abs(this.image.orig.y);
			  this.image.limit.bottom = -(this.image.offset.height - Math.abs(this.image.orig.y));

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
			  if (!this.recall.giro.z) {
			   this.recall.giro.z = angleZ;
			  }
			  if (!this.recall.giro.y) {
			    this.recall.giro.y = angleY;
			  }
			  var diffX = Math.abs(angleZ - this.recall.giro.z) > 100 ? 0 : angleZ - this.recall.giro.z;
			  var diffY = angleY - this.recall.giro.y;
			  var newX = Math.round(this.image.now.x + (diffX * this.image.ratio.z));
			  var newY = Math.round(this.image.now.y + ((diffY * this.image.ratio.y) * this.image.giroSensitivity));
			  var translate = 'translate(';

			  //  X position
			  if (newX < this.image.limit.left && newX > this.image.limit.right) {
			    this.image.now.x = newX;
			    translate += newX + 'px,';
			  } else {
			    translate += this.image.now.x + 'px,';
			  }

			  //  Y position
			  if (newY < this.image.limit.top && newY > this.image.limit.bottom) {
			    this.image.now.y = newY;
			    translate += newY + 'px';
			  } else {
			    translate += this.image.now.y + 'px';
			  }

			  //  update event
			  this._delegate[GyroPanorama.DID_PAN].call(this._delegate, {diffX: Math.abs(diffX), diffY: Math.abs(diffY) });

			  //  close and update
			  this.image.el.style.webkitTransform = translate + ')';

			  //  record for 'diff' calculation
			  this.recall.giro.z = angleZ;
			  this.recall.giro.y = angleY;
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