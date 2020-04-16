// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [31.765537,-82.814941],
  zoom: 5
});

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'brelsfoeagain'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM hms_efh_2009tiger_shark');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: ramp([life_stage], (#5F4690, #1D6996, #38A6A5), ("Adult", "Juvenile", "Neonate"), "=");
  }
  #layer::outline {
    line-width: 1;
    line-color: #FFFFFF;
    line-opacity: 0.5;
  }
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var lifeStage = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (lifeStage === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM hms_efh_2009tiger_shark");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM hms_efh_2009tiger_shark WHERE life_stage = '" + lifeStage + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + lifeStage + '"');
});