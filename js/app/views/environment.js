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
			el: '#mapCanvas',
			events: {
				"click": "handleEvent"
			},
			initialize: function() {
				this._isFullscreen = false;
				this._panorama = null;
			  // 
			  var that = this;
				window.addEventListener('deviceorientation', function(event) {
					that.handleDeviceOrientation(event);
				}, false);
			},
			render: function(latitude, longitude) {
				console.log('where : ', latitude, longitude);
				var that = this;

			  // The latlng of the entry point to the location
			  var startLocation = new google.maps.LatLng(latitude, longitude);
				var mapOptions = {
				    center: startLocation,
				    zoom: 16
				  };

				// Set up the map and enable the Street View control.
				var map = new google.maps.Map(this.el, mapOptions);
				this._panorama = map.getStreetView();

				// Set up Street View and initially set it visible. Register the custom panorama provider function.
			 var panoOptions = {
			    position: startLocation,
			    visible: true,
			    panoProvider: that.getCustomPanorama
			  };
			  this._panorama.setOptions(panoOptions);

				// Create a StreetViewService object.
				var streetviewService = new google.maps.StreetViewService();


				// Compute the nearest panorama to the Google Sydney office using the service and store that pano ID.
				var radius = 50;
				streetviewService.getPanoramaByLocation(startLocation, radius, function(result, status) {
				    if (status == google.maps.StreetViewStatus.OK) {
				      // We'll monitor the links_changed event to check if the current
				      // pano is either a custom pano or our entry pano.
				      google.maps.event.addListener(that._panorama, 'links_changed', function() {
				        that.createCustomLinks(result.location.pano);
				      });
				    }
				  });
				
			},
			getCustomPanoramaTileUrl: function(pano, zoom, tileX, tileY) {
				  // Return a pano image given the panoID.
				  return 'images/panoReception1024-' + zoom + '-' + tileX + '-' +tileY + '.jpg';
			},
			getCustomPanorama: function(pano) {
				  switch(pano) {
				    case 'reception':
				      return {
				        location: {
				          pano: 'reception',
				          description: 'Google Sydney - Reception',
				          latLng: new google.maps.LatLng(latitude, longitude)
				        },
				        links: [],
				        // The text for the copyright control.
				        copyright: 'Imagery (c) 2010 Google',
				        // The definition of the tiles for this panorama.
				        tiles: {
				          tileSize: new google.maps.Size(1024, 512),
				          worldSize: new google.maps.Size(2048, 1024),
				          // The heading at the origin of the panorama tile set.
				          centerHeading: 105,
				          getTileUrl: getCustomPanoramaTileUrl
				        }
				      };
				      break;
				    default:
				      return null;
				  }
			},
			createCustomLinks: function(entryPanoId) {
				  var links = this._panorama.getLinks();
				  var panoId = this._panorama.getPano();

				  switch(panoId) {
				    case entryPanoId:
				      // Adding a link in the view from the entrance of the building to
				      // reception.
				      links.push({
				        heading: 25,
				        description : 'Google Sydney',
				        pano : 'reception'
				      });
				      break;
				    case 'reception':
				      // Adding a link in the view from the entrance of the office
				      // with an arrow pointing at 100 degrees, with a text of 'Exit'
				      // and loading the street entrance of the building pano on click.
				      links.push({
				        heading: 195,
				        description : 'Exit',
				        pano : entryPanoId
				      });
				      break;
				    default:
				      return;
				  }
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