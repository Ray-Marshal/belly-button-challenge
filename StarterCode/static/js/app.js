// Initilizing variables and the url
const url =
  "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

let otuSamples = [];
let sampleNames = [];
let sampleInfo = [];
const dropdownMenu = d3.select("#selDataset");

// Setting up the bar graph (& layout) and bubble plot sans data
let traceBar = [
  {
    x: [],
    y: [],
    text: [],
    type: "bar",
    orientation: "h",
  },
];
let layoutBar = [
  {
    xaxis: {
      type: "category",
    },
  },
];
Plotly.newPlot("bar", traceBar, layoutBar);

let traceBubble = [
  {
    x: [],
    y: [],
    text: [],
    mode: "markers",
    marker: {
      color: [],
      size: [],
    },
  },
];
Plotly.newPlot("bubble", traceBubble);

// Creating a data promise, extracting sample, names and metadata dictionaries
// from the json and running the init function which is defined below
d3.json(url).then(function (data) {
  otuSamples = data.samples;
  sampleNames = data.names;
  sampleInfo = data.metadata;
  init();
});

// The init function runs our functions to populate the previous charts upon 
// opening the page and populates the drop down menu as well
function init() {
  updateCharts("940");
  UpdateDemoInfo("940");
  dropdownMenu
    .selectAll("option")
    .data(sampleNames)
    .enter()
    .append("option")
    .text((d) => d);
}

// After the init, the only thing that will change the webpage is changing the
// dropdown menu. That handler is defined below
dropdownMenu.on("change", optionChanged);

function optionChanged() {
  let selectedValue = dropdownMenu.property("value");
  UpdateDemoInfo(selectedValue);
  updateCharts(selectedValue);
}

// Below are the functions that are used in the above handler. They update 
// both charts and the demographic info 
function UpdateDemoInfo(id) {
  let meta = sampleInfo.find((s) => {
    return s.id == id;
  });

  d3.select("#sample-metadata").html(`
    id: ${meta.id}<br> 
    ethnicity: ${meta.ethnicity}<br>
    gender: ${meta.gender}<br>
    age: ${meta.age}<br>
    location: ${meta.location}<br>
    bbtype: ${meta.bbtype}<br>
    wfreq: ${meta.wfreq}<br>
    `);
}

function updateCharts(id) {
  let index = otuSamples.findIndex((s) => {
    return s.id === id;
  });
  let sample = otuSamples[index];
  let barGraph = traceBar[0];
  let bubGraph = traceBubble[0];

  barGraph.x = sample.sample_values.slice(0, 10).reverse();
  barGraph.text = sample.otu_labels.slice(0, 10).reverse();
  barGraph.y = sample.otu_ids
    .slice(0, 10)
    .map((id) => `OTU ${id} `)
    .reverse();
  Plotly.react("bar", traceBar, layoutBar);

  bubGraph.x = sample.otu_ids;
  bubGraph.y = sample.sample_values;
  bubGraph.text = sample.otu_labels;
  bubGraph.marker.color = sample.otu_ids;
  bubGraph.marker.size = sample.sample_values;
  Plotly.react("bubble", traceBubble);
}
