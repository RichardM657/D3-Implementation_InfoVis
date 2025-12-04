/**
 * Data processing functions for disaster dataset
 * Handles data type conversion, validation, and filtering
 */

/**
 * Processes raw CSV data: converts types and filters invalid entries
 */
export function processData(data) {
  // Convert string values to numbers using unary plus operator
  data.forEach(d => {
    d.Start_Year = +d["Start.Year"];
    d.Total_Deaths = +d["Total.Deaths"];
  });
  
  // Filter out invalid data (NaN values or zero deaths)
  return data.filter(d => 
    !isNaN(d.Total_Deaths) && 
    !isNaN(d.Start_Year) && 
    d.Total_Deaths > 0
  );
}

/**
 * Extracts unique country names from dataset and sorts alphabetically
 */
export function getUniqueCountries(data) {
  return [...new Set(data.map(d => d.Country))].sort();
}

/**
 * Filters data by selected country
 */
export function filterByCountry(data, country) {
  if (!country || country === "") {
    return data; 
  }
  return data.filter(d => d.Country === country);
}