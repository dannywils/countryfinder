var container = document.getElementById('map-container');
var options = {
	zoom: 2,
	center: new google.maps.LatLng(44.648900999999995, -63.57533499999999),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	panControl: false,
	zoomControl: false,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	overviewMapControl: false,
	scrollwheel: true,
	navigationControl: false,
	mapTypeControl: false,
	scaleControl: true,
	draggable: true,
	styles: [
	{
		featureType: "all",
		elementType: "labels",
		stylers: [
		{ visibility: "off" }
		]
	}
	]
};

var map = new google.maps.Map(container, options);
var geocoder = new google.maps.Geocoder();
