<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/x-javascript');

$json = array (
	
	"markers" => array (
		array( "lat" => 57.7973333, "lng" => 12.0502107, "title" => "Angered" ),
		array( "lat" => 57.6969943, "lng" => 11.9865, "title" => "Gothenburg" )
	)

);

echo json_encode($json);


?>
