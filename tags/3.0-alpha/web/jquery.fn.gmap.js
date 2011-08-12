 /*!
 * jQuery FN Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
( function($) {
	
	var o = {
		center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
		mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
		zoom: 5	
	};
	
	var gmap = {
		
		/**
		 * Get or set options
		 * @param key:string
		 * @param options:object
		 */
		option: function(a, b) {
			if (!b) {
				return o[a];
			} else {
				gmap._a( function() {				
					o[a] = b;
				});
			}
		},
		
		/**
		 * Create plugin
		 * @param options:object
		 * @return $(google.maps.Map)
		 */
		_create: function(a) {
			gmap._b(a);
			o.center = $.fn.gmap._uwl(o.center);
			var b = $(this);
			var c = $.fn.gmap.instances[b.attr('id')] = { map: new google.maps.Map( b[0], o ), markers: [], services: [], overlays: [] };
			google.maps.event.addListenerOnce(c.map, 'bounds_changed', function() {
				b.trigger('init', c.map);
			});
			return $(c.map);
		},
		
		/**
		 * Sets the current map options
		 * @param callback:function() (optional)
		 */
		_a: function(a) {
			var map = gmap.get('map');
			gmap._b({ 'center': map.getCenter(), 'mapTypeId': map.getMapTypeId(), 'zoom': map.getZoom(), 'heading': map.getHeading(), 'streetView': map.getStreetView(), 'tilt': map.getTilt() } );
			$.fn.gmap._t(a);
			map.setOptions(o);
		},
		
		/**
		 * Sets the options
		 * @param options:object
		 */
		_b: function(a) {
			o = jQuery.extend(o, a);
		},
		
		/**
		 * Adds a latitude longitude pair to the bounds.
		 * @param position:google.maps.LatLng/string
		 */
		addBounds: function(a) {
			gmap.get('bounds', new google.maps.LatLngBounds()).extend($.fn.gmap._uwl(a));
			gmap.get('map').fitBounds(gmap.get('bounds'));
		},
		
		/**
		 * Adds a custom control to the map
		 * @param panel:jquery/node/string	
		 * @param position:google.maps.ControlPosition	 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			gmap.get('map').controls[b].push($.fn.gmap._uw(a));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param markerOptions:google.maps.MarkerOptions (optional)
		 * @param callback:function(map:google.maps.Map, marker:google.maps.Marker) (optional)
		 * @return $(google.maps.Marker)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 */
		addMarker: function(a, b) {
			var c = gmap.get('map');
			a.position = (a.position) ? $.fn.gmap._uwl(a.position) : null;
			var d = new google.maps.Marker( jQuery.extend({'map': c, 'bounds': false}, a) );
			gmap.get('markers', []).push(d);
			if ( d.bounds ) {
				gmap.addBounds(d.getPosition());
			}
			$.fn.gmap._t(b, c, d);
			return $(d);
		},
		
		/**
		 * Adds an InfoWindow to the map
		 * @param infoWindowOptions:google.maps.InfoWindowOptions (optional)
		 * @param callback:function(InfoWindow:google.maps.InfoWindowOptions) (optional)
		 * @return $(google.maps.InfoWindowOptions)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		addInfoWindow: function(a, b) {
			var c = new google.maps.InfoWindow(a);
			$.fn.gmap._t(b, c);
			return $(c);
		},
		
		/**
		 * Clears by type
		 * @param type:string i.e. markers, overlays, services
		 */
		clear: function(a) {
			var b = gmap.get(a);
			$.each(b, function(c, d) {
				google.maps.event.clearInstanceListeners(d);
				d.setMap(null);
				d = null;
			});
			gmap.set(a, []);
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'tags'
		 * @param property:string the property to search within
		 * @param value:string
		 * @param delimiter:string/boolean	a delimiter if it's multi-valued otherwise false
		 * @param callback:function(status:boolean, marker:google.maps.Marker)
		 */
		findMarker: function(a, b, c, d) {
			var e = gmap.get('markers');
			for ( var i = 0; i < e.length; i++ ) {
				var g = ( e[i][a] === b );
				if ( c && e[i][a] ) {
					var f = e[i][a].split(c);
					for ( var j = 0; j < f.length; j++ ) {
						if (f[j] === b) {
							g = true;
							break;
						}
					}
				}
				$.fn.gmap._t(d, g, e[i]);
			};
		},
		
		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function(a, b) {
			var c = $.fn.gmap.instances[$.fn.gmap.id];
			if ( b && !c[a] ) {
				gmap.set(a, b);
			}
			return c[a];
		},
				
		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function(a, b) {
			$.fn.gmap.instances[$.fn.gmap.id][a] = b;
		},
		
		/**
		 * Triggers an InfoWindow to open
		 * @param infoWindowOptions:google.maps.InfoWindowOptions
		 * @param marker:google.maps.Marker (optional)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		openInfoWindow: function(a, b) {
			gmap.get('iw', new google.maps.InfoWindow).setOptions(a);
			gmap.get('iw').open(gmap.get('map'), $.fn.gmap._uw(b)); 
		},
		
		/**
		 * Adds fusion data to the map.
		 * @param fusionTableOptions:google.maps.FusionTablesLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions
		 * @param fusionTableId:int
		 */
		loadFusion: function(a, b) {
			if (!b) {
				if ( !gmap.get('overlays').FusionTablesLayer ) {
					gmap.get('overlays').FusionTablesLayer = new google.maps.FusionTablesLayer();
				}
				gmap.get('overlays').FusionTablesLayer.setOptions(jQuery.extend({'map': gmap.get('map') }, a));
			} else {
				gmap.get('overlays').FusionTablesLayer = new google.maps.FusionTablesLayer(b, a);
				gmap.get('overlays').FusionTablesLayer.setMap(gmap.get('map'));
			}
		},
		
		/**
		 * Adds markers from KML file or GeoRSS feed
		 * @param uid:String - an identifier for the RSS e.g. 'rss_dogs'
		 * @param url:String - URL to feed
		 * @param kmlLayerOptions:google.maps.KmlLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions
		 */
		loadKML: function(a, b, c) {
			gmap.get('overlays')[a] = new google.maps.KmlLayer(b, jQuery.extend({'map': gmap.get('map')}, c));
		},
		
		/**
		 * Computes directions between two or more places.
		 * @param directionsRequest:google.maps.DirectionsRequest
		 * @param directionsRendererOptions:google.maps.DirectionsRendererOptions (optional)
		 * @param callback:function(result:google.maps.DirectionsResult, status:google.maps.DirectionsStatus)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult
		 */
		displayDirections: function(a, b, c) {		
			var map = gmap.get('map');
			if ( !gmap.get('services').DirectionsService ) {
				gmap.get('services').DirectionsService = new google.maps.DirectionsService();
			}
			if ( !gmap.get('services').DirectionsRenderer ) {
				gmap.get('services').DirectionsRenderer = new google.maps.DirectionsRenderer();
			}
			gmap.get('services').DirectionsRenderer.setOptions(b);
			gmap.get('services').DirectionsService.route(a, function(result, status) {
				if ( status === 'OK' ) {
					if ( b.panel ) {
						gmap.get('services').DirectionsRenderer.setDirections(result);
						gmap.get('services').DirectionsRenderer.setMap(map);
					}
				} else {
					gmap.get('services').DirectionsRenderer.setMap(null);
				}
				$.fn.gmap._t(c, result, status);
			});
		},
		
		/**
		 * Displays the panorama for a given LatLng or panorama ID.
		 * @param panel:jQuery/String/Node
		 * @param streetViewPanoramaOptions:google.maps.StreetViewPanoramaOptions (optional) 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions
		 */
		displayStreetView: function(a, b) {
			gmap.get('services').StreetViewPanorama = new google.maps.StreetViewPanorama($.fn.gmap._uw(a), b);
			gmap.get('map').setStreetView(gmap.get('services').StreetViewPanorama);
		},
		
		/**
		 * A service for converting between an address and a LatLng.
		 * @param geocoderRequest:google.maps.GeocoderRequest
		 * @param callback:function(result:google.maps.GeocoderResult, status:google.maps.GeocoderStatus), 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult
		 */
		search: function(a, b) {
			if ( !gmap.get('services').Geocoder ) {
				gmap.get('services').Geocoder = new google.maps.Geocoder();
			}
			gmap.get('services').Geocoder.geocode(a, b);
		},
		
		/**
		 * Refreshes the map
		 */
		refresh: function() {
			$(gmap.get('map')).triggerEvent('resize');
			gmap._a();
		},
		
		/**
		 * Destroys the plugin.
		 */
		destroy: function() {
			gmap.clear('markers');
			gmap.clear('services');
			gmap.clear('overlays');
			var a = $.fn.gmap.instances[$.fn.gmap.id];
			for ( b in a ) {
				a[b] = null;
			}
		}
		
	};
	
	$.fn.gmap = function(a) {
		
		$.fn.gmap.id = this.attr('id');
		
		if ( gmap[a] ) {
			return gmap[a].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof a === 'object' || ! a ) {
			gmap._create.apply(this, arguments);
			return this;
		}  
		
	};
	
	$.extend($.fn.gmap, {
        
		id: null,
		instances: [],
		
		_t: function(a) {
			if ( $.isFunction(a) ) {
				a.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		_uwl: function(a) {
			if ( a instanceof google.maps.LatLng ) {
				return a;
			} else {
				var b = a.replace(' ','').split(',');
				return new google.maps.LatLng(b[0], b[1]);
			}
		},
		
		_uw: function unwrap(a) {
			if ( !a ) {
				return null;
			} else if ( a instanceof jQuery ) {
				return a[0];
			} else if ( a instanceof Object ) {
				return a;
			}
			return document.getElementById(a);
		}
			
	});
	
	jQuery.fn.extend( {
		
		click: function(a) { 
			return this.addEventListener('click', a);
		},
		
		rightclick: function(a) {
			return this.addEventListener('rightclick', a);
		},
		
		dblclick: function(a) {
			return this.addEventListener('dblclick', a);
		},
		
		mouseover: function(a) {
			return this.addEventListener('mouseover', a);
		},
		
		mouseout: function(a) {
			return this.addEventListener('mouseout', a);
		},
		
		drag: function(a) {
			return this.addEventListener('drag', a );
		},
		
		dragend: function(a) {
			return this.addEventListener('dragend', a );
		},
		
		triggerEvent: function(a) {
			google.maps.event.trigger(this[0], a);		
		},
		
		addEventListener: function(a, b) {
			if ( google.maps && this[0] instanceof google.maps.MVCObject ) {
				google.maps.event.addListener(this[0], a, b );
			} else {
				this.bind(a, b);	
			}
			return this;
		}
		
	});

} (jQuery) );