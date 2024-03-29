const url =
  "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

let otuSamples = [];
let sampleNames = [];
let sampleInfo = [];
let sample_values_array = [];
let otu_ids_array = [];
let otu_labels_array = [];
const dropdownMenu = d3.select("#selDataset");

let traceBar = [
  {
    x: [],
    text: [],
    type: "bar",
    orientation: "h",
  },
];
let layoutBar = {
  xaxis: {
    type: "category",
  },
};
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

d3.json(url).then(function (data) {
  otuSamples = data.samples;
  sampleNames = data.names;
  sampleInfo = data.metadata;
  init();
});

function UpdateDemoInfo(id) {
    let meta = sampleInfo.find((s) => {
        return s.id == id;
        });
        console.log(meta,sampleInfo)
    d3.select("#sample-metadata")
    .html(`
    id: ${meta.id}<br> 
    ethnicity: ${meta.ethnicity}<br>`)
}


function updateCharts(id) {
  let index = otuSamples.findIndex((s) => {
    return s.id === id;
  });
  traceBar[0].x = otuSamples[index].sample_values.slice(0, 10);
  traceBar[0].text = otuSamples[index].otu_labels.slice(0, 10);
  console.log(traceBar);
  Plotly.react("bar", traceBar);
  traceBubble[0].x = otuSamples[index].otu_ids;
  traceBubble[0].y = otuSamples[index].sample_values;
  traceBubble[0].text = otuSamples[index].otu_labels;
  traceBubble[0].marker.color = otuSamples[index].otu_ids;
  traceBubble[0].marker.size = otuSamples[index].sample_values;
  console.log(traceBubble);
  Plotly.react("bubble", traceBubble);
}

function init() {
  updateCharts("940");
  UpdateDemoInfo("940")
  dropdownMenu
    .selectAll("option")
    .data(sampleNames)
    .enter()
    .append("option")
    .text((d) => d);
}

dropdownMenu.on("change", optionChanged);

function optionChanged() {
  let selectedValue = dropdownMenu.property("value");
  updateCharts(selectedValue);
  UpdateDemoInfo(selectedValue);
}

