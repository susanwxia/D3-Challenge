// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

console.log(svg);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var ChartxAxis = "poverty";

// function for axis label
function xScale(healthCareData, ChartxAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthCareData, d => d[ChartxAxis]) * 0.8,
      d3.max(healthCareData, d => d[ChartxAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthCareData, err) {
  if (err) throw err;

  // parse data
  healthCareData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthCareData, ChartxAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthCareData, d => d.healthcare)*1.1])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthCareData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[ChartxAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", "0.4")
    
  var circlesText = chartGroup.selectAll("text")
    .data(healthCareData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size", 10)
    .attr("dx", d => xLinearScale(d[ChartxAxis]))
    .attr("dy", d => yLinearScale(d.healthcare)+4)
    .classed("stateText", true);   

  console.log(circlesText)

  // append x axis
  var labelsforX = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%):");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left*0.6)
    .attr("x", 0 - (height/1.35))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(xAxis, circlesGroup);

}).catch(function(error) {
  console.log(error);
});