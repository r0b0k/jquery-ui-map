 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *      jquery.ui.core.js
 *      jquery.ui.widget.js
 */

( function($) {
	
	$.widget( "ui.gmap", {
		
		/**
		 * Widget options
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions
		 */
		options: {
			center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
			mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
			zoom: 5
		},
		
		/**
		 * Create widget
		 * @return $(google.maps.Map)
		 */
		_create: function() {
			this.options.center = $.ui.gmap._unwrapLatLng(this.options.center);
			var a = this.element;
			var b = $.ui.gmap.instances[a.attr('id')] = { map: new google.maps.Map( a[0], this.options ), markers: [], services: [], overlays: [] };
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
			jQuery.extend(this.options, { 'center': map.getCenter(), 'mapTypeId': map.getMapTypeId(), 'zoom': map.getZoom(), /*'heading': map.getHeading(), 'streetView': map.getStreetView(), 'tilt': map.getTilt(), 'bounds': map.getBounds(), 'projection': map.getProjection()*/ } );
			$.ui.gmap._trigger(a);
			map.setOptions(this.options);
		},
		
		/**
		 * Sets the option
		 * @param name:string
		 * @param value:object
		 */
		_setOption: function(a, b) {
			var self = this;
			var c = arguments;
			this._update( function() {
				$.Widget.prototype._setOption.apply(self, c);
			});
		},
		
		/**
		 * Adds a latitude longitude pair to the bounds.
		 * @param position:google.maps.LatLng/string
		 */
		addBounds: function(a) {
			this.get('bounds', new google.maps.LatLngBounds()).extend($.ui.gmap._unwrapLatLng(a));
			this.get('map').fitBounds(this.get('bounds'));
		},
		
		/**
		 * Adds a custom control to the map
		 * @param panel:jquery/node/string	
		 * @param position:google.maps.ControlPosition	 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			this.get('map').controls[b].push($.ui.gmap._unwrap(a));
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
			a.position = (a.position) ? $.ui.gmap._unwrapLatLng(a.position) : null;
			var d = new google.maps.Marker( jQuery.extend({'map': c, 'bounds': false}, a) );
			this.get('markers', []).push(d);
			if ( d.bounds ) {
				this.addBounds(d.getPosition());
			}
			$.ui.gmap._trigger(b, c, d);
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
			$.ui.gmap._trigger(b, c);
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
		 * @param callback:function(status:boolean, marker:google.maps.Marker)
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
				$.ui.gmap._trigger(d, g, e[i]);
			};
		},

		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function(a, b) {
			var c = $.ui.gmap.instances[this.element.attr('id')];
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
			this.get('iw').open(this.get('map'), b); 
		},
				
		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function(a, b) {
			$.ui.gmap.instances[this.element.attr('id')][a] = b;
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
			$.Widget.prototype.destroy.call(this);
			this.clear('markers');
			this.clear('services');
			this.clear('overlays');
			var a = $.ui.gmap.instances[this.element.attr('id')];
			for ( b in a ) {
				a[b] = null;
			}
		}
			
	});

	$.extend($.ui.gmap, {
        
		instances: [],
		
		_trigger: function(a) {
			if ( $.isFunction(a) ) {
				a.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		_unwrapLatLng: function(a) {
			if ( a instanceof google.maps.LatLng ) {
				return a;
			} else {
				var b = a.replace(' ','').split(',');
				return new google.maps.LatLng(b[0], b[1]);
			}
		},
		
		_unwrap: function(a) {
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
