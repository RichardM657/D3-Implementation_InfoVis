# Global Disaster Impact Scatterplot

## Type of Visualization
This is an **interactive scatterplot** that shows the total number of deaths over time for a selected country.

## Visual Encodings
- **X-axis:** Year of the disaster  
- **Y-axis:** Total deaths  
- **Color:** Disaster Group (Natural = green, Technological = red)  
- **Shape/marks:** Circles representing individual disaster events  

## Visual Elements
- **Marks:** Circles for each disaster event  
- **Scales:** Linear scale for Y (Total Deaths), time scale for X (Year)  
- **Channels:** Position (X, Y), Color (disaster group)  
- **Interaction:** Dropdown menu to filter by country, tooltips on hover  
- **Animation:** Smooth transition of points when changing country selection




ChatGPT was used for brainstorming visualization ideas. Code generation was used for different methods regarding D3. Also after deployment it was used to fix my missing dataset and the module imports and for debugging.
