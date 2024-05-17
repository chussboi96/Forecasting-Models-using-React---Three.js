function calculateLayers(matrix) {
    const layers = [];
    const visited = Array(matrix.length).fill(false);

    function dfs(node, currentLayer) {
        if (visited[node]) return;
        visited[node] = true;

        if (!layers[currentLayer]) {
            layers[currentLayer] = [];
        }

        layers[currentLayer].push(node);
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] === 1) {
                dfs(i, currentLayer + 1);
            }
        }
    }

    for (let i = 0; i < matrix.length; i++) {
        if (!visited[i]) {
            dfs(i, 0);
        }
    }

    return layers;
}

function buildHierarchy(matrix, nodeNames) {
    const layers = calculateLayers(matrix);
    const root = { name: "Root", children: [] };
    const nodesMap = new Map(nodeNames.map((name, index) => [index, { name, children: [] }]));
    nodesMap.set("Root", root);

    layers.forEach(layer => {
        layer.forEach(nodeIndex => {
            const newNode = nodesMap.get(nodeIndex);

            let parentNode = null;
            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][nodeIndex] === 1 && nodeIndex !== i) {
                    parentNode = nodesMap.get(i);
                    break;
                }
            }

            if (parentNode) {
                parentNode.children.push(newNode);
            } else if (nodeIndex !== "Root") {
                root.children.push(newNode);
            }
        });
    });

    return root;
}

function displayIcicleTree(matrix, nodeNames) {
    d3.select('#graphResult').html("");
    const root = buildHierarchy(matrix, nodeNames);
    const width = 800;
    const height = 400;
    const svg = d3.select("#graphResult").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    const icicle = d3.partition()
        .size([width, height])
        .padding(1)
        .round(true);

    const rootHierarchy = d3.hierarchy(root)
        .sum(() => 1)
        .sort((a, b) => b.height - a.height || a.data.name.localeCompare(b.data.name));

    icicle(rootHierarchy);

    svg.selectAll("rect")
        .data(rootHierarchy.descendants())
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("fill", "#27a776")
        .style("stroke", "white");

    svg.selectAll("text")
        .data(rootHierarchy.descendants())
        .enter().append("text")
        .attr("x", d => d.x0 + 5)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .text(d => d.data.name)
        .attr("font-size", "10px")
        .attr("fill", "white");
}

displayIcicleTree(globalAdjacencyMatrix, globalNodeNames);