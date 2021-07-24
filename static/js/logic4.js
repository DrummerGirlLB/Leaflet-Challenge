//url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//L.layerGroup
var earthquakes = L.layerGroup();

//tileLayer
var tileMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

//map opbject and options
var myMap = L.map("map", {
    center: [37, -95],
    zoom: 5,
    layers: [tileMap, earthquakes]
});

d3.json(url, function(quakes) {

    function markerSize(mag) {
        return mag * 5;
    };

    function colorSelector(depth) {
        switch (true) {
            case depth > 90: return "#ff5f65";
            case depth > 70: return "#FCA35D";
            case depth > 50: return "#FDB72A";
            case depth > 30: return "#F7DB11";
            case depth > 10: return "#DCF400";
            default: return "#A3F600";
        }
    };

    L.geoJSON(quakes, {
        
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng,
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: colorSelector(feature.geometry.coordinates[2]),
                    fillOpacity: 0.8,
                    color: "#000000",
                    stroke: true,
                    weight: 0.5
                }
            );
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }

    }).addTo(earthquakes);

    earthquakes.addTo(myMap);

    //build legend


});