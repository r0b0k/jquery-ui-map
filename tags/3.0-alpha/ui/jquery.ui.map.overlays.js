( function($) {

	$.extend($.ui.gmap.prototype, {
		
		/**
		 * Adds fusion data to the map.
		 * @param a:google.maps.FusionTablesLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions
		 */
		loadFusion: function(a) {
			if ( !this.getOverlay('FusionTablesLayer') )
				this.setOverlay('FusionTablesLayer', new google.maps.FusionTablesLayer());
			this.getOverlay('FusionTablesLayer').setOptions(jQuery.extend({'map': this.getMap() }, a));
		},
		
		/**
		 * Adds markers from KML file or GeoRSS feed
		 * @param a:String - an identifier for the RSS e.g. 'rss_dogs'
		 * @param b:String - URL to feed
		 * @param c:google.maps.KmlLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions
		 */
		loadKML: function(a, b, c) {
			// KmlLayer has no setOptions method (?)
			// if ( !this.getOverlay(a) )
				this.setOverlay(a, new google.maps.KmlLayer(b, jQuery.extend({'map': this.getMap()}, c))); 
		},
		
		/**
		 * A layer that displays data from Panoramio.
		 * @param a:google.maps.panoramio.PanoramioLayerOptions, http://code.google.com/apis/maps/documentation/javascript/reference.html#PanoramioLayerOptions
		 */
		loadPanoramio: function(a) {
			if ( !this.getOverlay('PanoramioLayer') )
				this.setOverlay('PanoramioLayer', new google.maps.panoramio.PanoramioLayer());
			this.getOverlay('PanoramioLayer').setOptions(jQuery.extend({'map': this.getMap() }, a));
		},
		
		/**
		 * Returns an overlay by it's name
		 * @param a:string
		 */
		getOverlay: function(a) {
			return $.ui.gmap.instances[this.element.attr('id')].overlays[a];
		},
		
		/**
		 * Sets an overlay
		 * @param a:string
		 * @param b:object
		 */
		setOverlay: function(a, b) {
			$.ui.gmap.instances[this.element.attr('id')].overlays[a] = b;
		}
	
	});
	
} (jQuery) );