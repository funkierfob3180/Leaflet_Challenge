//create the map object with a center and zoom level.
const map = L.map('map', {
  center: [45.52, -122.67],
  zoom: 3.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
//url for USGS location updating at regular intervals
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data) {
  console.log(data);
  L.Icon.Default.prototype.options.iconSize = [25, 41];
 // Create a map that updates earthquake data every 5 minutes
  L.geoJson(data, {
   onEachFeature: (features, layer) => {
     layer.bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
   }
}).addTo(map);


//create markers that reflect the magnitude of the earthquake by their size and and depth of the earth quake by color.
// Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

let geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.4
};
L.geoJson(data, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }
}).addTo(map);

});

function getcolor(depth) {
  switch (true) {
    case depth > 9:
      return "#000000";
    case depth > 7:
      return "#2f1f00";
    case depth > 5:
      return "#472e00";
    case depth > 3:
      return "#5f3e00";
    case depth > 1:
      return "#774e00";
    default:
      return "#ee9c00";
  }
}
function style(feature) {
  return {
    fillColor: getcolor(feature.geometry.coordinates[2]),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

//Create a legend that will provide context for your map data.
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Depth</strong>'],
    categories = ['0-10', '10-30', '30-50', '50-70', '70-90'];

    const depth = [0, 1, 2, 3, 4, 5, 6];
    const colors = [
      "#ee9c00",
      "#d68c00",
      "#be7c00",      
      "#8e5d00",
      "#774e00",
      "#5f3e00",
     
    ];
// loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        labels.push(
            '<i style = "background:' + colors[i] + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);






