# Dependencies #

  * jquery.core
  * jquery.ui.core.js
  * jquery.ui.widget.js

> OR

  * jquery.core
  * jquery.mobile

# Overview #

Make the selected element a Google map.

```
$(function() {				
    $('#map_canvas').gmap();
});
```

All properties in the [MapOption](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions) object can be set and retrieved by

```
//getter
var zoom= $('#map_canvas').gmap('option', 'zoom');
//setter
$('#map_canvas').gmap('option', 'zoom', 7);
```

# API version 2.0 #

## Constructor ##

| **Constructor** | **Return value** | **Description** |
|:----------------|:-----------------|:----------------|
| gmap(opts?:[MapOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions)) | $([Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map)) | Creates a new map. MapOptions is extended with an optional callback method, i.e. { 'callback':function() { } }, invoked after the map has been loaded |

## Methods ##

| **Method** | **Return value** | **Description** |
|:-----------|:-----------------|:----------------|
| addBounds([LatLng](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#LatLng)) | none | Adds a bound to the existing boundaries. |
| addControl(panel:jquery/node/string, position:[ControlPosition](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition)) | none | Creates a control from the given div panel on the map. |
| addMarker(opts?:[MarkerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions), callback?:function(map:[Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map), marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker))) | $([Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker))  | Creates a marker on the map. MarkerOptions is extended with a bounds property ('bounds':boolean) to add boundaries  |
| addInfoWindow(opts:[InfoWindowOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions), callback?:function(infowindow:[InfoWindow](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindow))) | $([InfoWindow](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindow)) | Creates an info window bound to the marker on the map. |
| displayDirections(request:[DirectionsRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest), opts:[DirectionsRendererOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions), callback:function(success:boolean, result:[DirectionsResult](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult))) | none | Displays directions on the map and/or in a div panel. |
| displayStreetView(panel:jquery/string/node, opts?:[StreetViewPanoramaOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions)) | none | Displays the panorama for a given LatLng or panorama ID. |
| findMarker (property:string, value:string, callback:function(isFound:boolean, marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker))) | none | Find marker(s) by property |
| loadMetadata(type:string, namespace:string, callback:function(index:int, item:$(node), result:Array.string )) | none | Finds sementic attributes in the selected namespace. Semantic types currently supported: 'rdfa', 'microformat' and 'microdata'. |
| loadKML(uniqueIdentifier:string, url:string, opts?:[KmlLayerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions) ) | none | Adds geographic markup to the map from a KML, KMZ or GeoRSS file that is hosted on a publicly accessible web server. To clear the markers generated from the loadKML method you need to get the service and set the map to null. |
| loadFusion(fusionTableId:string, opts?:[FusionTablesLayerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions)) | none | Adds markers from Fusion table. |
| search(request:[GeocoderRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderRequest), callback:function(success:boolean, result:[GeocoderResult](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult))) | none | Search addresses and latitude/longitude. |
| getMap() | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map) | Returns the map. |
| getMarkers() | Array.[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker) | Returns an array of markers. |
| getService(serviceName:string) | service | Returns a service by name. Supported service names are [DirectionsService](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsService), [Geocoder](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Geocoder), [StreetViewPanorama](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanorama), [Geocoder](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Geocoder), [FusionTablesLayer](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayer). KML Layers and RSS Geofeed services can be fetched by the service identifier which the user set.  |
| clearMarkers() | none | Removes all markers on the map. |
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


# API version 1.2 #

## Constructor ##

| **Constructor** | **Return value** | **Description** |
|:----------------|:-----------------|:----------------|
| gmap(opts?:[MapOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions)) | $([Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map)) | Creates a new map. MapOptions is extended with an optional callback method, i.e. { 'callback':function() { } }, invoked after the map has been loaded |

## Methods ##

| **Methods** | **Return Value** | **Description** |
|:------------|:-----------------|:----------------|
| addBound([LatLng](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#LatLng)) | none | Adds a bound. |
| addSidebar(panel:string/node, position:[ControlPosition](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition)) | none | Creates a control from the given div panel on the map. |
| addMarker(opts:[MarkerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions), callback?:function(map:[map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map,), marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker,))) | $([Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker)) | Creates a marker on the map. |
| addInfoWindow(opts:[InfoWindowOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions), callback?:function(infowindow:[InfoWindow](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindow))) | $([InfoWindow](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindow)) | Creates an info window bound to the marker on the map. |
| loadJSON(url:string, data?:string, callback?:function(iterator:integer, marker:[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker,))) | none | Adds markers to the map through a JSON request. The JSON format must be (["markers":[.md](.md)]). |
| loadHTML(type:string, class:string, callback?:function(markerOptions:[MarkerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions), item:node)) | none | Adds markers to the map by looking for sementic attributes in the selected classes. Semantic types currently supported: 'rdfa', 'microformat' and 'microdata'. |
| loadDirections(panel:string/node, request:[DirectionsRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest), successCallback:function(result), errorCallback:function(status)) | none | Displays directions on the map and/or in a div panel. |
| loadStreetViewPanorama(panel:string, opts?:[StreetViewPanoramaOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions)) | none | Displays the panorama for a given LatLng or panorama ID. |
| loadFusion(id:string, opts?:[FusionTablesLayerOptions](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions)) | none | Adds markers from Fusion table. |
| search(request:[GeocoderRequest](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderRequest), successCallback:function(result:[GeocoderResult](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult)), errorCallback:function([GeocoderStatus](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderStatus))) | none | Search addresses and latitude/longitude. |
| clearMarkers() | none | Clears all markers on the map. |
| getMap() | [Map](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Map,) | Returns the map. |
| getMarkers() | Array.[Marker](http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#Marker,) | Returns an array of markers. |
| destroy() | none | Removes the map functionality. |