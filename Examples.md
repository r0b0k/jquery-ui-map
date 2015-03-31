# Version 2.0 #

## Example constructor call ##

Make the selected element a Google map.

```
$('#map_canvas').gmap();
```

or add some options.

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
    alert('Google map loaded!');
}});
```

## Example addControl ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
    $('#map_canvas').gmap('addControl', 'sidebar', google.maps.ControlPosition.LEFT_TOP);
	// OR $('#map_canvas').gmap('addControl', $('#sidebar'), google.maps.ControlPosition.LEFT_TOP);
	// OR $('#map_canvas').gmap('addControl', document.getElementById('sidebar'), google.maps.ControlPosition.LEFT_TOP);
}});
```

## Example addMarker ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(42.345573,-71.098326) } );
}});
```

## Example addInfoWindow ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('addMarker', { 'bounds':true, 'position': new google.maps.LatLng(42.345573,-71.098326), 'animation': google.maps.Animation.DROP }, function(map, marker){
		$('#map_canvas').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': 'TEXT_AND_HTML_IN_INFOWINDOW' }, function(iw) {
			$(marker).click(function() {
				iw.open(map, marker);
				map.panTo(marker.getPosition());
			});																												  
		});
	});
});
```

## Example add markers with JSON ##

```
$('#map_canvas').gmap({ 'center':new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$.getJSON( 'http://jquery-ui-map.googlecode.com/svn/trunk/demos/json.json', 'category=activity', function(data) { 
		$.each( data.markers, function(i, m) {
			$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(m.lat, m.lng) } );
		});
	});
}});
```

## Example displayDirections ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas_1').gmap('displayDirections', { 'origin': new google.maps.LatLng(42.345573,-71.098326), 'destination': new google.maps.LatLng(42.345573,-72.098326), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(success, result) {
		if ( success )
			alert('Results found!');
	});
}});
```

## Example displayStreetView ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('displayStreetView', 'panel', { 'position': latlng, 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
	// OR $('#map_canvas').gmap('displayStreetView', $('#panel'), { 'position': latlng, 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
	// OR $('#map_canvas').gmap('displayStreetView', document.getElementById('panel'), { 'position': latlng, 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
}});
```

## Example findMarker ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('addMarker', { 'SOME_PROPERTY':'SOME_VALUE', 'position': new google.maps.LatLng(42.345573,-71.098326) });
	$('#map_canvas').gmap('addMarker', { 'SOME_PROPERTY':'OTHER_VALUE', 'position': new google.maps.LatLng(52.345573,-71.098326) });
}});

// filter by the property you just added
$('#map_canvas').gmap('findMarker', 'SOME_PROPERTY', 'SOME_VALUE', function(found, marker) {
	if (found)
		marker.setVisible(true);
	else 
		marker.setVisible(false);
});
```

## Example loadMetadata ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('loadMetadata', 'microformat', 'vevent', function(i, item, data) {
		$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(data.latitude.title, data.longitude.title) });
	});
}});
```

## Example loadKML ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	$('#map_canvas').gmap('loadKML', 'dog_feed_1', 'http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss');
}});
```

## Example using [MarkerClusterer](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/docs/examples.html) ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': function() {
	for ( var i=1; i < 100; i++ ) {
		$('#map_canvas').gmap('addMarker', { position: new google.maps.LatLng(42.345573 + (i/100),-71.098326) } );
	}
}});
var markerCluster = new MarkerClusterer($('#map_canvas').gmap('getMap'), $('#map_canvas').gmap('getMarkers'));
```

## Example search ##

```
$('#map_canvas').gmap('search', { 'address': 'Stockholm' }, function(isFound,results) {
    if (isFound)
		$('#map_canvas').gmap('getMap').panTo(results[0].geometry.location);
});
```

## Example clearMarkers ##

```
$('#map_canvas').gmap('clearMarkers');
```

## Example destroy ##

```
$('#map_canvas').gmap('destroy');
```


## Example get user position ##

Retrieving the clinet position can be accomplished by several ways, i.e. through
  * [Geolocation](https://developer.mozilla.org/en/using_geolocation)
  * [Google loader](http://code.google.com/intl/sv-SE/apis/loader/)
  * [Google gears](http://code.google.com/intl/sv-SE/apis/gears/api_geolocation.html)
  * Web services

This example will show how to implement navigator.geolocation using google loader as a fallback.

First, create a file called jquery.ui.map.extensions.js. Paste this code and save the file,
you should minify the javascript before you use it in production:

```
  /*!
 * jQuery UI Google Map 2.1
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
( function($) {

	$.extend($.ui.gmap.prototype, {
		 
		/**
		 * Gets the current position
		 * @a: function(status, position)
		 * @b:object, see https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDOMGeoPositionOptions
		 */
		getCurrentPosition: function(a, b) {
			if ( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition ( 
					function(position) {
						$.ui.gmap._trigger(a, "OK", position);
					}, 
					function(error) {
						$.ui.gmap._trigger(a, error, null);
					}, 
					b 
				);	
			} else {
				$.ui.gmap._trigger(a, "NOT_SUPPORTED", null);
			}
		}
	
	});
	
} (jQuery) );

```

This code will extend the current jquery.ui.map plugin so that you may use the method "getCurrentPosition"
like any other method in the plugin wrapper.

## Using the extension with jQuery mobile ##

The example assumes that your page div (with ID 'gmap-3') will look like this

```
<div id="gmap-3" data-role="page">
    ...
</div>
```

Add the javascript

```

<script type="text/javascript">

	// When the page show try to get the user's location
	$('#gmap-3').live("pageshow", function() {
		// Set the map to some default center
		$('#map_canvas').gmap({'center': getLatLng()});
		// Try to get the user's position
		$('#map_canvas').gmap('getCurrentPosition', function(status, position) {
			if ( status === 'OK' ) {
				$('#map_canvas').gmap({'center': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)});
				$('#from').val(position.coords.latitude+ ','+position.coords.longitude);
			} else {
				// do some error handling
			}
		});
		
		// Get the google loaders client location
		// If it fails, return some defult value
		function getLatLng() {
			if ( google.loader.ClientLocation != null )
				return new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);	
			return new google.maps.LatLng(59.3426606750, 18.0736160278);
		}
		
	});
	
	// Bind the click event to the  displayDirections function so that 
	// whenever a user clicks on the 'submit' button it will call and show directions
	$('#gmap-3').live("pagecreate", function() {
		$('#submit').click(function() {
			$('#map_canvas').gmap('displayDirections', { 'origin': $('#from').val(), 'destination': $('#to').val(), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(success, response) {
				if ( success ) {
					$('#results').show();
				} else {
					$('#results').hide();
				}
			});
			return false;
		});
	});
</script>

```

Add the html

```

<div>	
	<!-- The map will be loaded here, set width and height in the css to the map_canvas element -->
	<div id="map_canvas" style="height:300px;width:300px;"></div>
	<!-- The javascript will set the from ID -->
	<p style="display:none;">
		<label for="from">From</label>
		<input id="from" type="hidden" class="ui-bar-c" value="" />
	</p>
	<!-- The user will set the 'to' field -->
	<p>
		<label for="to">To</label>
		<input id="to" class="ui-bar-c" value="Stockholm, Sweden" />
	</p>
	<a id="submit" href="#" data-role="button" data-icon="search">Get directions</a>
</div>

<!-- results will ony show if there is a result to show -->
<div id="results" style="display:none;">
	<!-- the directions will be loaded in the directions div -->
	<div id="directions"></div>
</div>

```



# Version 1.2 #

## Example constructor call ##

Make the selected element a Google map.

```
$('#map_canvas').gmap();
```

or add some options.

```
var callback = function() {
    alert('Google map loaded!');
};

$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326), 'callback': callback });
```


## Example addSidebar ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('addSidebar', 'sidebar', google.maps.ControlPosition.LEFT_TOP);
```

## Example addMarker ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(42.345573,-71.098326) } );
```

or with a callback

```
var callback = function(map, marker) {
    alert('Marker with position ' + marker.getPosition().lat() + ', ' + marker.getPosition().lng() + ' added!');
};

$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(42.345573,-71.098326) }, callback );
```

## Example addInfoWindow ##

```

$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });

$('#map_canvas').gmap('addMarker', { 'bounds':true, 'position': new google.maps.LatLng(42.345573,-71.098326), 'animation': google.maps.Animation.DROP }, function(map, marker){
	$('#map_canvas').gmap('addInfoWindow', { 'position':marker.getPosition(), 'content': 'TEXT_AND_HTML_IN_INFOWINDOW' }, function(iw) {
		$(marker).click(function() {
			iw.open(map, marker);
			map.panTo(marker.getPosition());
		});																												  
	});
});

```

## Example loadJSON ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('loadJSON', 'http://localhost/json.php' );
```

or do the parsing yourself in the callback

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('loadJSON', 'http://localhost/json.php', { 'type': 'activities'}, function(i, marker) {
    // Get the properties you want and add them to the map
    // Create the marker options
    var opts = { 'position': new google.maps.LatLng(marker.lat, marker.lng), 'title': marker.title };
    $('#map_canvas').gmap('addMarker', opts);
});
```

## Example loadHTML ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
// Load all elements with the classname "vevent"
$('#map_canvas').gmap('loadHTML', 'microformat', '.vevent');
```

The HTML

```
<p class="vevent">
    <a class="url hidden" href="http://conferences.oreillynet.com/pub/w/40/program.html">http://conferences.oreillynet.com/pub/w/40/program.html</a>
    <span class="summary">Web 2.0 Conference</span> 
    <abbr class="dtstart hidden" title="2005-10-05">October 5</abbr>
    <abbr class="dtend hidden" title="2005-10-07">7</abbr>
    <span class="location hidden">Argent Hotel, San Francisco, CA</span>
    <span class="geo hidden">
        <abbr class="latitude" title="37.7749295">&nbsp;</abbr> 
        <abbr class="longitude" title="-122.4194155">&nbsp;</abbr>
    </span>
</p>
```

or do something yourself

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('loadHTML', 'microformat', 'vevent', function(markerOpts, node) {
    // We have to add a callback in the addmarker method so we can access the marker just added
    $('#map_canvas').gmap('addMarker', markerOpts, function(map, marker) {
        // Find all a elements in this element with the class link 
        $(node).find('.summary').click( function() {
            alert('The a element with class link was clicked!');
            // Trigger a click on the marker
            $(marker).triggerEvent('click');
            // Pan to the position
            map.panTo(marker.position);
            // Return false so that we won't accidentally go to the URL
            return false;
        });					
    });
});
```

## Example loadDirections ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('loadDirections', 'panel', { 'origin': new google.maps.LatLng(42.345573,-71.098326), 'destination': new google.maps.LatLng(42.345573,-72.098326), 'travelMode': google.maps.DirectionsTravelMode.DRIVING} );
```

## Example loadStreetViewPanorama ##

```
var latlng = new google.maps.LatLng(42.345573,-71.098326);
$('#map_canvas').gmap({ 'center': latlng });
var panoramaOptions = { 'position': latlng, 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } };
$('#map_canvas').gmap('loadStreetViewPanorama', 'panel', panoramaOptions);
```

## Example search ##

```
var latlng = new google.maps.LatLng(42.345573,-71.098326);
$('#map_canvas').gmap({ 'center': latlng });
$('#map_canvas').gmap('search', { 'address': 'Stockholm' }, function(results) {
    alert('Found it!');
    // Get the map
    var map = $('#map_canvas').gmap('getMap');
    // Pan to first result
    map.panTo(results[0].geometry.location);
});
```

## Example clearMarkers ##

```
var latlng = new google.maps.LatLng(42.345573,-71.098326);
$('#map_canvas').gmap({ 'center': latlng });
$('#map_canvas').gmap('addMarker', { 'position': latlng });
$('#map_canvas').gmap('clearMarkers');
```

## Example destroy ##

```
$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326) });
$('#map_canvas').gmap('destroy');
```