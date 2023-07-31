// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a base map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add overlays for earthquakes and tectonic plates
var earthquakeLayer = L.layerGroup();
var tectonicPlatesLayer = L.layerGroup();

// Function to create earthquake markers with popups
function createEarthquakeMarker(feature, latlng) {
  var marker = L.circleMarker(latlng, {
    radius: Math.sqrt(feature.properties.mag) * 5, // Adjust the earthquake marker size based on magnitude
    fillColor: getColor(feature.geometry.coordinates[2]), // Get color based on depth
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  });

  marker.bindPopup(`<b>Magnitude: ${feature.properties.mag}</b><br>Depth: ${feature.geometry.coordinates[2]} km<br>Location: ${feature.properties.place}`);
  return marker;
}

// Function to get color based on depth
function getColor(depth) {
  return depth > 100 ? "#800026" :
         depth > 70 ? "#BD0026" :
         depth > 50 ? "#E31A1C" :
         depth > 30 ? "#FC4E2A" :
         depth > 10 ? "#FD8D3C" :
                      "#FEB24C";
}

// Function to add tectonic plates layer to the map
function addTectonicPlatesLayer() {
  fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: "#800080", // Set the color of tectonic plate lines
          weight: 2 // Set the weight of tectonic plate lines
        }
      }).addTo(tectonicPlatesLayer);
      tectonicPlatesLayer.addTo(map);
    });
}

// Function to add earthquake data to the map
function addEarthquakeData() {
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: createEarthquakeMarker
      }).addTo(earthquakeLayer);
      earthquakeLayer.addTo(map);
    });
}

// Call the functions to add data to the map
addTectonicPlatesLayer();
addEarthquakeData();

// Add layer controls to the map
var baseMaps = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
};

var overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
