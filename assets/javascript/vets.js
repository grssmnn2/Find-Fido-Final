$(document).ready(function() {
    // type_holder
    // <div><label><input type="checkbox" class="types" value="mosque" />Mosque</label></div>

    var types = ['veterinary_care'];
    var html = '';

    $.each(types, function(index, value) {
        var name = value.replace(/_/g, " ");
        html += '<div><label><input type="checkbox" class="types" value="' + value + '" />' + capitalizeFirstLetter(name) + '</label></div>';
    });

    $('#type_holder').html(html);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var map;
var infowindow;
var autocomplete;
var countryRestrict = { 'country': 'in' };
var selectedTypes = [];

function initialize() {
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), {
        types: ['(regions)'],
        // componentRestrictions: countryRestrict
    });

    var pyrmont = new google.maps.LatLng(41.8781, -87.6298);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 9
    });
}

function renderMap() {
    // Get the user defined values
    var address = document.getElementById('address').value;
    var radius = parseInt(document.getElementById('radius').value) * 1000;

    // get the selected type
    selectedTypes = ["veterinary_care"];
    $('.types').each(function() {
        if ($(this).is(':checked')) {
            selectedTypes.push($(this).val());
        }
    });

    var geocoder = new google.maps.Geocoder();
    var selLocLat = 0;
    var selLocLng = 0;

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            //console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

            selLocLat = results[0].geometry.location.lat();
            selLocLng = results[0].geometry.location.lng();

            //var pyrmont = new google.maps.LatLng(52.5666644, 4.7333304);

            var pyrmont = new google.maps.LatLng(selLocLat, selLocLng);

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 13
            });

            //console.log(selectedTypes);

            var request = {
                location: pyrmont,
                //radius: 5000,
                //types: ["atm"]
                radius: radius,
                types: selectedTypes
            };

            infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], results[i].icon);
        }
    }
}

function createMarker(place, icon) {
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: icon,
            scaledSize: new google.maps.Size(20, 20) // pixels
        },
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name + '<br>' + place.vicinity);
        infowindow.open(map, this);
    });
}