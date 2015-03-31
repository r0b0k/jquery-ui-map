# Dependencies #

  * jquery.core

# API version 3.0-rc #

## jquery.ui.map core ##

### Constructor ###

| **Constructor** | **Return value** | **Description** |
|:----------------|:-----------------|:----------------|
| gmap(opts?:[MapOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions)) | none | Creates a new map. MapOptions is extended with an optional callback method, i.e. { 'callback':function() { } }, invoked after the map has been loaded |

### Methods ###

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| addBounds([LatLng](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#LatLng)) | none | Adds a bound to the existing boundaries. |
| addControl(panel:jquery/node/string, position:[ControlPosition](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition)) | none | Creates a control from the given div panel on the map. |
| addMarker(opts?:[MarkerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions), callback?:function(map:[Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker))) | $([Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker))  | Creates a marker on the map. MarkerOptions is extended with a bounds property ('bounds':boolean) to add boundaries  |
| find (type:string, object:{property/value/operator}, callback:function(object:object,isFound:boolean)) | none | Find e.g. marker(s) by property. The value can be either an array or a string. The operator can be either 'AND' or 'OR', default is 'OR' meaning that if one value in an array is enough to fulfill the condition |
| inViewport(marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker)) | boolean | If a markers LatLng is visible in the viewport |
| get(name:string, obj?:object) | object | Returns object by name. The optional obj parameter is set if the name does not exist.  |
| set(name:string, obj:object) | object | Stores an object by name |
| openInfoWindow(opts:[InfoWindowOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions), marker?:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker)) | none | Opens an info window bound to the marker on the map. |
| closeInfoWindow() | none | Closes any open info windows. |
| refresh | none | Refreshes the map (triggers a resize)  |
| clear(name:string) | none | Removes a property list by name, e.g. markers, services, overlays  |
| destroy() | none | Removes the map functionality. |

## Events ##

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| triggerEvent(type:string) | none | Trigger an event, e.g. 'resize'. |
| addEventListener(type:string, callback:function()) | none | Adds a Google event listener or binds a jQuery event|

| **Event** | **Description** | **Supported elements** |
|:----------|:----------------|:-----------------------|
| click | Adds a click event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| rightclick | Adds a right click event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| dblclick | Adds a double click event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| mouseover | Adds a mouse over event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| mouseout | Adds a mouse out event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| drag | Adds a drag event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|
| dragend | Adds a drag end event. | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), [Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#marker)|

## jquery.ui.map overlays ##

### Methods ###

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| addShape(shape:string, opts:[PolylineOptions](http://code.google.com/apis/maps/documentation/javascript/reference.html#PolylineOptions)/[PolygonOptions](http://code.google.com/apis/maps/documentation/javascript/reference.html#PolygonOptions)/[CircleOptions](http://code.google.com/apis/maps/documentation/javascript/reference.html#CircleOptions)) | $(shape) | Adds an overlay, depending on the shape: 'Polygon', 'Polyline', 'Rectangle', 'Circle'. |
| loadKML(uniqueIdentifier:string, url:string, opts?:[KmlLayerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions) ) | none | Adds geographic markup to the map from a KML, KMZ or GeoRSS file that is hosted on a publicly accessible web server. To clear the markers generated from the loadKML method you need to get the service and set the map to null. |
| loadFusion(opts:[FusionTablesLayerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions)) | none | Adds markers from Fusion table. |

## jquery.ui.map services ##

### Methods ###

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| displayDirections(request:[DirectionsRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest), opts:[DirectionsRendererOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions), callback:function(result:[DirectionsResult](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult), [DirectionsStatus](http://code.google.com/apis/maps/documentation/javascript/reference.html#DirectionsStatus))) | none | Displays directions on the map and/or in a div panel. |
| displayStreetView(panel:jquery/string/node, opts?:[StreetViewPanoramaOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions)) | none | Displays the panorama for a given LatLng or panorama ID. |
| search(request:[GeocoderRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderRequest), callback:function(result:[GeocoderResult](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult), status:[GeocoderStatus](http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderStatus))) | none | Search addresses and latitude/longitude. |

## jquery.ui.map rdfa/microformat/microdata ##

### Methods ###

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| rdfa(namespace:string, callback:function(object:object, item:$(node), index:int)) | none | Iterates through selected RDFa. |
| microdata(namespace:string, callback:function(object:object, item:$(node), index:int)) | none | Iterates through selected microdata. |
| microformat(namespace:string, callback:function(object:object, item:$(node), index:int)) | none | Iterates through selected microformat. |

## jquery.ui.extensions ##

This is were you put your own extensions.