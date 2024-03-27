const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const dataPromise = d3.json(url).then(function(data) {

let otuSamples = data.samples
let sampleNames = data.names
let sampleInfo = data.metadata
let sample_values_array = []
let otu_ids_array = []
let otu_labels_array = []

const dropdownMenu = d3.select("#selDataset");
dropdownMenu.selectAll("option")
    .data(sampleNames)
    .enter()
    .append("option")
    .text(d => d);

function init() {
    trace1 = [{
        x: otuSamples[0].sample_values.slice(0, 10),
        y: otuSamples[0].otu_ids.slice(0, 10),
        text: otuSamples[0].otu_labels.slice(0, 10), 
        type: "bar",
        orientation: "h", 
        yaxis: 'category'
    }];
        
Plotly.newPlot("bar", trace1);
};

dropdownMenu.on("change", optionChanged);

function optionChanged() {
    let selectedValue = dropdownMenu.property("value");
    for (const key in otuSamples) {
        if (otuSamples[key].id === selectedValue) {
            sample_values_array = Object.values(otuSamples[key].sample_values)
            otu_ids_array = Object.values(otuSamples[key].otu_ids)
            otu_labels_array = Object.values(otuSamples[key].otu_labels)
        }
    }
    
    let x = sample_values_array.slice(0, 10);
    let y = otu_ids_array.slice(0, 10);
    let text = otu_labels_array.slice(0, 10)

    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "text", [text]);
}

init()
});