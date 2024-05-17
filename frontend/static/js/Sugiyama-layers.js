function topologicalSort(matrix) {
    let visited = new Array(matrix.length).fill(false);
    let stack = [];
    for (let i = 0; i < matrix.length; i++) {
        if (!visited[i]) {
            topologicalSortUtil(i, visited, stack, matrix);
        }
    }
    return stack.reverse();
}

function topologicalSortUtil(node, visited, stack, matrix) {
    visited[node] = true;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[node][i] === 1 && !visited[i]) {
            topologicalSortUtil(i, visited, stack, matrix);
        }
    }
    stack.push(node);
}

function longestPath(matrix, sortedNodes) {
    let dist = new Array(matrix.length).fill(0);
    sortedNodes.forEach(node => {
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] === 1) {
                dist[i] = Math.max(dist[i], dist[node] + 1);
            }
        }
    });
    return dist;
}

function assignLayers(longestPaths) {
    let layers = [];
    longestPaths.forEach((layer, node) => {
        if (!layers[layer]) {
            layers[layer] = [];
        }
        layers[layer].push(node);
    });
    return layers;
}

function sugiyamaLayers(matrix) {
    let sortedNodes = topologicalSort(matrix);
    let longestPaths = longestPath(matrix, sortedNodes);
    let layers = assignLayers(longestPaths);
    return layers;
}