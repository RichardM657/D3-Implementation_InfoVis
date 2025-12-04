/**
 * Main script file for disaster data visualization
 * Orchestrates data loading, processing, and scatterplot creation
 */

// Import functions from modules
import { processData, getUniqueCountries, filterByCountry } from './data_processing.js';
import { getDisasterColor, populateDropdown } from './ui_and_helper.js';

// Global variables to store data and current filter state
let allData = [];           
let currentCountry = null;  

// Load CSV data and initialize visualization
function loadData() {
  d3.csv("data/df_subset.csv").then(function(data) {
    console.log("Data loaded successfully!");
    console.log("Total rows:", data.length);

    // Process data: convert types and filter invalid entries
    allData = processData(data);
    console.log("Valid data rows:", allData.length);

    // Get list of unique countries and fill dropdown
    var countries = getUniqueCountries(allData);
    populateDropdown(countries);
    
    // Add event listener for dropdown changes
    var dropdown = d3.select("#dropdown");
    dropdown.on("change", function() {
      currentCountry = this.value;
      updateScatterplot();
    });

    // Show initial plot with all data
    updateScatterplot();

  }).catch(function(error) {
    console.error("Error loading data:", error);
  });
}

// Start the visualization when page loads
loadData();

// Remove old plot and create new one when country changes
function updateScatterplot() {
  // Delete all old charts
  d3.select("#scatter").selectAll("*").remove();
  
  // Filter data for selected country (or show all if nothing selected)
  var filteredData = filterByCountry(allData, currentCountry);
  var countryName = currentCountry || "All countries";
  console.log("Showing " + filteredData.length + " data points for: " + countryName);
  
  // Draw new scatterplot
  createScatterplot(filteredData);
}

// Create the scatterplot visualization
function createScatterplot(data) {
  // Set up chart dimensions
  var width = 1000;
  var height = 600;
  var marginTop = 50;
  var marginRight = 30;
  var marginBottom = 120;
  var marginLeft = 100;

  // Create SVG (container for the chart)
  var svg = d3.select("#scatter").append("svg");
  svg.attr("width", width);
  svg.attr("height", height);

  // Create group for chart (with margins)
  var chart = svg.append("g");
  var translateX = marginLeft;
  var translateY = marginTop;
  chart.attr("transform", "translate(" + translateX + "," + translateY + ")");

  // Add title above the chart
  var titleText = currentCountry || "All Countries";
  var titleY = marginTop - 15;
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", titleY)
    .attr("font-size", "30px")
    .attr("font-weight", "bold")
    .attr("fill", "#2c3e50")
    .style("text-anchor", "middle")
    .text(titleText);

  // Create scales for positioning data points
  // X scale: maps years to pixels (horizontal)
  var chartWidth = width - marginLeft - marginRight;
  var minYear = d3.min(data, function(d) { return d.Start_Year; });
  var maxYear = d3.max(data, function(d) { return d.Start_Year; });
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, chartWidth]);

  // Y scale: maps death count to pixels (vertical)
  var chartHeight = height - marginTop - marginBottom;
  var maxDeaths = d3.max(data, function(d) { return d.Total_Deaths; });
  var yScale = d3.scaleLinear()
    .domain([0, maxDeaths])
    .range([chartHeight, 0]);

  // Add X axis (bottom)
  var xAxisGroup = chart.append("g");
  var xAxisY = chartHeight;
  xAxisGroup.attr("transform", "translate(0," + xAxisY + ")");
  xAxisGroup.call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  xAxisGroup.style("font-size", "12px");

  // Rotate X axis labels so they don't overlap
  xAxisGroup.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-45)");

  // Add X axis label ("Year")
  var xLabelX = chartWidth / 2;
  var xLabelY = 80;
  xAxisGroup.append("text")
    .attr("x", xLabelX)
    .attr("y", xLabelY)
    .attr("fill", "black")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Year");

  // Add Y axis (left side)
  var yAxisGroup = chart.append("g");
  yAxisGroup.call(d3.axisLeft(yScale));
  yAxisGroup.style("font-size", "12px");

  // Add Y axis label ("Total Deaths") - rotated vertically
  var yLabelX = -(chartHeight / 2);
  var yLabelY = -75;
  yAxisGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", yLabelX)
    .attr("y", yLabelY)
    .attr("fill", "black")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Total Deaths");

  // Create tooltip (popup that shows when hovering over points)
  var tooltip = d3.select("body").append("div");
  tooltip.attr("class", "tooltip");
  tooltip.style("position", "absolute");
  tooltip.style("opacity", 0);

  // Draw a circle for each data point
  var circles = chart.selectAll("circle").data(data).enter().append("circle");

  // Set circle properties (position, size, color)
  circles.attr("cx", function(d) { return xScale(d.Start_Year); });  // X position
  circles.attr("cy", function(d) { return yScale(d.Total_Deaths); });  // Y position
  circles.attr("r", 3);  // Radius size
  circles.attr("fill", function(d) { return getDisasterColor(d["Disaster.Group"]); });  // Color
  circles.attr("stroke", "white");
  circles.attr("stroke-width", 0.5);
  
  // Add fade-in animation
  circles.attr("opacity", 0);
  circles.transition().duration(600).attr("opacity", 1);

  // Add hover effect and tooltip
  circles.on("mouseover", function(event, d) {
    // Make circle bigger when hovering
    d3.select(this)
      .transition().duration(200)
      .attr("r", 6)
      .attr("stroke-width", 2);
    
    // Show tooltip
    var deathCount = d.Total_Deaths.toLocaleString();
    var tooltipHtml = "<strong>" + d.Country + "</strong><br/>" +
                      "Year: " + d.Start_Year + "<br/>" +
                      "Total Deaths: " + deathCount + "<br/>" +
                      "Type: " + d["Disaster.Group"] + "<br/>" +
                      "Subgroup: " + d["Disaster.Subgroup"] + "<br/>" +
                      "Disaster Type: " + d["Disaster.Type"] + "<br/>" +
                      "Disaster Subtype: " + d["Disaster.Subtype"];
    
    tooltip.html(tooltipHtml);
    tooltip.style("left", (event.pageX + 10) + "px");
    tooltip.style("top", (event.pageY - 28) + "px");
    tooltip.transition().duration(200).style("opacity", 0.95);
  });

  // Remove hover effect and tooltip when mouse leaves
  circles.on("mouseout", function(event, d) {
    // Make circle normal size
    d3.select(this)
      .transition().duration(300)
      .attr("r", 3)
      .attr("stroke-width", 0.5);
    
    // Hide tooltip
    tooltip.transition().duration(300).style("opacity", 0);
  });
}
