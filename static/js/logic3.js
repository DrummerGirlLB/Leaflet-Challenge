var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 8
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

//get data for earthquakes in past day
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url, function (data) {
    
    function styles(feature) {
        return {
            radius: createRadius(feature.properties.mag),
            fillColor: colorSelector(feature.geometry.coordinates),
            color: "#ffffff",
            fillOpacity: 1,
            weight: 0.5
        };

    }

    console.log(data.feature.geometry.coordinates);

    function colorSelector(magDepth) {
        switch (true) { //remember to account for in betweens // get rbg from image in paint and get hex at converter website
            case magDepth <= 10: return "#A3F600";
            case magDepth > 10: return "#DCF400";
            case magDepth > 30: return "#F7DB11";
            case magDepth > 50: return "#FDB72A";
            case magDepth > 70: return "#FCA35D";
            case magDepth > 90: return "#FF5F65";
        }
    }

    function createRadius(quakeMag) {
        if (quakeMag === 0) {
            return 1;
        }

        return quakeMag * 10;
    }

    L.geoJson(data, {
        pointToLayer: function (features, layers) {
            return L.circleMarker(coordinates);
        },

        style: styles,

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude:" + feature.properties.mag + "<br> Location:" + feature.properties.place + "<br> Depth:" + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    var legend = L.control({
        position: "upperright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var depths = [];
        var depthColors = [];
    
    //duh add your loop yo!
        for(var i=0; i < depths.length; i++) {
            div.innerHTML += "<i style='background: " + depthColors[i] + "'></i> " +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }

        return div;
    };

    legend.addTo(myMap)
});