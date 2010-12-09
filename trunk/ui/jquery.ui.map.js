/*
 * jQuery UI Map 0.1.1
 *
 * Author: Johan Säll Larsson
 *
 * Depends:
 *      jquery.ui.core.js
 *      jquery.ui.widget.js
 */

( function($) {
	
	var maps = [], markers = [], watchIds = [], id;
	
	$.widget( "ui.gmap", {
			
			options: {
				backgroundColor : null,
				center: new google.maps.LatLng(0.0, 0.0),
				disableDefaultUI: false,
				disableDoubleClickZoom: false,
				draggable: true,
				draggableCursor: null,
				draggingCursor: null,
				keyboardShortcuts: true,
				mapTypeControl: true,
				mapTypeControlOptions: null,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				navigationControl: true,
				navigationControlOptions: null,
				noClear: false,
				scaleControl: false,
				scaleControlOptions: null,
				scrollwheel: false,
				//streetView: new google.maps.StreetViewPanorama(),
				streetViewControl: true,
				streetViewControlOptions: null,
				zoom: 5,
				callback: null,
				map: null
			},
			
			_create: function() {
				id = this.element.attr('id');
			},
			
			_init: function() {
					var o = this.options;
					o.map = maps[id] = new google.maps.Map( document.getElementById(id), o );
					markers[id] = new Array;
					watchIds[id] = new Array;
					if ( $.isFunction(o.callback) ) {
						o.callback.call(this);	
					}
			},
			
			getCurrentPosition: function(successCallback, errorCallback, notSupportedCallback, opts) {
				var self = this;
				if ( navigator.geolocation ) {
					if ( $.isFunction(successCallback) && $.isFunction(errorCallback) ) {
						navigator.geolocation.getCurrentPosition ( successCallback, errorCallback, opts );
					} else {
						navigator.geolocation.getCurrentPosition ( function(position) {
							maps[id].setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) );								
						});
					}
				} else {
					if ( $.isFunction(notSupportedCallback) ) {
						notSupportedCallback.call(this);
					}
				}
			},
			
			watchPosition: function(successCallback, errorCallback, notSupportedCallback, opts) {
				var self = this;
				if ( navigator.geolocation ) {
					if ( $.isFunction(successCallback) && $.isFunction(errorCallback) ) {
						watchIds[id].push(navigator.geolocation.watchPosition ( successCallback, errorCallback, opts ));
					} else {
						watchIds[id].push(navigator.geolocation.watchPosition ( function(position) { maps[id].setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) ); }));
					}
				} else {
					if ( $.isFunction(notSupportedCallback) ) {
						notSupportedCallback.call(this);
					}
				}
			},
			
			sidebar: function(panel, position) {
				maps[id].controls[position].push(document.getElementById(panel));
			},
			
			addMarker: function( markerOptions, callback ) {
				var marker = new google.maps.Marker( jQuery.extend( { 'map': maps[id] }, markerOptions) );
				if ( $.isFunction(callback) ) {
					callback.call(this, maps[id], marker);
				}
				markers[id].push( marker );
				return marker;
			},
			
			addInfoWindow: function (marker, infoWindowOptions) {
				var self = this;
				var infowindow = new google.maps.InfoWindow(infoWindowOptions);
				google.maps.event.addListener(marker, 'click', function() { 
    				infowindow.open(maps[id], marker);
					maps[id].panTo(marker.position);
				});
			},
			
			loadJSON: function( url, data, callback ) {
				var self = this;
				$.getJSON( url, data, function(data) { 
					$.each( data.markers, function(i, m) {
						if ( $.isFunction(callback) ) {
							callback.call(this, i, m);
						} else {
							var markerOpts = { 'map': maps[id], 'position': new google.maps.LatLng(m.lat, m.lng), 'title': m.title };
							self.addMarker(markerOpts);
						}
					});
				});
			},
			
			loadHTML: function ( type, clazz, callback ) {
				var self = this;
				switch ( type ) {
					case 'rdfa':
						var geoPoints = [];
						$('.'+clazz+' [property="geo:lat_long"]').each( function() {
							geoPoints.push(($(this).attr('content')).split(','));												
						});
						$('.'+clazz).each( function(index) {
							var object = $(this);
							var markerOpts = { 'map': maps[id], 'position': new google.maps.LatLng(geoPoints[index][0], geoPoints[index][1]) };
							if ( $.isFunction(callback) ) {
								callback.call(this, markerOpts, object, index);
							} else {
								self.addMarker( 
									markerOpts, 
									function(map, marker) {
										var summary = object.find('.summary');
										if ( summary != null ) {
											self.addInfoWindow(marker, { 'content': summary.html() });
											summary.click( function() {
												google.maps.event.trigger(marker, 'click');
												map.panTo(marker.position);
												return false;
											});
										}
									} 
								);	
							}
						});
					break;
					case 'microformat':
						$('.'+clazz).each( function(index) {
							var object = $(this);
							var markerOpts = { 'map': maps[id], 'position': new google.maps.LatLng(object.find('.latitude').attr('title'), object.find('.longitude').attr('title')) };
							if ( $.isFunction(callback) ) {
								callback.call(this, markerOpts, object, index);
							} else {
								self.addMarker( 
									markerOpts, 
									function(map, marker) {
										var summary = object.find('.summary');
										if ( summary != null ) {
											self.addInfoWindow(marker, { 'content': summary.html() });
											summary.click( function() {
												google.maps.event.trigger(marker, 'click');
												map.panTo(marker.position);
												return false;
											});
										}
									} 
								);
							}
						});
					break;
					//FIXME: Seriously fix this
					case 'microdata':
						$('.'+clazz).each( function() {
							var object = $(this);
							$(object).children().each( function(index) {
								if ( $(this).attr('itemprop') == 'geo' ) {
									var latlng = $(this).html().split(';');
									var markerOpts = { 'map': maps[id], 'position': new google.maps.LatLng(latlng[0], latlng[1]) };
									if ( $.isFunction(callback) ) {
										callback.call(this, markerOpts, object, index);
									} else {
										self.addMarker( 
											markerOpts, 
											function(map, marker) {
												self.addInfoWindow(marker, { 'content': $(object).get(0) });
												object.find('a.link').click( function() {
													google.maps.event.trigger(marker, 'click');
													map.panTo(marker.position);
													return false;
												});
											} 
										);
									}
									
								}
							});
						});
					break;
				}
				
			},
			
			//FIXME: Should be diff. params
			loadDirections: function(panel, origin, destination, travelMode) { 
				var directionsDisplay = new google.maps.DirectionsRenderer({ 'map': maps[id], 'panel': document.getElementById(panel)});
				var directionsService = new google.maps.DirectionsService();
				directionsService.route( { 'origin':origin, 'destination':destination, 'travelMode': travelMode, 'provideRouteAlternatives' : true }, 
					function(response, status) {
						if ( status == google.maps.DirectionsStatus.OK ) {
							directionsDisplay.setDirections(response);
						} else {
							alert('Couldnt find directions, ' + status );
						}
					}
				);
			},
			
			loadStreetViewPanorama: function(panel, streetViewPanoramaOptions) {
				var panorama = new google.maps.StreetViewPanorama(document.getElementById(panel), streetViewPanoramaOptions);
				maps[id].setStreetView(panorama);
			},
			
			search: function(request, successCallback, errorCallback) {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( request, function(results, status) {
					if ( status == google.maps.GeocoderStatus.OK ) {
						if ( $.isFunction(successCallback) ) {
							successCallback.call(this, results);
						} else {
							maps[id].setCenter(results[0].geometry.location);
						}
					} else {
						if ( $.isFunction(errorCallback) ) {
							errorCallback.call(this, status);
						}
					}
				});
			},
			
			clearMarkers: function() {
				for ( var i = 0; i < markers[id].length; i++ ) {
					markers[id][i].setMap( null );
				}
				markers[id] = new Array();
			},
			
			clearWatches: function() {
				if ( navigator.geolocation ) {
					for ( var i = 0; i < watchIds[id].length; i++ ) {
						navigator.geolocation.clearWatch([id][i]);
					}
					watchIds[id] = new Array();
				}
			},
			
			//TODO: Add the rest of the options
			_setOption: function(key, value) {
				switch (key) {
					case "center":
						this.options.center = value;
                    	maps[id].setCenter(value);
					break;
					case 'mapTypeId':
						this.options.mapTypeId = value;
						maps[id].setMapTypeId(value);
					break;
					case 'zoom':
						this.options.zoom = value;
                    	maps[id].setZoom(value);
					break;
				}
				$.Widget.prototype._setOption.apply(this, arguments);
			},
			
			//FIXME: Google Map won't go away
			destroy: function() {
				this.clearWatches();
				this.clearMarkers();
				maps[id] = null;
				this.options.map = null;
				$.Widget.prototype.destroy.call( this );
			}
			
	});

} (jQuery) );