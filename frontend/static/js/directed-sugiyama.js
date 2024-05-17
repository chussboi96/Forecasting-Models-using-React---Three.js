function displayDirectedSugiyamaLayout(matrix, layers) {
    d3.select('#graphResult').html("");
    const width = 800, height = 600;
    const svg = d3.select("#graphResult").append("svg")
                  .attr("width", width)
                  .attr("height", height);

    let nodePositions = calculateNodePositions(layers, width, height);

    matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 1) {
                svg.append("line")
                   .attr("x1", nodePositions[i].x)
                   .attr("y1", nodePositions[i].y)
                   .attr("x2", nodePositions[j].x)
                   .attr("y2", nodePositions[j].y)
                   .attr("stroke", "#27a776");
                }
        });
    });

    const nodes = svg.selectAll(".node")
                     .data(nodePositions)
                     .enter()
                     .append("g");

    nodes.append("circle")
         .attr("cx", d => d.x)
         .attr("cy", d => d.y)
         .attr("r", 10)
         .attr("fill", "#27a776");

    nodes.append("text")
         .attr("x", d => d.x + 12)
         .attr("y", d => d.y + 5)
         .text((d, i) => globalNodeNames[i])
         .attr("font-family", "sans-serif")
         .attr("font-size", "15px")
         .attr("fill", "#27a776");
}

function calculateNodePositions(layers, width, height) {
    let nodePositions = new Array(layers.length);
    const layerHeight = height / layers.length;

    layers.forEach((layer, i) => {
        const layerWidth = width / layer.length;
        layer.forEach((node, j) => {
            const x = j * layerWidth + layerWidth / 2;
            const y = i * layerHeight + layerHeight / 2;
            nodePositions[node] = { x: x, y: y };
        });
    });

    return nodePositions;
}

let layers = sugiyamaLayers(globalAdjacencyMatrix);
displayDirectedSugiyamaLayout(globalAdjacencyMatrix, layers, globalNodeNames);