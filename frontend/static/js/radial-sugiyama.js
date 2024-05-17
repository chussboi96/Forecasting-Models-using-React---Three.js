

function sugiyamaLayers(matrix) {
    let sortedNodes = topologicalSort(matrix);
    let longestPaths = longestPath(matrix, sortedNodes);
    let layers = assignLayers(longestPaths);
    return layers;
}

function drawRadialSugiyamaLayout(matrix, nodeNames) {
    d3.select('#graphResult').html("");
    const layers = sugiyamaLayers(matrix);
    const svg = d3.select('#graphResult').append('svg')
        .attr('width', 800)
        .attr('height', 800);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;
    const layerRadiusIncrement = Math.min(width, height) / (2 * layers.length);

    // concentric circles for layers
    layers.forEach((layer, i) => {
        const radius = i * layerRadiusIncrement;
        svg.append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', '#27a776')
            .attr('stroke-dasharray', '2,2');
    });

    // edges
    layers.forEach((layer, i) => {
        layer.forEach(node => {
            matrix[node].forEach((edge, target) => {
                if (edge === 1) {
                    const sourceRadius = i * layerRadiusIncrement;
                    const targetLayerIndex = layers.findIndex(layer => layer.includes(target));
                    const targetRadius = targetLayerIndex * layerRadiusIncrement;

                    if (targetLayerIndex !== -1) { // Check if the target node is in the layers
                        const sourceAngle = (2 * Math.PI * layer.indexOf(node)) / layer.length;
                        const targetAngle = (2 * Math.PI * layers[targetLayerIndex].indexOf(target)) / layers[targetLayerIndex].length;

                        svg.append('path')
                            .attr('d', d3.linkRadial()
                                .angle(d => d.angle)
                                .radius(d => d.radius)({
                                    source: { angle: sourceAngle, radius: sourceRadius },
                                    target: { angle: targetAngle, radius: targetRadius }
                                }))
                            .attr('fill', 'none')
                            .attr('stroke', '#27a776');
                    }
                }
            });
        });
    });

    layers.forEach((layer, i) => {
        const radius = i * layerRadiusIncrement;
        const angleIncrement = (2 * Math.PI) / layer.length;

        layer.forEach((node, j) => {
            const angle = j * angleIncrement;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 5) // Node radius
                .attr('fill', '#27a776')
                .attr('stroke', '#27a776');

            svg.append('text')
                .attr('x', x)
                .attr('y', y - 10) //  label position
                .attr('text-anchor', 'middle')
                .text(nodeNames[node])
                .attr('fill', '#27a776');
                
        });
    });
}

drawRadialSugiyamaLayout(globalAdjacencyMatrix, globalNodeNames);