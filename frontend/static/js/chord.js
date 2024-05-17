const color = d3.scaleOrdinal(d3.schemeCategory10);

function displayChordDiagram(adjacencyMatrix, nodeNames) {
    const width = 800, height = 800;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    d3.select("#graphResult").select("svg").remove();
    const svg = d3.select("#graphResult")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const chord = d3.chord()
                    .padAngle(0.05)
                    .sortSubgroups(d3.descending);
    const chords = chord(adjacencyMatrix);

    const arc = d3.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
                      .radius(innerRadius);

    const groups = svg.append("g")
                      .selectAll("g")
                      .data(chords.groups)
                      .enter()
                      .append("g");

    // Draw arcs/nodes
    groups.append("path")
          .style("fill", d => color(d.index))
          .style("stroke", d => d3.rgb(color(d.index)).darker())
          .attr("d", arc);

    // Draw edges
    svg.append("g")
       .datum(chords)
       .selectAll("path")
       .data(d => d)
       .enter()
       .append("path")
       .attr("d", ribbon)
       .style("fill", d => color(d.source.index))
       .style("stroke", d => d3.rgb(color(d.source.index)).darker());

    // node names
    groups.append("text")
          .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
          .attr("dy", ".35em")
          .attr("transform", d => `
              rotate(${(d.angle * 180 / Math.PI - 90)})
              translate(${outerRadius + 10})
              ${d.angle > Math.PI ? "rotate(180)" : ""}
          `)
          .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
          .text((d, i) => nodeNames[i])
          .attr("fill", "#27a776");
}