function displayRheingoldTilfordLayout(adjacencyMatrix, nodeNames) {
    d3.select('#graphResult').html("");
    d3.select("#chart").selectAll("*").remove();
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 1000)
        .append("g")
        .attr("transform", "translate(50, 50)");

    const root = buildHierarchyFromMatrix(adjacencyMatrix, nodeNames);
    console.log("Hierarchy root:", root); 
    const tree = d3.tree().size([900, 900]); 
    const treeData = tree(root);

    svg.selectAll(".link")
        .data(treeData.links())
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    const node = svg.selectAll(".node")
        .data(treeData.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 14)
        .attr("fill", "#27a776")
        .attr("stroke", "#27a776")
        .attr("stroke-width", 2);

    node.append("text")
        .attr("dy", "-1.5em")
        .attr("font-size", 14)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#27a776")
        .text(d => d.data.name);
}

function buildHierarchyFromMatrix(adjacencyMatrix, nodeNames) {
    // map to hold nodes by name
    const nodesMap = new Map(nodeNames.map(name => [name, { name, children: [] }]));

    adjacencyMatrix.forEach((row, i) => {
        const parentNode = nodesMap.get(nodeNames[i]);
        row.forEach((cell, j) => {
            if (cell === 1) {
                const childNodeName = nodeNames[j];
                // Avoiding direct self-reference
                if (parentNode.name !== childNodeName) {
                    const childNode = nodesMap.get(childNodeName);
                    parentNode.children.push(childNode);
                }
            }
        });
    });

    const rootNode = nodesMap.get("Root");

    return d3.hierarchy(rootNode);
}