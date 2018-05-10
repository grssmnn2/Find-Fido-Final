$(document).ready(function() {
    // Firebase
    var dogData = new Firebase("https://nwuproject1.firebaseio.com/");
    // Event function 
    dogData.on("child_added", function(childSnapshot, prevChildKey) {

        // console.log(childSnapshot.val());

        // assign firebase variables to snapshots.     
        var firebaseLostFound = childSnapshot.val().lostFound;
        var firebaseBreed = childSnapshot.val().breed;
        var firebaseColor = childSnapshot.val().color;
        var firebaseLocation = childSnapshot.val().location;
        var firebaseMissingDate = childSnapshot.val().missingDate;
        var firebaseMissingTime = childSnapshot.val().missingTime;
        var firebaseContactEmail = childSnapshot.val().contactEmail;
        // var firebaseComment = childSnapshot.val().commentInput;


        // Append dog info to table on page
        $("#dogTable > tbody").append("<tr><td>" + firebaseBreed + "</td><td>" + firebaseColor + "</td><td>" + firebaseLocation + "</td><td>" + firebaseMissingDate + "</td><td>" + firebaseMissingTime + "</td><td>" + firebaseContactEmail +  "</td></tr>");

    });
});

    // highlight matching table content
  
    $("#userSearch").on("keyup", function () {
        var value = $(this).val();

        $("table tr").each(function (index) {
            if (index != 0) {

                $row = $(this);

                var id = $row.find("td:first").text();

                if (id.indexOf(value) != 0) {
                    // $(this).css("background", "white");
                    $(this).hide();

                }
                else {
                    $(this).show();
                    // $(this).addClass("highlight");

                }
            }
        });
    })


var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map2'), {
        center: { lat: 41.8781, lng: -87.6298 },
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}