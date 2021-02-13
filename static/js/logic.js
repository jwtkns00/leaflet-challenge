// Store the given API endpoint inside queryUrl
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Get request for data
d3.json(earthquakeURL, function(data) {
    createFeatures(data.features);
});
// Define function to run "onEach" feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h2>" + feature.properties.place +
            "</h2><h3>Magnitude: " + feature.properties.mag + "</h3>" +
            "<p>" + new Date(feature.properties.time) + "</p>");},

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .5,
              color: "black",
              stroke: true,
              weight: .8
          })
        }
        });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define map layers
    var airMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoiand0a25zMDAiLCJhIjoiY2tqeG1nOHF3MDVlaTJwbzR3eXprbG0wMSJ9.h365mIKsJnPNlde7PCtxgA");
  
       
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoiand0a25zMDAiLCJhIjoiY2tqeG1nOHF3MDVlaTJwbzR3eXprbG0wMSJ9.h365mIKsJnPNlde7PCtxgA");

        
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoiand0a25zMDAiLCJhIjoiY2tqeG1nOHF3MDVlaTJwbzR3eXprbG0wMSJ9.h365mIKsJnPNlde7PCtxgA");
    
      // Define base maps
    var baseMaps = {
        "LightMap": lightMap,
        "AirMap": airMap,
        "Satellite": satellite
    };

    // Create tectonic layer
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create map
    var myMap = L.map("map", {
        center: [33.7, -118.19],
        zoom: 4,
        layers: [lightMap, earthquakes, tectonicPlates]
    });

    // Add tectonic plates 
    d3.json(tectonicPlatesURL, function(tectonicData) {
        L.geoJson(tectonicData, {
            color: "black",
            weight: 2
        })
        .addTo(tectonicPlates);
    });
  
}

// color function
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'maroon'
    } else if (magnitude > 4) {
        return 'red'
    } else if (magnitude > 3) {
        return 'orange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'lightgreen'
    } else {
        return 'aqua'
    }
};

// radius function
function getRadius(magnitude) {
    return magnitude * 25000;
};