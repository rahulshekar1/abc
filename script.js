
mapboxgl.accessToken = 'pk.eyJ1IjoicmFodWxzaGVrYXIzNiIsImEiOiJjbGkwN2V2bzQwMWFqM2VxdHN0d2JqYmNjIn0.80D19gZMovIsTUul0dxRfg';

const params = document.getElementById('params');

// Create variables to use in getIso()
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
let lon = 76.643372;
let lat = 12.321219;
let profile = 'walking';
let minutes = 10;
let colour = "ff0000";
// Set up a marker that you can use to show the query's coordinates
const marker = new mapboxgl.Marker({
'color': '#314ccd',
'draggable': true
});

// Create a function to update the marker's coordinates and trigger the isochrone generation
function updateMarker() {
const lngLat = marker.getLngLat();
lon = lngLat.lng;
lat = lngLat.lat;
getIso();
}

// Create a function that sets up the Isochrone API query then makes a fetch call
async function getIso() {
const query = await fetch(
`${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
{ method: 'GET' }
);
const data = await query.json();
// Set the 'iso' source's data to what's returned by the API quecry
map.getSource('iso').setData(data);
sortByDistance({ lng: lon, lat: lat });
}

// When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', (event) => {
console.log(event.target.value);
if (event.target.name === 'profile') {
profile = event.target.value;
} else if (event.target.name === 'duration') {
minutes = event.target.value;
}
getIso();
});

map.on('load', () => {
// When the map loads, add the source and layer
map.addSource('iso', {
type: 'geojson',
data: {
'type': 'FeatureCollection',
'features': []
}
});

map.addLayer(
{
'id': 'isoLayer',
'type': 'fill',
'source': 'iso',
'layout': {},
'paint': {
'fill-color': '#5a3fc0',
'fill-opacity': 0.3
}
},
'poi-label'
);

// Initialize the marker at the query coordinates
marker.setLngLat({ lng: lon, lat: lat }).addTo(map);

// Update the marker and isochrone when the marker is dragged
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition((position) => {
// Update the marker's position to the user's location
lon = position.coords.longitude;
lat = position.coords.latitude;
marker.setLngLat({ lng: lon, lat: lat }).addTo(map);
// map.setCenter([lon, lat]);
getIso();
});
}

// Update the marker and isochrone when the marker is dragged
marker.on('dragend', updateMarker);

// Make the initial API call
getIso();
});
map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );
    // map.addControl(
    //     new MapboxDirections({
    //     accessToken: mapboxgl.accessToken
    //     }),
    //     'bottom-right'
    //     );

        