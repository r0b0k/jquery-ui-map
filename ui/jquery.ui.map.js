 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 *
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
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
	
	$.widget( "ui.gmap", {
			
		options: {
			//backgroundColor : null,
			center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
			//disableDefaultUI: false,
			//disableDoubleClickZoom: false,
			//draggable: true,
			//draggableCursor: null,
			//draggingCursor: null,
			//keyboardShortcuts: true,
			//mapTypeControl: true,
			//mapTypeControlOptions: null,
			mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
			//navigationControl: true,
			//navigationControlOptions: null,
			//noClear: false,
			//scaleControl: false,
			//scaleControlOptions: null,
			//scrollwheel: false,
			//streetViewControl: true,
			//streetViewControlOptions: null,
			zoom: 5
		},
		
		_create: function() {
			var a = this.element;
			var b = $.ui.gmap.instances[a.attr('id')] = { map: new google.maps.Map( a[0], this.options ), markers: [], services: [], overlays: [] };
			google.maps.event.addListenerOnce(b.map, 'bounds_changed', function() {
				a.trigger('create', b.map);
			});
			return $(b.map);
		},
		
		/**
		 * Sets the current map options
		 * @param callback:function()
		 */
		_update: function(b) {
			var a = this.get('map');
			jQuery.extend(this.options, { 'center': a.getCenter(), 'mapTypeId': a.getMapTypeId(), 'zoom': a.getZoom(), /*'heading': a.getHeading(), 'streetView': a.getStreetView(), 'tilt': a.getTilt(), 'bounds': a.getBounds(), 'projection': a.getProjection()*/ } );
			$.ui.gmap._trigger(b);
			a.setOptions(this.options);
		},
		
		/**
		 * Sets the option
		 * @param key:String	key
		 * @param value:Object	object
		 */
		_setOption: function(a, b) {
			var self = this;
			var args = arguments;
			this._update( function() {
				$.Widget.prototype._setOption.apply(self, args);
			});
		},
		
		/**
		 * Adds a LatLng to the bounds.
		 * @param latLng:google.maps.LatLng/String 
		 */
		addBounds: function(a) {
			this.get('bounds', new google.maps.LatLngBounds()).extend($.ui.gmap._unwrapLatLng(a));
			this.get('map').fitBounds(this.get('bounds'));
		},
		
		/**
		 * Adds a control to the map
		 * @param panel:jQuery/Node/String
		 * @param position:google.maps.ControlPosition, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			this.get('map').controls[b].push($.ui.gmap._unwrap(a));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param a?:google.maps.MarkerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 * @param b?:function(map:google.maps.Map, marker:Marker)
		 * @return $(google.maps.Marker)
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
		 * @param a:google.maps.InfoWindowOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 * @param b?:function(InfoWindow:google.maps.InfoWindowOptions)
		 * @return $(google.maps.InfoWindowOptions)
		 */
		addInfoWindow: function(a, b) {
			var c = new google.maps.InfoWindow(a);
			$.ui.gmap._trigger(b, c);
			return $(c);
		},
		
		/**
		 * Clears all the markers and added event listeners.
		 */
		clear: function() {
			var a = this.get('markers');
			$.each(a, function(b, c) {
				google.maps.event.clearInstanceListeners(c);
				c.setMap(null);
				c = null;
			});
			this.set('markers', []);
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'airports'
		 * @param key:string - the property/key to search within
		 * @param value:string - the value
		 * @param delimiter:string/boolean - the delimiter if its multi-valued 
		 * @param callback:function(status:boolean, marker:google.maps.Marker)
		 */
		find: function(a, b, c, d) {
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
		 * @param key:String	key
		 * @param ?value:Object	optional object which will be set if it does not exist
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
		 * @param a:google.maps.InfoWindowOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 * @param b:google.maps.Marker
		 */
		openInfoWindow: function(a, b) {
			this.get('iw', new google.maps.InfoWindow).setOptions(a);
			this.get('iw').open(this.get('map'), b); 
		},
				
		/**
		 * Sets an instance property
		 * @param key:String	key
		 * @param value:Object	object
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
			this.clear();
			var a = $.ui.gmap.instances[this.element.attr('id')];
			for ( b in a ) {
				if ( a[b] instanceof google.maps.MVCObject ) {
					google.maps.event.clearInstanceListeners(a[b]);
				}
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
