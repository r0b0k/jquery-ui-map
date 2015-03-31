# Version 3.0-rc #

## Example constructor call ##

Make the selected element a Google map.

```
$('#map_canvas').gmap();
```

[Map options](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions) are added in the constructor or set with the option method

```
$('#map_canvas').gmap({ 'center': '42.345573,-71.098326' });
```

The map options is extended with a callback function which will execute when the Google Map object has been instanciated.

```
$('#map_canvas').gmap({ 'callback': function(map) {
	// The keyword 'this' refers to the plugin object itself. Which means you can execute shorthand code; e.g. this.addMarker({...});  
	// do something
}});
```

When the map is fully initialized (with bounds) it will trigger the 'init' event.

```
$('#map_canvas').gmap().bind('init', function(event, map) { 
	// do something																									  
});
```

All properties in the [MapOption](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions) object can be set and retrieved by

Get the zoom
```
var zoom = $('#map_canvas').gmap('option', 'zoom');
```

Set the zoom
```
$('#map_canvas').gmap('option', 'zoom', 7);
```

## Example add custom control ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('addControl', 'control', google.maps.ControlPosition.LEFT_TOP);																										  
});
```

```
$('#map_canvas').gmap({'callback':function() {
	this.addControl('control', google.maps.ControlPosition.LEFT_TOP);	
}});
```

```
$('#map_canvas').gmap('addControl', 'control', google.maps.ControlPosition.LEFT_TOP);
```

## Example add marker ##

The position can be set with a string representation of a latitude/longitude ('xx.xx,xx.xx') or with a google.maps.LatLng().
If you set the property bounds to true the map will calculate the viewport and zoom automagically, overriding any zoom set in the contructor.
If a property 'id' is added to the addMarker method the marker will be retrievable by it's id with the 'get' method.

```
$('#map_canvas').gmap().bind('init', function(evt, map) { 
	$('#map_canvas').gmap('addMarker', { /*id:'m_1',*/ 'position': '42.345573,-71.098326', 'bounds': true } );																										  
});
```

```
$('#map_canvas').gmap({'callback':function() {
	this.addMarker( { /*id:'m_1',*/ 'position': '42.345573,-71.098326', 'bounds': true } );																										  
}});
```

```
$('#map_canvas').gmap('addMarker', { /*id:'m_1',*/ 'position': '42.345573,-71.098326', 'bounds': true } );
```

## Example InfoWindow ##

Close any open InfoWindow
```
$('#map_canvas').gmap('closeInfoWindow');
```

Showing an InfoWindow on a click event

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('addMarker', { 'position':  '42.345573,-71.098326', 'bounds': true }).click(function() {
		$('#map_canvas').gmap('openInfoWindow', { 'content': 'TEXT_AND_HTML_IN_INFOWINDOW' }, this);
	});                                                                                                                                                                                                                               
});
```

```
$('#map_canvas').gmap({'callback':function() {
	var self = this;
	self.addMarker({ 'position':  '42.345573,-71.098326', 'bounds': true }).click(function() {
		self.openInfoWindow({ 'content': 'TEXT_AND_HTML_IN_INFOWINDOW' }, this);
	});                                                                                                                                                                                                                               
}});
```

```
$('#map_canvas').gmap('addMarker', { 'position':  '42.345573,-71.098326', 'bounds': true }).click(function() {
	$('#map_canvas').gmap('openInfoWindow', { 'content': 'TEXT_AND_HTML_IN_INFOWINDOW' }, this);
});
```

## Example add markers with JSON ##

Example JSON response

```
{"markers":[
	{ "latitude":0.0, "longitude":0.0 }
]}
```

```
$('#map_canvas').gmap().bind('init', function(evt, map) { 
	$.getJSON( 'URL_TO_JSON', function(data) { 
		$.each( data.markers, function(i, m) {
			$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(m.latitude, m.longitude), 'bounds':true } );
		});
	});																											  
});
```

```
$('#map_canvas').gmap({'callback':function() {
	var self = this;
	$.getJSON( 'URL_TO_JSON', function(data) { 
		$.each( data.markers, function(i, m) {
			self.addMarker( { 'position': new google.maps.LatLng(m.latitude, m.longitude), 'bounds':true } );
		});
	});																											  
}});
```

```
$.getJSON( 'URL_TO_JSON', function(data) { 
	$.each( data.markers, function(i, m) {
		$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(m.latitude, m.longitude), 'bounds':true } );
	});
});																											  
```

## Example displayDirections ##

```
$('#map_canvas').gmap().bind('init', function(evt, map) { 
	$('#map_canvas').gmap('displayDirections', { 'origin': 'Los Angeles, USA', 'destination': 'New York, USA', 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('panel') }, function(result, status) {
		if ( status === 'OK' ) {
			alert('Results found!');
		}
	});																											  
});
```

```
$('#map_canvas').gmap({'callback':function() { 
	this.displayDirections({ 'origin': 'Los Angeles, USA', 'destination': 'New York, USA', 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('panel') }, function(result, status) {
		if ( status === 'OK' ) {
			alert('Results found!');
		}
	});																											  
}});
```

```
$('#map_canvas').gmap('displayDirections', { 'origin': 'Los Angeles, USA', 'destination': 'New York, USA', 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('panel') }, function(result, status) {
	if ( status === 'OK' ) {
		alert('Results found!');
	}
});																											  
```

## Example display StreetView ##

```
$('#map_canvas').gmap({'center': '42.345573,-71.098326'}).bind('init', function(evt, map) { 
	$('#map_canvas').gmap('displayStreetView', 'panel', { 'position': map.getCenter(), 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
});
```

```
$('#map_canvas').gmap({'callback':function() {
	this.displayStreetView('panel', { 'position': map.getCenter(), 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
}});
```

```
$('#map_canvas').gmap('displayStreetView', 'panel', { 'position': google.maps.LatLng(42.345573,-71.098326), 'pov': {'heading': 34, 'pitch': 10, 'zoom': 1 } });
```

## Example filter tags, categories, etc with find ##

Find an object by searching a single property with a single value.

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('addMarker', { 'tags':'foo', 'position': '42.345573,-71.098326', 'bounds':true });
	$('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'foo' }, function(marker, isFound) {
		if ( isFound ) {
			marker.setVisible(true);
		} else {
			marker.setVisible(false);
		}
	});
});
```

```
$('#map_canvas').gmap({'callback':function() {
	this.addMarker({ 'tags':'foo', 'position': '42.345573,-71.098326', 'bounds':true });
	this.find('markers', { 'property': 'tags', 'value': 'foo' }, function(marker, isFound) {
		if ( isFound ) {
			marker.setVisible(true);
		} else {
			marker.setVisible(false);
		}
	});
}});
```

```
$('#map_canvas').gmap('addMarker', { 'tags':'foo', 'position': '42.345573,-71.098326', 'bounds':true });
$('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': 'foo' }, function(marker, isFound) {
	if ( isFound ) {
		marker.setVisible(true);
	} else {
		marker.setVisible(false);
	}
});
```

Find an object by searching a single property with multiple values.

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('addMarker', { 'tags':'foo, bar, baz', 'position': '42.345573,-71.098326', 'bounds':true });
	$('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': ['foo', 'bar'], 'operator': 'AND'}, function(marker, isFound) {
		if ( isFound ) {
			marker.setVisible(true);
		} else {
			marker.setVisible(false);
		}
	});
});
```

```
$('#map_canvas').gmap({'callback':function() {
	this.addMarker({ 'tags':'foo, bar, baz', 'position': '42.345573,-71.098326', 'bounds':true });
	this.find('markers', { 'property': 'tags', 'value': ['foo', 'bar'], 'operator': 'AND'}, function(marker, isFound) {
		if ( isFound ) {
			marker.setVisible(true);
		} else {
			marker.setVisible(false);
		}
	});
}});
```

```
$('#map_canvas').gmap('addMarker', { 'tags':'foo, bar, baz', 'position': '42.345573,-71.098326', 'bounds':true });
$('#map_canvas').gmap('find', 'markers', { 'property': 'tags', 'value': ['foo', 'bar'], 'operator': 'AND'}, function(marker, isFound) {
	if ( isFound ) {
		marker.setVisible(true);
	} else {
		marker.setVisible(false);
	}
});
```

## Example RDFa ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('rdfa', 'v:Event', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude;
		var lng = result.location[0].geo[0].longitude;
		$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
});
```

```
$('#map_canvas').gmap({'callback':function() { 
	var self = this;
	self.rdfa('v:Event', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude;
		var lng = result.location[0].geo[0].longitude;
		self.addMarker({ 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
}});
```

```
$('#map_canvas').gmap('rdfa', 'v:Event', function(result, item, index) {
	var lat = result.location[0].geo[0].latitude;
	var lng = result.location[0].geo[0].longitude;
	$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
});
```

## Example Microdata ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('microdata', 'http://data-vocabulary.org/Event', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude;
		var lng = result.location[0].geo[0].longitude;
		$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
});
```

```
$('#map_canvas').gmap({'callback':function() { 
	var self = this;
	self.microdata('http://data-vocabulary.org/Event', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude;
		var lng = result.location[0].geo[0].longitude;
		self.addMarker({ 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
}});
```

```
$('#map_canvas').gmap('microdata', 'http://data-vocabulary.org/Event', function(result, item, index) {
	var lat = result.location[0].geo[0].latitude;
	var lng = result.location[0].geo[0].longitude;
	$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
});
```

## Example Microformat ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('microformat', '.vevent', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude['value-title'];
		var lng = result.location[0].geo[0].longitude['value-title'];
		$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
});
```

```
$('#map_canvas').gmap({'callback':function() { 
	var self = this;
	self.microformat('.vevent', function(result, item, index) {
		var lat = result.location[0].geo[0].latitude['value-title'];
		var lng = result.location[0].geo[0].longitude['value-title'];
		self.addMarker({ 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
	});
}});
```

```
$('#map_canvas').gmap('microformat', '.vevent', function(result, item, index) {
	var lat = result.location[0].geo[0].latitude['value-title'];
	var lng = result.location[0].geo[0].longitude['value-title'];
	$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
});
```

## Example KML/GeoRSS ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('loadKML', 'dog_feed_1', 'http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss');
});
```

```
$('#map_canvas').gmap({'callback':function() {  
	this.loadKML('dog_feed_1', 'http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss');
}});
```

```
$('#map_canvas').gmap('loadKML', 'dog_feed_1', 'http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss');
```

## Example Polygon/Polyline/Rectangle/Circle ##

```
$('#map_canvas').gmap().bind('init', function() { 
	$('#map_canvas').gmap('addShape', 'Circle', { 'strokeColor': "#FF0000", 'strokeOpacity': 0.8, 'strokeWeight': 2, 'fillColor': "#FF0000", 'fillOpacity': 0.35, 'center': new google.maps.LatLng(58.12, 12.01), 'radius': 2000 });
});
```

```
$('#map_canvas').gmap({'callback':function() {  
	$('#map_canvas').gmap('addShape', 'Circle', { 'strokeColor': "#FF0000", 'strokeOpacity': 0.8, 'strokeWeight': 2, 'fillColor': "#FF0000", 'fillOpacity': 0.35, 'center': new google.maps.LatLng(58.12, 12.01), 'radius': 2000 });
}});
```

```
$('#map_canvas').gmap('addShape', 'Circle', { 'strokeColor': "#FF0000", 'strokeOpacity': 0.8, 'strokeWeight': 2, 'fillColor': "#FF0000", 'fillOpacity': 0.35, 'center': new google.maps.LatLng(58.12, 12.01), 'radius': 2000 });
```

## Example using [MarkerClusterer](http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/) or [MarkerClustererPlus](http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/) ##

```
$('#map_canvas').gmap().bind('init', function() { 
	// add markers here ...
	$('#map_canvas').gmap('set', 'MarkerClusterer', new MarkerClusterer($('#map_canvas').gmap('get', 'map'), $('#map_canvas').gmap('get', 'markers')));
});
```

```
$('#map_canvas').gmap({'callback':function() {   
	// add markers here ...
	this.set('MarkerClusterer', new MarkerClusterer(this.get('map'), this.get('markers')));
}});
```

To use any of the MarkerClusterer methods
```
var markerClustererObject = $('#map_canvas').gmap('get', 'MarkerClusterer');
```

## Search ##

```
$('#map_canvas').gmap().bind('init', function() {
	$('#map_canvas').gmap('search', { 'address': 'Stockholm' }, function(results, status) {
		if ( status === 'OK' ) {
			$('#map_canvas').gmap('get', 'map').panTo(results[0].geometry.location);
		}
	});
}});
```

```
$('#map_canvas').gmap({'callback':function() {
	var self = this;
	self.search({ 'address': 'Stockholm' }, function(results, status) {
		if ( status === 'OK' ) {
			self.get('map').panTo(results[0].geometry.location);
		}
	});
}});
```

```
$('#map_canvas').gmap('search', { 'address': 'Stockholm' }, function(results, status) {
    if ( status === 'OK' ) {
		$('#map_canvas').gmap('get', 'map').panTo(results[0].geometry.location);
	}
});
```

## Clear markers ##

```
$('#map_canvas').gmap('clear', 'markers');
```

## Example destroy ##

```
$('#map_canvas').gmap('destroy');
```

## Set/Get ##

You can use the set and get methods to store an object/function

```
$('#map_canvas').gmap('set', 'alert', function() { alert('test'); } );
// Execute
$('#map_canvas').gmap('get', 'alert')();
```

```
$('#map_canvas').gmap('set', 'foo', {'bar':'baz'} } );
// Get
$('#map_canvas').gmap('get', 'foo').bar;
```

You can get an object and set a default value if it doesn't exist
```
$('#map_canvas').gmap('get', 'alert', function() { alert('test'); } )();
```

## inViewport ##
Helper method to check whether or not a markers LatLng is visible in the viewport bounds
```
var isInViewport = $('#map_canvas').gmap('inViewport', $('#map_canvas').gmap('get', 'marker > some_id'));
```

## Get markers, services, and more ##

Get all markers as an array

```
var markers = $('#map_canvas').gmap('get', 'markers');
```

If you call the method addMarkers and set the id property the $('#map\_canvas').gmap('get', 'markers') will return an associative array which means you cannot use .length to count the markers.

Get a marker with the id 'm\_1'

```
var marker = $('#map_canvas').gmap('get', 'markers > m_1');
var marker = $('#map_canvas').gmap('get', 'markers')['m_1'];
var marker = $('#map_canvas').gmap('get', 'markers').m_1;
```

Get the first marker if not using id's

```
var marker = $('#map_canvas').gmap('get', 'markers > 0');
var marker = $('#map_canvas').gmap('get', 'markers')[0];
```

Get all services

```
$('#map_canvas').gmap('get', 'services');
```

Get a specific service implementation

```
$('#map_canvas').gmap('get', 'services > GeoCoder');
$('#map_canvas').gmap('get', 'services')['GeoCoder'];
$('#map_canvas').gmap('get', 'services').GeoCoder;
```

Get all overlays

```
$('#map_canvas').gmap('get', 'overlays');
```

Get a specific overlay implementation, see the loadKML example

```
$('#map_canvas').gmap('get', 'overlays > dog_feed_1');
$('#map_canvas').gmap('get', 'overlays')['dog_feed_1'];
$('#map_canvas').gmap('get', 'overlays').dog_feed_1;
```

Polygons/Circles/etc are stored in an array

```
var arrayOfPolygons = $('#map_canvas').gmap('get', 'overlays > Polygon');
```

Get bounds set by the addMarker property, not the map.bounds

```
$('#map_canvas').gmap('get', 'bounds');
```

Clear bounds set by the addMarker property, not the map.bounds

```
$('#map_canvas').gmap('set', 'bounds', null);
```

## Rendering issues with e.g. mobile or UI tabs? ##

Most often calling refresh will fix rendering issues, such as when the map is being positioned in the top left corner and not fully visible.

```
$('#map_canvas').gmap('refresh');
```