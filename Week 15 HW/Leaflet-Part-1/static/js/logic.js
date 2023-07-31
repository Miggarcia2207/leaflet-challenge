// Initialize the Leaflet map
var map = L.map('map').setView([37.09, -95.71], 2);

// Add the tile layer (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load the earthquake data from the GeoJSON URL
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Loop through the earthquake data and plot markers on the map
    data.features.forEach(feature => {
      var lat = feature.geometry.coordinates[1];
      var lng = feature.geometry.coordinates[0];
      var mag = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];

      // Calculate marker size based on magnitude
      var markerSize = mag * 5;

      // Calculate marker color based on depth (e.g., darker for greater depth)
      var markerColor = 'rgb(' + Math.floor((1 - depth / 100) * 255) + ', 0, 0)';

      // Create the marker with custom size and color
      var marker = L.circleMarker([lat, lng], {
        radius: markerSize,
        fillColor: markerColor,
        fillOpacity: 0.7,
        color: 'black',
        weight: 1
      }).addTo(map);

      // Create a popup with earthquake information
      var popupContent = `
        <strong>Magnitude: </strong>${mag}<br>
        <strong>Depth: </strong>${depth} km<br>
        <strong>Location: </strong>${feature.properties.place}<br>
        <strong>Time: </strong>${new Date(feature.properties.time)}
      `;

      // Bind the popup to the marker
      marker.bindPopup(popupContent);
    });
  });

// Create a legend for marker size and color
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = `
    <strong>Earthquake Magnitude</strong><br>
    <i style="background: red; opacity: 0.7;"></i> 5+<br>
    <i style="background: red; opacity: 0.5;"></i> 4-5<br>
    <i style="background: red; opacity: 0.3;"></i> 3-4<br>
    <i style="background: red; opacity: 0.1;"></i> &lt;3
  `;
  return div;
};
legend.addTo(map);





