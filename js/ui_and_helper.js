/**
 * UI helper functions for disaster visualization
 * Handles color mapping and dropdown population
 */

// === HELPER FUNCTION ===

/**
 * Returns color based on disaster group type
 */
export function getDisasterColor(disasterGroup) {
  if (disasterGroup === "Natural") return "green";
  if (disasterGroup === "Technological") return "red";
  return "gray"; // Fallback for other/unknown types
}

// === UI FUNCTIONS ===

/**
 * Populates dropdown menu with country options
 */
export function populateDropdown(countries) {
  const dropdown = d3.select("#dropdown");
  
  // Add default "All countries" option
  dropdown.append("option")
    .text("All countries")
    .attr("value", "");
  
  // Add individual country options
  dropdown.selectAll("option.country")
    .data(countries)
    .enter()
    .append("option")
    .attr("class", "country")
    .attr("value", d => d)
    .text(d => d);
}