( function($) {
	
	jQuery.fn.extend( {
		
		click: function(callback) { 
			return this.addEventListener('click', callback);
		},
		
		rightclick: function(callback) {
			return this.addEventListener('rightclick', callback);
		},
		
		dblclick: function(callback) {
			return this.addEventListener('dblclick', callback);
		},
		
		mouseover: function(callback) {
			return this.addEventListener('mouseover', callback);
		},
		
		mouseout: function(callback) {
			return this.addEventListener('mouseout', callback);
		},
		
		drag: function(callback) {
			return this.addEventListener('drag', callback );
		},
		
		dragend: function(callback) {
			return this.addEventListener('dragend', callback );
		},
		
		triggerEvent: function(type) {
			google.maps.event.trigger(this.get(0), type);		
		},
		
		addEventListener: function(type, callback) {
			if ( this.get(0) instanceof google.maps.MVCObject ) {
				google.maps.event.addListener(this.get(0), type, callback );
			} else {
				this.bind(type, callback);	
			}
			return this;
		}
		
	});
	var o = {
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
		callback: null
	};
	
	var m = {
		
		_getInstance : function() {
			return $.fn.gmap.instances[$.fn.gmap.id];
		},
		
		init : function( opts ) { 
			$.fn.gmap.instances[$.fn.gmap.id] = { map: new google.maps.Map( this[0], jQuery.extend(o, opts) ), markers: [], iw: new google.maps.InfoWindow(), bounds: null, services: [] };
			$.fn.gmap._trigger(o.callback, m.getMap() );
			return $(m.getMap());
		},
		
		/**
		 * Adds a LatLng to the bounds.
		 */
		addBounds: function(latLng) {
			var instances = m._getInstance();
			if ( !instances.bounds ) {
				instances.bounds = new google.maps.LatLngBounds(); 
			}
			instances.bounds.extend(latLng);
			instances.map.fitBounds(instances.bounds);
		},
		
		/**
		 * Adds a control to the map
		 * @param panel:jQuery/Node/String
		 * @param position:google.maps.ControlPosition, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(panel, position) {
			console.log('addControl');
			m.getMap().controls[position].push($.fn.gmap._unwrap(panel));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param opts:google.maps.MarkerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 * @param callback:function(map:google.maps.Map, marker:Marker)
		 * @return $(google.maps.Marker)
		 */
		addMarker: function(opts, callback) {
			console.log('ADD MARKER');
			var marker = new google.maps.Marker( jQuery.extend( { 'map': m.getMap(), 'bounds':false }, opts) );
			m.getMarkers().push( marker );
			if ( marker.bounds ) {
				m.addBounds(marker.getPosition());
			}
			$.fn.gmap._trigger(callback, m.getMap(), marker );
			return $(marker);
		},
		
		/**
		 * Adds an InfoWindow to the map
		 * @param opts:google.maps.InfoWindowOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 * @param callback:function(InfoWindow:google.maps.InfoWindowOptions)
		 * @return $(google.maps.InfoWindowOptions)
		 */
		addInfoWindow: function(opts, callback) {
			m._getInstance().iw.setOptions(opts);
			$.fn.gmap._trigger(callback, m._getInstance().iw);
			return $(m._getInstance().iw);
		},
		
		/**
		 * Computes directions between two or more places.
		 * @param request:google.maps.DirectionsRequest, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest
		 * @param opts:google.maps.DirectionsRendererOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions
		 * @param callback:function(success:boolean, result:google.maps.DirectionsResult), http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult
		 */
		displayDirections: function(request, opts, callback) { 
			var instance = m._getInstance();
			if ( !instance.services.DirectionsService ) {
				instance.services.DirectionsService = new google.maps.DirectionsService();
			}
			if ( !instance.services.DirectionsRenderer ) {
				instance.services.DirectionsRenderer = new google.maps.DirectionsRenderer(jQuery.extend( { 'map': instance.map }, opts));
			}
			instance.services.DirectionsService.route( request, function(result, status) {
				if ( status === google.maps.DirectionsStatus.OK ) {
					if ( opts.panel ) {
						instance.services.DirectionsRenderer.setDirections(result);
					}
				} else {
					instance.services.DirectionsRenderer.setMap(null);
				}
				$.fn.gmap._trigger(callback, ( status === google.maps.DirectionsStatus.OK ), result);
			});
		},
		
		/**
		 * Displays the panorama for a given LatLng or panorama ID.
		 * @param panel:jQuery/String/Node
		 * @param opts?:google.maps.StreetViewPanoramaOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions
		 */
		displayStreetView: function(panel, opts) {
			if ( !m.getService('StreetViewPanorama') ) {
				m._getInstance().services.StreetViewPanorama = new google.maps.StreetViewPanorama($.ui.gmap._unwrap(panel), opts);
			}
			m._getInstance().map.setStreetView(m._getInstance().services.StreetViewPanorama);
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'airports'
		 * @param property:String - the property to search within
		 * @param value:String - the query
		 * @param callback:function(found:boolean, marker:google.maps.Marker)
		 */
		findMarker : function(property, value, callback) {
			for ( var i = 0; i < m.getMarkers().length; i++ ) {
				$.fn.gmap._trigger(callback, ( m.getMarkers()[i][property] === value ), m.getMarkers()[i]);
			};
		},
		
		/**
		 * Extracts meta data from the HTML
		 * @param type:String - rdfa, microformats or microdata 
		 * @param ns:String - the namespace
		 * @param callback:function(item:jQuery, result:Array<String>)
		 */
		loadMetadata: function(type, ns, callback) { 
			if ( type === 'rdfa' ) {
				$.fn.gmap.rdfa(ns, callback);
			} else if ( type === 'microformat') {
				$.fn.gmap.microformat(ns, callback);
			} else if ( type === 'microdata') {
				$.fn.gmap.microdata(ns, callback);
			}
		},
		
		/**
		 * Adds fusion data to the map.
		 * @param id:Integer - Fusion table ID
		 * @param opts:google.maps.FusionTablesLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions
		 */
		loadFusion: function(id, opts) {
			if ( !m.getService('FusionTablesLayer') ) {
				m._getInstance().services.FusionTablesLayer = new google.maps.FusionTablesLayer(id, opts);
			}
			m._getInstance().services.FusionTablesLayer.setMap(this.getMap());
		},
		
		/**
		 * Adds markers from KML file or GeoRSS feed
		 * @param id:String - an identifier for the RSS e.g. 'rss_dogs'
		 * @param url:String - URL to feed
		 * @param opts:google.maps.KmlLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions
		 */
		loadKML: function(id, url, opts) {
			if ( !m.getService(id) )
				m._getInstance().services[id] = new google.maps.KmlLayer(url, jQuery.extend({'map': m._getInstance().map }, opts)); 
		},
		
		/**
		 * A service for converting between an address and a LatLng.
		 * @param request:google.maps.GeocoderRequest
		 * @param callback:function(success:boolean, result:google.maps.GeocoderResult), http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult
		 */
		search: function(request, callback) {
			if ( !m.getService('Geocoder') )
				m._getInstance().services.Geocoder = new google.maps.Geocoder();
			m._getInstance().services.Geocoder.geocode( request, callback );
		},
		
		/**
		 * Returns the map.
		 * @return google.maps.Map
		 */
		getMap: function() {
			console.log('GET MAP ID: '+$.fn.gmap.id);
			return m._getInstance().map;
		},
		
		/**
		 * Returns all markers.
		 * @return Array<google.maps.Marker>
		 */
		getMarkers: function() {
			return m._getInstance().markers;
		},
		
		/**
		 * Returns a service by its service name
		 * @param id:string
		 */
		getService: function(id) {
			return m._getInstance().services[id];
		},
		
		/**
		 * Clears all the markers and added event listeners.
		 */
		clearMarkers: function() {
			for ( var i = 0; i < m.getMarkers().length; i++ ) {
				google.maps.event.clearInstanceListeners(m.getMarkers()[i]);
				m.getMarkers()[i].setMap(null);
				m.getMarkers()[i] = null;
			};
			m._getInstance().markers = [];
		},
		
		/**
		 * Destroys the plugin.
		 */
		destroy : function() {
			m.clearMarkers();
			google.maps.event.clearInstanceListeners(m.getMap());
			for ( var i = 0; i < m._getInstance().services.length; i++ ) {
				m._getInstance().services[i] = null;
			};
			instances[id] = null;
		}
	};
	
	$.fn.gmap = function(id) {
		
		$.fn.gmap.id = this.attr('id');
		
		if ( m[id] ) {
			return m[id].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof id === 'object' || ! id ) {
			return m.init.apply( this, arguments );
		}  
		
	};
	
	$.extend($.fn.gmap, {
        
		id: null,
		version: "2.0",
		instances: [],
		
		_trigger: function(callback) {
			if ( $.isFunction(callback) ) {
				callback.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		_unwrap: function unwrap(obj) {
			if ( !obj ) {
				return null;
			} else if ( obj instanceof jQuery ) {
				return obj[0];
			} else if ( obj instanceof Object ) {
				return obj;
			}
			return document.getElementById(obj);
		}
			
	});

} (jQuery) );