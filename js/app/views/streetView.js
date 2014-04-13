define([
	'jquery',
	'underscore',
	'backbone',
	'app/config',
	'text!html/streetView/data.html',
	], function($, _, Backbone, Config, DataTemplate) {
		var streetView = Backbone.View.extend({
			el: '#streetView',
			events: {
				"click": "handleEvent"
			},
			_location: null,
			_map: null,
			_panorama: null,
			_isFullscreen: false,
			initialize: function() {
			  var that = this;
				window.addEventListener('deviceorientation', function(event) {
					that.handleDeviceOrientation(event);
				}, false);
			},
			render: function(Model) {
				this._location = Model;
				this._map = new google.maps.LatLng(Model.get('latitude'), Model.get('longitude'));
				var that = this;
				var options = {
					position: this._map,
					pov: {
						heading: Model.get('heading'),
						pitch: Model.get('pitch'),
					},
					visible: true,
				};
				var panorama = new google.maps.StreetViewPanorama(this.el, options);

				google.maps.event.addListener(panorama, 'pano_changed', function() {
					that._location.set('panid', panorama.getPano());
				  that.output();
				});

				google.maps.event.addListener(panorama, 'links_changed', function() {
				      // var linksTable = document.getElementById('links_list');
				      // while(linksTable.hasChildNodes()) {
				      //   linksTable.removeChild(linksTable.lastChild);
				      // };
				      // var links =  panorama.getLinks();
				      // for (var i in links) {
				      //   var row = document.createElement('tr');
				      //   linksTable.appendChild(row);
				      //   var labelCell = document.createElement('td');
				      //   labelCell.innerHTML = '<b>Link: ' + i + '</b>';
				      //   var valueCell = document.createElement('td');
				      //   valueCell.innerHTML = links[i].description;
				      //   linksTable.appendChild(labelCell);
				      //   linksTable.appendChild(valueCell);
				      // }
				});

				google.maps.event.addListener(panorama, 'position_changed', function() {
				      // var positionCell = document.getElementById('position_cell');
				      // positionCell.firstChild.nodeValue = panorama.getPosition() + '';

				      // document.getElementById('button').addEventListener('click', function() {
				      // 	console.log('clicked');
					     //  panorama.setPov({
								  //   heading: 100,
								  //   pitch:50}
								  // );
				      // })
				});

				google.maps.event.addListener(panorama, 'pov_changed', function() {
					that._location.set('heading', panorama.getPov().heading);
					that._location.set('pitch', panorama.getPov().pitch);
					that.output();
				});
			},
			handleDeviceOrientation: function(event) {
				console.log('gamma', event.gamma);
				console.log('beta', event.beta);
				console.log('alpha', event.alpha);
				console.log('----');
			},
			handleEvent: function(e) {
				
				// console.log('e);
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
				$('#streetViewData').remove();
				$(this.el).append(_.template(DataTemplate, {data: this._location}));
			},
			expand: function(model) {
				// if ($('#pledgePage').length > 0) {
				// 	$('#pledgePage').remove();
				// }
				// $(this.el).prepend(_.template(PageTemplate, {pledge: model}));
			}
		});
		
		return new streetView;
	});