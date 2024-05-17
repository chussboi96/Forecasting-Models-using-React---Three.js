function displayGridLayout(adjacencyMatrix, nodeNames) {
    d3.select("#graphViz").html("");
    const width = 800, height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select("#graphResult")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    const g = svg.append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let gridSize = Math.ceil(Math.sqrt(adjacencyMatrix.length));
    let spacing = Math.min(width, height) / gridSize;

    let nodePositions = adjacencyMatrix.map((_, i) => {
        let x = (i % gridSize) * spacing + spacing / 2;
        let y = Math.floor(i / gridSize) * spacing + spacing / 2;
        return { x: x, y: y, name: nodeNames[i] };
    });

    adjacencyMatrix.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 1) {
                g.append("line")
                 .attr("x1", nodePositions[i].x)
                 .attr("y1", nodePositions[i].y)
                 .attr("x2", nodePositions[j].x)
                 .attr("y2", nodePositions[j].y)
                 .attr("stroke", "#27a776")
                 .attr("stroke-width", 1);
            }
        });
    });

    g.selectAll(".node")
     .data(nodePositions)
     .enter()
     .append("circle")
     .attr("class", "node")
     .attr("cx", d => d.x)
     .attr("cy", d => d.y)  
     .attr("r", 10)
     .attr("fill", "#27a776");

    g.selectAll(".node-name")
     .data(nodePositions)
     .enter()
     .append("text")
     .attr("class", "node-name")
     .attr("x", d => d.x + 12)
     .attr("y", d => d.y + 5)
     .text(d => d.name)
     .attr("font-family", "sans-serif")
     .attr("font-size", "10px")
     .attr("fill", "white");
}