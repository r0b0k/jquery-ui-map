#jquery ui map v3. Tutorial

# Beginner #

Add the mandatory JavaScript libraries to your HTML HEAD tag.
If you are developing a web site for mobile content add:

```
<script src="http://maps.google.com/maps/api/js?sensor=true" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js" type="text/javascript"></script>
<script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js" type="text/javascript" ></script>
<script src="PATH_TO_PLUGIN/jquery.ui.map.full.min.js" type="text/javascript"></script>
```

If you are developing a web site without any mobile device support add:

```
<script src="http://maps.google.com/maps/api/js?sensor=true" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js" type="text/javascript"></script>
<script src="PATH_TO_PLUGIN/jquery.ui.map.full.min.js" type="text/javascript"></script>
```

To add a map just add

```
<script type="text/javascript">
	$(function() {
		// Also works with: var yourStartLatLng = '59.3426606750, 18.0736160278';
		var yourStartLatLng = new google.maps.LatLng(59.3426606750, 18.0736160278);
		$('#map_canvas').gmap({'center': yourStartLatLng});
	});
</script>
```

and add a DIV tag within the BODY section of your HTML document

```
<div id="map_canvas" style="width:250px;height:250px"></div>
```

[View boiler plate template ](http://jquery-ui-map.googlecode.com/svn/trunk/demos/google-maps-mobile-boilerplate.html) or [view boiler plate template source](http://code.google.com/p/jquery-ui-map/source/browse/trunk/demos/google-maps-mobile-boilerplate.html)

### Help, my map is rendered incorrectly! (jQM) ###
If you use Ajax the map can unfortunately render incorrect. To prevent this you can:

  * Refresh the map

```
<script type="text/javascript">
	$('#page_id').live("pageshow", function() {
		$('#map_canvas').gmap('refresh');
	});
	$('#page_id').live("pageinit", function() {
		$('#map_canvas').gmap({'center': '59.3426606750, 18.0736160278'});
	});
</script>
```

  * Show the map in the pageshow event

```
<script type="text/javascript">
	$('#page_id').live("pageshow", function() {
		$('#map_canvas').gmap({'center': '59.3426606750, 18.0736160278'});
	});
</script>
```

  * Not use Ajax

```
<script type="text/javascript">
	$.mobile.ajaxEnabled = false;
</script>
```

or

```
<a data-ajax="false" href="/map.html">Go to my map</a>
```


# Advanced #

In v3 the plugin has been split up into 4 JavaScript files to better reflect the Google maps v.3 API:

### jquery.ui.map ###
Used when you need minimal map features e.g. adding a marker to a map, loading markers from JSON.

### jquery.ui.map.overlays ###

Used for KML and GeoRSS Layers and Fusion Table Layers,
see http://code.google.com/apis/maps/documentation/javascript/overlays.html

### jquery.ui.map.services ###

Used for Directions, Distance Matrix, Elevation, Geocoding, Places and
Street View, see http://code.google.com/apis/maps/documentation/javascript/services.html

### jquery.ui.map.extensions ###

Used for your extensions and modifications of existing methods

This is how you create a new method in the extension file

```
( function($) {

	$.extend($.ui.gmap.prototype, {
		
		theBeatles : function() {
			alert('Helter skelter');
		},
		
		alertSomething: function(a) {
			alert(a);
		}
		
	});
	
} (jQuery) );
```

If you would like to modify existing methods you can do that too. Let's say you would like to modify the addMarker method to only use [MarkerWithLabel](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/docs/reference.html) this is how you would do it:

```
( function($) {

	$.extend($.ui.gmap.prototype, {
	
		// We override the addMarker method
		addMarker: function(markerOptions, callback) {
			var marker = new google.maps.MarkerWithLabel( jQuery.extend({'map': this.get('map'), 'bounds': false}, markerOptions) );
			var markers = this.get('markers');
			if ( marker.id ) {
				markers[marker.id] = marker;
			} else {
				markers.push(marker);
			}
			if ( marker.bounds ) {
				this.addBounds(marker.getPosition());
			}
			this._call(callback, this.get('map'), marker);
			return $(marker);
		}
		
	});
	
} (jQuery) );
```

However to use the MarkerWithLabel you just need to add a the property 'marker' in the addMarker method (That goes for any extended google.maps.Marker)

```
$('#map_canvas').gmap('addMarker', { 'position': '58.3426606750, 18.0736160278', 'marker': MarkerWithLabel }, function() {});
```

Or do something during the widget initialization. This will geocode the address option property and call the option callback property.

```
( function($) {

	$.extend($.ui.gmap.prototype, {
	
		// This fires after the widgets create method
		_init: function() {
			var self = this;
			// If you add the property option address in the constructor it will be geocoded 
			if ( this.options.address && this.options.callback ) {
				this.search({'address': this.options.address}, function(results, status) {
					if ( status === 'OK' ) {
						self._call(self.options.callback, results, status);
					}
				});
			}
		}
			
	});
        
} (jQuery) );
```

Create an autocomplete function with Google Gecoder. This example requires jQuery UI.

```
( function($) {

	$.extend($.ui.gmap.prototype, {
	
		/**
		 * Autocomplete using Google Geocoder
		 * @param panel:string/node/jquery
		 * @param callback:function(ui) called whenever something is selected
		 */
		autocomplete: function(panel, callback) {
			var self = this;
			$(this._unwrap(panel)).autocomplete({
				source: function( request, response ) {
					self.search({'address':request.term}, function(results, status) {
						if ( status === 'OK' ) {
							response( $.map( results, function(item) {
								return { label: item.formatted_address, value: item.formatted_address, position: item.geometry.location }
							}));
						}
					});
				},
				minLength: 3,
				select: function(event, ui) { 
					self._call(callback, ui);
				},
				open: function() { $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" ); },
				close: function() { $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" ); }
			});
		}
	
	});
	
} (jQuery) );
```

Call the autocomplete like this

```
$('#map_canvas').gmap('autocomplete', 'locality', function(ui) {
	// ui.item.position <-- selected position (google.maps.LatLng)
});
```

Remember to have an input element with id 'locality'
```
<input id="locality" type="text" />
```