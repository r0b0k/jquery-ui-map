/*
 * jQuery UI Map 0.1
 *
 * Author: Johan Säll Larsson
 *
 * Depends:
 *      jquery.ui.core.js
 *      jquery.ui.widget.js
 */

( function($) {
		
	var map, markers = [];

	$.widget( "ui.map", {
			
			options: {
				fallbackInitialLatLon: new google.maps.LatLng(0.0, 0.0),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				autoDetectGeoLocation: true, 
				language: 'en',
				region: 'us',
				zoom: 5
			},
			
			_create: function() {
				map = new google.maps.Map( document.getElementById(this.element.attr('id')), this.options );
				map.setCenter(this.options.fallbackInitialLatLon);
				this._initializeGeoPositioning();
			},
			
			_initializeGeoPositioning: function() {
				var self = this;
				if ( this.options.autoDetectGeoLocation ) {
					if ( navigator.geolocation ) {
						navigator.geolocation.getCurrentPosition ( 
							function(position) {
								map.setCenter( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) );
							}, 
							function(error) {
								if ( error.code == error.TIMEOUT ) {
									self._initializeGeoPositioning();
								} else {
									// TODO: fix this, and remove reminder
									// alert('Fix this in a later version! :)');
								}
							}, 
							{ maximumAge :600000 } 
						);
					} else {
						// TODO: either display dialog or let user do whatever here
					}
				}
			},
			
			addSidebar: function(_element, _position) {
				function getPosition (position) {
					switch ( position ) {
						case 'tl':
							return google.maps.ControlPosition.TOP_LEFT;
						case 'tc':
							return google.maps.ControlPosition.TOP_CENTER;
						case 'tr':
							return google.maps.ControlPosition.TOP_RIGHT;
						case 'bl':
							return google.maps.ControlPosition.BOTTOM_LEFT;
						case 'bc':
							return google.maps.ControlPosition.BOTTOM_CENTER;
						case 'br':
							return google.maps.ControlPosition.BOTTOM_LEFT;
						case 'lt':
							return google.maps.ControlPosition.LEFT_TOP;
						case 'lc':
							return google.maps.ControlPosition.LEFT_CENTER;
						case 'lb':
							return google.maps.ControlPosition.LEFT_BOTTOM;
						case 'rt':
							return google.maps.ControlPosition.RIGHT_TOP;
						case 'rc':
							return google.maps.ControlPosition.RIGHT_CENTER;
						case 'rb':
							return google.maps.ControlPosition.RIGHT_BOTTOM;
					}
				}
				map.controls[getPosition(_position.toLowerCase())].push(document.getElementById(_element));
			},
			
			addMarker: function( _latitude, _longitude, _options ) {
				
				var options = _options || {};
				options = jQuery.extend( { map: map, position: new google.maps.LatLng(_latitude, _longitude) }, options);
				
				if ( options.link != null ) {
					options.clickable = true;
					options.title = options.link.html();
				}
				
				var marker = new google.maps.Marker( options );
				
				if ( options.link != null ) {
					var infowindow = new google.maps.InfoWindow({ content: options.title });
					options.link.click( function() {
						google.maps.event.trigger(marker, 'click');
						map.setCenter(marker.position);
						return false;
					});
					google.maps.event.addListener(marker, "click", function() { 
    					infowindow.open(map,marker);
					});
				}
				
				markers.push( marker );
				
			},
			
			loadJSON: function( _url, _data ) {
				var self = this;
				$.getJSON( _url, _data, function(data) { 
					$.each( data.markers, function(i, marker) {
						self.addMarker(marker.lat, marker.lng, { title: marker.title });
					});
				});
			},
			
			loadHTML: function ( _className, _schema ) {
				var self = this;
				switch ( _schema ) {
					case 'rdfa':
						$('.'+_className).each( function() {
							var latlng = ($(this).attr("content")).split(',');
							self.addMarker( latlng[0], latlng[1], { link: $(this).find('a') });
						});
					break;
					case 'microformat':
						$('.'+_className).each( function() {
							self.addMarker( $(this).find('.latitude').attr('title'), $(this).find('.longitude').attr('title'), { link: $(this).find('a') } );
						});
					break;
					case 'microdata':
						$('.'+_className).each( function() {
							var link = $(this).find('a');
							$(this).children().each( function() {
								if ( $(this).attr('itemprop') == 'geo' ) {
									var latlng = $(this).html().split(';');
									self.addMarker(latlng[0], latlng[1], { link: link } );
								}
							});
						});
					break;
				}
			},
			
			loadDirections: function(_origin, _destination, _travelMode, _directionId) { 
				var directionsDisplay = new google.maps.DirectionsRenderer({ map: map, panel: document.getElementById(_directionId)});
				var directionsService = new google.maps.DirectionsService();
				directionsService.route( { origin:_origin, destination:_destination, travelMode: _travelMode, provideRouteAlternatives : true, region: this.options.region } , function(response, status) {
					if ( status == google.maps.DirectionsStatus.OK ) {
						directionsDisplay.setDirections(response);
					} else {
						alert('Couldnt find directions, ' + status );
					}
				});
			},
			
			clearMarkers: function() {
				for ( var i = 0; i < markers.length; i++ ) {
					markers[i].setMap( null );
				}
				markers = new Array();
			},
			
			destroy: function() {
				$.Widget.prototype.destroy.call( this );
			}
			
	});

} (jQuery) );