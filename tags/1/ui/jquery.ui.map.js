/*!
 * jQuery UI Map 0.1.2
 * http://code.google.com/p/jquery-ui-map/
 *
 * Copyright (c) 2010 Johan Säll Larsson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Depends:
 *      jquery.ui.core.js
 *      jquery.ui.widget.js
 */

( function($) {
	
	var maps = [], markers = [], layers = [], watches = [];
	
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
				streetViewControl: true,
				streetViewControlOptions: null,
				zoom: 5,
				callback: null,
				debug: true
			},
			
			_create: function() {
				var id = this.element.attr('id');
				maps[id] = new google.maps.Map( document.getElementById(id), this.options );
				markers[id] = new Array;
				watches[id] = new Array;
			},
			
			_init: function() {
				if ( $.isFunction(this.options.callback) ) {
					this.options.callback.call(this, this.getMap());	
				}
			},
			
			detectBrowser: function() {
				if ( navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1 ) {
					this.element.width("100%");
					this.element.height("100%");
				}
			},
			
			getCurrentPosition: function(successCallback, errorCallback, notSupportedCallback, opts) {
				var self = this;
				if ( navigator.geolocation ) {
					if ( $.isFunction(successCallback) && $.isFunction(errorCallback) ) {
						navigator.geolocation.getCurrentPosition ( successCallback, errorCallback, opts );
					} else {
						navigator.geolocation.getCurrentPosition ( function(position) {
							self.getMap().setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) );								
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
						self._getWatches().push(navigator.geolocation.watchPosition ( successCallback, errorCallback, opts ));
					} else {
						self._getWatches().push(navigator.geolocation.watchPosition ( function(position) { 
							self.getMap().setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) ); })
						);
					}
				} else {
					if ( $.isFunction(notSupportedCallback) ) {
						notSupportedCallback.call(this);
					}
				}
			},
			
			sidebar: function(panel, position) {
				this.getMap().controls[position].push(document.getElementById(panel));
			},
			
			addMarker: function( markerOptions, callback ) {
				var marker = new google.maps.Marker( jQuery.extend( { 'map': this.getMap() }, markerOptions) );
				if ( $.isFunction(callback) ) {
					callback.call(this, this.getMap(), marker);
				}
				this._getMarkers().push( marker );
				return marker;
			},
			
			addInfoWindow: function (marker, infoWindowOptions) {
				var self = this;
				var infowindow = new google.maps.InfoWindow(infoWindowOptions);
				google.maps.event.addListener(marker, 'click', function() { 
    				infowindow.open(self.getMap(), marker);
					self.getMap().panTo(marker.position);
				});
			},
			
			loadJSON: function( url, data, callback ) {
				var self = this;
				$.getJSON( url, data, function(data) { 
					$.each( data.markers, function(i, m) {
						if ( $.isFunction(callback) ) {
							callback.call(this, i, m);
						} else {
							var markerOpts = { 'position': new google.maps.LatLng(m.lat, m.lng) };
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
							var markerOpts = { 'position': new google.maps.LatLng(geoPoints[index][0], geoPoints[index][1]) };
							if ( $.isFunction(callback) ) {
								callback.call(this, markerOpts, object.get(0), index);
							} else {
								var marker = self.addMarker( markerOpts );
								var summary = object.find('.summary');
								if ( summary != null ) {
									self.addInfoWindow(marker, { 'content': summary.html() });
									summary.click( function() {
										google.maps.event.trigger(marker, 'click');
										self.getMap().panTo(marker.position);
										return false;
									});
								}
							}
						});
					break;
					case 'microformat':
						$('.'+clazz).each( function(index) {
							var object = $(this);
							var markerOpts = { 'position': new google.maps.LatLng(object.find('.latitude').attr('title'), object.find('.longitude').attr('title')) };
							if ( $.isFunction(callback) ) {
								callback.call(this, markerOpts, object.get(0), index);
							} else {
								var marker = self.addMarker( markerOpts );
								var summary = object.find('.summary');
								if ( summary != null ) {
									self.addInfoWindow(marker, { 'content': summary.html() });
									summary.click( function() {
										google.maps.event.trigger(marker, 'click');
										self.getMap().panTo(marker.position);
										return false;
									});
								}
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
									var markerOpts = { 'position': new google.maps.LatLng(latlng[0], latlng[1]) };
									if ( $.isFunction(callback) ) {
										callback.call(this, markerOpts, object.get(0), index);
									} else {
										var marker = self.addMarker( markerOpts );
										var summary = object.find('.summary');
										if ( summary != null ) {
											self.addInfoWindow(marker, { 'content': summary.html() });
											summary.click( function() {
												google.maps.event.trigger(marker, 'click');
												self.getMap().panTo(marker.position);
												return false;
											});
										}
									}
									
								}
							});
						});
					break;
				}
				
			},
			
			loadFusion: function(id, fusionTablesLayerOptions) {
				var layer = new google.maps.FusionTablesLayer(id, fusionTablesLayerOptions);
				layer.setMap(this.getMap());
			},
			
			//FIXME: Should be diff. params
			loadDirections: function(panel, origin, destination, travelMode) { 
				var directionsDisplay = new google.maps.DirectionsRenderer({ 'map': this.getMap(), 'panel': document.getElementById(panel)});
				var directionsService = new google.maps.DirectionsService();
				directionsService.route( { 'origin':origin, 'destination':destination, 'travelMode': travelMode, 'provideRouteAlternatives' : true }, 
					function(response, status) {
						if ( status == google.maps.DirectionsStatus.OK ) {
							directionsDisplay.setDirections(response);
						} else {
							// Shouldnt be here
							alert('Couldnt find directions, ' + status );
						}
					}
				);
			},
			
			loadStreetViewPanorama: function(panel, streetViewPanoramaOptions) {
				var panorama = new google.maps.StreetViewPanorama(document.getElementById(panel), streetViewPanoramaOptions);
				this.getMap().setStreetView(panorama);
			},
			
			search: function(request, successCallback, errorCallback) {
				var self = this;
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( request, function(results, status) {
					if ( status == google.maps.GeocoderStatus.OK ) {
						if ( $.isFunction(successCallback) ) {
							successCallback.call(this, results);
						} else {
							self.getMap().setCenter(results[0].geometry.location);
						}
					} else {
						if ( $.isFunction(errorCallback) ) {
							errorCallback.call(this, status);
						}
					}
				});
			},
			
			clearMarkers: function() {
				var markers = this._getMarkers();
				for ( var i = 0; i < markers.length; i++ ) {
					google.maps.event.clearInstanceListeners(markers[i]);
					markers[i].setMap( null );
				}
				markers = new Array();
			},
			
			clearWatches: function() {
				if ( navigator.geolocation ) {
					var watches = this._getWatches();
					for ( var i = 0; i < watches.length; i++ ) {
						navigator.geolocation.clearWatch([id][i]);
					}
					watches = new Array();
				}
			},
			
			//FIXME: Google Map won't go away
			destroy: function() {
				this.clearWatches();
				this.clearMarkers();
				var map = this.getMap();
				map = null;
				// Fastest way to remove the map, however probably memory leak
				this.element.removeAttr('style');
				this.element.html('');
				this.options.map = null;
				$.Widget.prototype.destroy.call( this );
			},
			
			getMap: function() {
				return maps[this.element.attr('id')];
			},
			
			_getMarkers: function() {
				return markers[this.element.attr('id')];
			},
			
			_getWatches: function() {
				return watches[this.element.attr('id')];
			},
			
			/*option: function(key, value) {
				switch (key) {
					case "map":
						return this.getMap();
					break;
				}
			},*/
			
			_setOption: function(key, value) {
				switch (key) {
					case "backgroundColor":
						this.options.backgroundColor = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "disableDefaultUI":
						this.options.disableDefaultUI = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "disableDoubleClickZoom":
						this.options.disableDoubleClickZoom = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "draggable":
						this.options.draggable = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "draggableCursor":
						this.options.draggableCursor = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "draggingCursor":
						this.options.draggingCursor = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "keyboardShortcuts":
						this.options.keyboardShortcuts = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "mapTypeControl":
						this.options.mapTypeControl = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "mapTypeControlOptions":
						this.options.mapTypeControlOptions = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "navigationControl":
						this.options.navigationControl = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "navigationControlOptions":
						this.options.navigationControlOptions = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "noClear":
						this.options.noClear = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "scaleControl":
						this.options.scaleControl = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "scaleControlOptions":
						this.options.scaleControlOptions = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "scrollwheel":
						this.options.scrollwheel = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "streetViewControl":
						this.options.streetViewControl = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "streetViewControlOptions":
						this.options.streetViewControlOptions = value;
                    	this.getMap().setOptions(this.options);
					break;
					case "center":
						this.options.center = value;
                    	this.getMap().setCenter(value);
					break;
					case 'mapTypeId':
						this.options.mapTypeId = value;
						this.getMap().setMapTypeId(value);
					break;
					case 'zoom':
						this.options.zoom = value;
                    	this.getMap().setZoom(value);
					break;
				}
				$.Widget.prototype._setOption.apply(this, arguments);
			}
			
	});

} (jQuery) );