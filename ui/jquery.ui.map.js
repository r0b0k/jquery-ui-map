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
			backgroundColor : null,
			center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
			disableDefaultUI: false,
			disableDoubleClickZoom: false,
			draggable: true,
			draggableCursor: null,
			draggingCursor: null,
			keyboardShortcuts: true,
			mapTypeControl: true,
			mapTypeControlOptions: null,
			mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
			navigationControl: true,
			navigationControlOptions: null,
			noClear: false,
			scaleControl: false,
			scaleControlOptions: null,
			scrollwheel: false,
			streetViewControl: true,
			streetViewControlOptions: null,
			zoom: 5,
			callback: null
		},
		
		_create: function() {
			$.ui.gmap.instances[this.element.attr('id')] = { map: new google.maps.Map( this.element[0], this.options ), markers: [], bounds: null, iw: null, services: [], overlays: [] };
			return $(this.getMap());
		},
		
		_init: function() {
			$.ui.gmap._trigger(this.options.callback, this.getMap() );
		},
		
		// todo get all map options and extend options before set options and before trigger resize, create function for this
		_setOption: function(a, b) {
			var map = this.getMap();
			this.options.center = map.getCenter();
			this.options.mapTypeId = map.getMapTypeId();
			this.options.zoom = map.getZoom();
			$.Widget.prototype._setOption.apply(this, arguments);
			map.setOptions(this.options);
		},
		
		/**
		 * Adds a LatLng to the bounds.
		 * @param a:google.maps.LatLng 
		 */
		addBounds: function(a) {
			var instances = $.ui.gmap.instances[this.element.attr('id')];
			if ( !instances.bounds ) {
				instances.bounds = new google.maps.LatLngBounds(); 
			}
			instances.bounds.extend(a);
			instances.map.fitBounds(instances.bounds);
		},
		
		/**
		 * Adds a control to the map
		 * @param a:jQuery/Node/String
		 * @param b:google.maps.ControlPosition, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			this.getMap().controls[b].push($.ui.gmap._unwrap(a));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param a?:google.maps.MarkerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 * @param b?:function(map:google.maps.Map, marker:Marker)
		 * @return $(google.maps.Marker)
		 */
		addMarker: function(a, b) {
			var marker = new google.maps.Marker( jQuery.extend({'map': this.getMap(), 'bounds':false}, a) );
			this.getMarkers().push( marker );
			if ( marker.bounds ) {
				this.addBounds(marker.getPosition());
			}
			$.ui.gmap._trigger(b, this.getMap(), marker );
			return $(marker);
		},
		
		/**
		 * Adds an InfoWindow to the map
		 * @param a:google.maps.InfoWindowOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 * @param b?:function(InfoWindow:google.maps.InfoWindowOptions)
		 * @return $(google.maps.InfoWindowOptions)
		 */
		addInfoWindow: function(a, b) {
			if ( !this.getInfoWindow() )
				this.setInfoWindow(new google.maps.InfoWindow());
			//this.getInfoWindow().setOptions(a);
			$.ui.gmap._trigger(b, this.getInfoWindow().setOptions(a));
			return $(this.getInfoWindow());
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'airports'
		 * @param a:String - the property to search within
		 * @param b:String - the query
		 * @param c:function(found:boolean, marker:google.maps.Marker)
		 */
		findMarker : function(a, b, c) {
			$.each( this.getMarkers(), function(d, e) {
				$.ui.gmap._trigger(c, ( e[a] === b ), e);
			});
		},
		
		/**
		 * Returns the map.
		 * @return google.maps.Map
		 */
		getMap: function() {
			return $.ui.gmap.instances[this.element.attr('id')].map;
		},
		
		/**
		 * Returns all markers.
		 * @return Array<google.maps.Marker>
		 */
		getMarkers: function() {
			return $.ui.gmap.instances[this.element.attr('id')].markers;
		},
		
		/**
		 * Returns the info window.
		 * @return google.maps.InfoWindow
		 */
		getInfoWindow: function() {
			return $.ui.gmap.instances[this.element.attr('id')].iw;
		},
		
		/**
		 * Sets the info window.
		 * @param a:google.maps.InfoWindow
		 */
		setInfoWindow: function(a) {
			$.ui.gmap.instances[this.element.attr('id')].iw = a;
		},
		
		/**
		 * Clears all the markers and added event listeners.
		 * @param a:boolean, if true the method will hide the markers
		 */
		clearMarkers: function(a) {
			$.each( this.getMarkers(), function(b,c) {
				if (!a) {
					google.maps.event.clearInstanceListeners(c);
					c.setMap(null);
					c = null;
				} else {
					c.setVisible(false);
				}
			});
			if (!a)
				$.ui.gmap.instances[this.element.attr('id')].markers = [];
		},
		
		/**
		 * Refreshes the map
		 */
		refresh: function() {
			var instances = $.ui.gmap.instances[this.element.attr('id')];
			$(instances.map).triggerEvent('resize');
			instances.map.setOptions(this.options);
			if ( instances.bounds )
				instances.map.fitBounds(instances.bounds);
		},
		
		// clear Bounds
		
		/**
		 * Destroys the plugin.
		 */
		destroy: function() {
			this.clearMarkers();
			google.maps.event.clearInstanceListeners(this.getMap());
			$.each($.ui.gmap.instances[this.element.attr('id')].services, function (a, b) {
				b = null;
			});
			$.Widget.prototype.destroy.call( this );
		}
			
	});

	$.extend($.ui.gmap, {
        
		version: "2.0",
		instances: [],
		
		_trigger: function(a) {
			if ( $.isFunction(a) ) {
				a.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		_unwrap: function unwrap(a) {
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
			google.maps.event.trigger(this.get(0), a);		
		},
		
		addEventListener: function(a, b) {
			if ( google.maps && this.get(0) instanceof google.maps.MVCObject ) {
				google.maps.event.addListener(this.get(0), a, b );
			} else {
				this.bind(a, b);	
			}
			return this;
		}
		
	});

} (jQuery) );
