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


				      // document.getElementById('button').addEventListener('click', function() {
				      // 	console.log('clicked');
					     //  panorama.setPov({
								  //   heading: 100,
								  //   pitch:50}
								  // );
				      // })
			},
			handleDeviceOrientation: function(event) {
				console.log('gamma', event.gamma);
				console.log('beta', event.beta);
				console.log('alpha', event.alpha);
				console.log('----');
			},
			handleMapEvent: function(event) {
				switch(event.type) {
					case 'pano_changed':
						this._location.set('panid', event.target.getPano());
						this.output()
					  break;
					case 'links_changed':
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
					  break;
					case 'position_changed':
					  break;
					case 'pov_changed':
							this._location.set('heading', event.target.getPov().heading);
							this._location.set('pitch', event.target.getPov().pitch);
							this.output()
					  break;
				}
			},
			handleEvent: function(e) {
				
				console.log(e);
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