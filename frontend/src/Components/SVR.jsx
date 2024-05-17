import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SVR = () => {
  const [actualData, setActualData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Load and parse the actual data CSV file
    d3.csv('/last_3_months.csv').then(data => {
      data.forEach(d => {
        d.timestamp = d3.timeParse('%Y-%m-%d %H:%M:%S')(d.Datetime);
        d.AEP_MW = +d.AEP_MW;
      });

      // Extract the last 3 months of actual data
      const last3MonthsDate = d3.timeMonth.offset(d3.max(data, d => d.timestamp), -3);
      const filteredActualData = data.filter(d => d.timestamp >= last3MonthsDate);
      setActualData(filteredActualData);
    });

    // Load and parse the predicted data CSV file
    d3.csv('/forecast_3_months.csv').then(data => {
      data.forEach(d => {
        d.timestamp = d3.timeParse('%Y-%m-%d')(d.Datetime);
        d.AEP_MW = +d.AEP_MW;
      });
      setPredictedData(data);
    });
  }, []);

  useEffect(() => {
    if (actualData.length === 0 || predictedData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 900;
    const height = 500;
    const margin = { top: 100, right: 80, bottom: 50, left: 70 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleTime()
      .domain(d3.extent(actualData.concat(predictedData), d => d.timestamp))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(actualData.concat(predictedData), d => d.AEP_MW)]).nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d')).tickSizeOuter(0));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .call(g => g.select('.domain').remove());

    const grid = g => g
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.1)
      .call(g => g.append('g')
        .selectAll('line')
        .data(x.ticks())
        .join('line')
          .attr('x1', d => 0.5 + x(d))
          .attr('x2', d => 0.5 + x(d))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom))
      .call(g => g.append('g')
        .selectAll('line')
        .data(y.ticks())
        .join('line')
          .attr('x1', margin.left)
          .attr('x2', width - margin.right)
          .attr('y1', d => 0.5 + y(d))
          .attr('y2', d => 0.5 + y(d)));

    svg.selectAll('*').remove(); // Clear previous content

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg.append('g').call(grid);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '16px')
      .text('Time');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Energy Consumption (MW)');

    const lineActual = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.AEP_MW))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(actualData)
      .attr('fill', 'none')
      .attr('stroke', '#1f77b4')
      .attr('stroke-width', 2)
      .attr('d', lineActual);

    const linePredicted = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.AEP_MW))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(predictedData)
      .attr('fill', 'none')
      .attr('stroke', '#ff7f0e')
      .attr('stroke-width', 2)
      .attr('d', linePredicted);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#f9f9f9')
      .style('padding', '8px')
      .style('border', '1px solid', '#ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    svg.selectAll('.dotActual')
      .data(actualData)
      .enter().append('circle')
      .attr('class', 'dotActual')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.AEP_MW))
      .attr('r', 3)
      .attr('fill', '#1f77b4')
      .on('mouseover', (event, d) => {
        tooltip.html(`Time: ${d3.timeFormat('%b %d')(d.timestamp)}<br>Actual: ${d.AEP_MW.toFixed(2)} MW`)
          .style('visibility', 'visible');
      })
      .on('mousemove', event => {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    svg.selectAll('.dotPredicted')
      .data(predictedData)
      .enter().append('circle')
      .attr('class', 'dotPredicted')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.AEP_MW))
      .attr('r', 3)
      .attr('fill', '#ff7f0e')
      .on('mouseover', (event, d) => {
        tooltip.html(`Time: ${d3.timeFormat('%b %d')(d.timestamp)}<br>Predicted: ${d.AEP_MW.toFixed(2)} MW`)
          .style('visibility', 'visible');
      })
      .on('mousemove', event => {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#1f77b4');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text('Actual')
      .attr('fill', 'white')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle');

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#ff7f0e');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .text('Predicted')
      .attr('fill', 'white')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle');

  }, [actualData, predictedData]);

  return (
    <div className='ann-body'>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SVR;
