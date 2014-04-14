define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/streetViewData',
	'app/views/streetViewGiro',
	'app/models/giro',
	], function($, _, Backbone, StreetViewData, StreetViewGiro, GiroModel) {
		var streetView = Backbone.View.extend({
			el: '#streetView',
			_location: null,
			_giro: new GiroModel(),
			_isFullscreen: false,
			_isLoaded: false,
			initialize: function() {
			  var that = this;
				window.addEventListener('deviceorientation', function(event) {
					that.handleDeviceOrientation(event);
				}, false);
			},
			render: function(Model) {
				this._location = Model;
				var map = new google.maps.LatLng(Model.get('latitude'), Model.get('longitude'));
				var that = this;
				var params = {
					position: map,
					panControl: false,
					zoomControl: false,
					pov: {
						heading: Model.get('heading'),
						pitch: Model.get('pitch'),
					},
					visible: true,
				};
				var panorama = new google.maps.StreetViewPanorama(this.el, params);

				//  Map listeners
				google.maps.event.addListener(panorama, 'pano_changed', function() {
					that.handleMapEvent({type: 'pano_changed', target: panorama});
				});
				google.maps.event.addListener(panorama, 'links_changed', function() {
					that.handleMapEvent({type: 'links_changed', target: panorama});
				});
				google.maps.event.addListener(panorama, 'position_changed', function() {
					that.handleMapEvent({type: 'position_changed', target: panorama});
				});
				google.maps.event.addListener(panorama, 'pov_changed', function() {
					that.handleMapEvent({type: 'pov_changed', target: panorama});
				});

				//  Render data panel
				StreetViewData.render(this._location);
				StreetViewGiro.render(this._giro);
			},
			destroy: function() {
				this._isLoaded = false;
			},
			handleDeviceOrientation: function(event) {
				console.log('gamma', event.gamma);
				console.log('beta', event.beta);
				console.log('alpha', event.alpha);
				console.log('----');

				//  Update model
				this._giro.set('alpha', event.alpha);
				this._giro.set('beta', event.beta);
				this._giro.set('gamma', event.gamma);

				//  Update view
				StreetViewGiro.render(this._giro);
					     //  panorama.setPov({
								  //   heading: 100,
								  //   pitch:50}
								  // );
			},
			handleMapEvent: function(event) {
				switch(event.type) {
					case 'pano_changed':
						this._location.set('panid', event.target.getPano());
					  break;
					case 'links_changed':
						this._location.set('links', event.target.getLinks());
					  break;
					case 'position_changed':
						//  
					  break;
					case 'pov_changed':
						this._location.set('heading', event.target.getPov().heading);
						this._location.set('pitch', event.target.getPov().pitch);
					  break;
				}

				//  Update data panel
				StreetViewData.render(this._location);
			}
		});
		
		return new streetView;
	});