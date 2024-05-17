import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './LSTM.css';

const LSTM = () => {
  const chartRef = useRef();

  useEffect(() => {
    // Fetch data from the server
    fetch('/api/data')
      .then(response => response.text())
      .then(csvData => {
        // Parse the CSV data
        const data = d3.csvParse(csvData);
        data.forEach(d => {
          d.Datetime = new Date(d.Datetime);
          d.AEP_MW = +d.AEP_MW;
        });

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 30, left: 60 },
              width = 800 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

        // Remove any existing SVG
        d3.select(chartRef.current).select('svg').remove();

        // Append the SVG object to the chartRef
        const svg = d3.select(chartRef.current)
          .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleTime()
          .domain(d3.extent(data, d => d.Datetime))
          .range([ 0, width ]);
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([d3.min(data, d => d.AEP_MW), d3.max(data, d => d.AEP_MW)])
          .range([ height, 0 ]);
        svg.append('g')
          .call(d3.axisLeft(y));

        // Add the line
        svg.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', d3.line()
            .x(d => x(d.Datetime))
            .y(d => y(d.AEP_MW))
          );
      });
  }, []);

  return (
    <div>
      <h1>LSTM Visualization</h1>
      <div id="chart" ref={chartRef}></div>
    </div>
  );
}

export default LSTM;
