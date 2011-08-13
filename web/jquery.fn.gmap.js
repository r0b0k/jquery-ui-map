 /*!
 * jQuery FN Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
( function($) {
	
	/**
	 * This is how you write unmaintainable code :) - the size is small though.
	 * @param namespace:string
	 * @param name:string
	 * @param base:object
	 */
	$.a = function( a, b, c ) {
		var d;
		$[a] = $[a] || {};
		$[a][b] = function(options, element) {
			if ( arguments.length ) {
				this._setup(options, element);
			}
		};
		$[a][b].prototype = c;
		$.fn[b] = function(options) {
			if ( d && d[options] ) {
				return d[options].apply(d, Array.prototype.slice.call(arguments, 1));
			} else if ( typeof options === 'object' || ! options ) {
				d = new $[a][b](options, this);
				return this;
			}  
		};
	};
	
	$.a("ui", "gmap", {
		
		/**
		 * Map options
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions
		 */
		options: {
			center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
			mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
			zoom: 5	
		},
		
		/**
		 * Get or set options
		 * @param key:string
		 * @param options:object
		 */
		option: function(a, b) {
			c = this;
			if (!b) {
				return c.options[a];
			} else {
				c._update( function() {	
					c.options[a] = b;
				});
			}
		},
		
		/**
		 * Setup plugin basics, 
		 * Set the jQuery UI Widget this.element, so extensions will work on both plugins
		 */
		_setup: function( a, b ) {
			this.id = b.attr('id');
			this.instances = [];
			this.element = b;
			this.options = jQuery.extend(this.options, a);
			this._create();
			if ( this._init ) {
				this._init();
			}
		},
		
		/**
		 * Create
		 * @return $(google.maps.Map)
		 */
		_create: function() {
			this.options.center = this._latLng(this.options.center);
			var a = this.element;
			var b = this.instances[this.id] = { map: new google.maps.Map( a[0], this.options ), markers: [], services: [], overlays: [] };
			google.maps.event.addListenerOnce(b.map, 'bounds_changed', function() {
				a.trigger('init', b.map);
			});
			return $(b.map);
		},
		
		/**
		 * Sets the current map options
		 * @param callback:function() (optional)
		 */
		_update: function(a) {
			var map = this.get('map');
			jQuery.extend(this.options, { 'center': map.getCenter(), 'mapTypeId': map.getMapTypeId(), 'zoom': map.getZoom() } );
			this._call(a);
			map.setOptions(this.options);
		},
		
		/**
		 * Adds a latitude longitude pair to the bounds.
		 * @param position:google.maps.LatLng/string
		 */
		addBounds: function(a) {
			this.get('bounds', new google.maps.LatLngBounds()).extend(this._latLng(a));
			this.get('map').fitBounds(this.get('bounds'));
		},
		
		/**
		 * Adds a custom control to the map
		 * @param panel:jquery/node/string	
		 * @param position:google.maps.ControlPosition	 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			this.get('map').controls[b].push(this._unwrap(a));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param markerOptions:google.maps.MarkerOptions (optional)
		 * @param callback:function(map:google.maps.Map, marker:google.maps.Marker) (optional)
		 * @return $(google.maps.Marker)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 */
		addMarker: function(a, b) {
			var c = this.get('map');
			a.position = (a.position) ? this._latLng(a.position) : null;
			var d = new google.maps.Marker( jQuery.extend({'map': c, 'bounds': false}, a) );
			this.get('markers', []).push(d);
			if ( d.bounds ) {
				this.addBounds(d.getPosition());
			}
			this._call(b, c, d);
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
			this._call(b, c);
			return $(c);
		},
		
		/**
		 * Clears by type
		 * @param type:string i.e. markers, overlays, services
		 */
		clear: function(a) {
			var b = this.get(a);
			$.each(b, function(c, d) {
				google.maps.event.clearInstanceListeners(d);
				d.setMap(null);
				d = null;
			});
			this.set(a, []);
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'tags'
		 * @param property:string the property to search within
		 * @param value:string
		 * @param delimiter:string/boolean	a delimiter if it's multi-valued otherwise false
		 * @param callback:function(marker:google.maps.Marker, isFound:boolean)
		 */
		findMarker: function(a, b, c, d) {
			var e = this.get('markers');
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
				this._call(d, e[i], g);
			};
		},

		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function(a, b) {
			var c = this.instances[this.id];
			if ( b && !c[a] ) {
				this.set(a, b);
			}
			return c[a];
		},
		
		/**
		 * Triggers an InfoWindow to open
		 * @param infoWindowOptions:google.maps.InfoWindowOptions
		 * @param marker:google.maps.Marker (optional)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		openInfoWindow: function(a, b) {
			this.get('iw', new google.maps.InfoWindow).setOptions(a);
			this.get('iw').open(this.get('map'), this._unwrap(b)); 
		},
				
		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function(a, b) {
			this.instances[this.id][a] = b;
		},
		
		/**
		 * Refreshes the map
		 */
		refresh: function() {
			$(this.get('map')).triggerEvent('resize');
			this._update();
		},
		
		/**
		 * Destroys the plugin.
		 */
		destroy: function() {
			this.clear('markers');
			this.clear('services');
			this.clear('overlays');
			var a = this.instances[this.id];
			for ( b in a ) {
				a[b] = null;
			}
		},
		
		/**
		 * Helper method for calling a function
		 * @param callback
		 */
		_call: function(a) {
			if ( $.isFunction(a) ) {
				a.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		/**
		 * Helper method for google.maps.Latlng
		 * @param callback
		 */
		_latLng: function(a) {
			if ( a instanceof google.maps.LatLng ) {
				return a;
			} else {
				var b = a.replace(' ','').split(',');
				return new google.maps.LatLng(b[0], b[1]);
			}
		},
		
		/**
		 * Helper method for unwrapping jQuery/DOM/string elements
		 * @param callback
		 */
		_unwrap: function(a) {
			if ( !a ) {
				return null;
			} else if ( a instanceof jQuery ) {
				return a[0];
			} else if ( a instanceof Object ) {
				return a;
			}
			return $('#'+a)[0];
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