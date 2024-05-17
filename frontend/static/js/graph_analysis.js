    var globalAdjacencyMatrix; 
    var globalNodeNames;

    document.addEventListener('DOMContentLoaded', (event) => {
        document.getElementById('uploadForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            handleFileUpload();
        });
    });

    function handleFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvString = e.target.result;
                parseCSV(csvString); // This updates the global variables directly
                if (!globalNodeNames || !globalAdjacencyMatrix) {
                    console.error("Error in parsing CSV file.");
                    return;
                }
    
                console.log("Parsed Node Names:", globalNodeNames);
                console.log("Parsed Adjacency Matrix:", globalAdjacencyMatrix);
    
                const graphType = classifyGraph(globalAdjacencyMatrix, globalNodeNames);
                console.log("Graph Type:", graphType);
                displayResult(graphType);
            };
            reader.readAsText(file);
        } else {
            console.log("No file selected");
        }
    }
    
    function displayResult(graphType) {
        const resultElement = document.getElementById('graphResult');
        let layoutOptionsHtml = '';
    
        if (!globalNodeNames || globalNodeNames.length === 0) {
            console.error('Node names are undefined or empty');
            resultElement.innerHTML = 'Error: Node names are undefined or empty';
            return;
        }
        
        if (graphType === 'Disconnected Graph') {
            layoutOptionsHtml = 'This graph is disconnected. Please upload a connected graph.';
        } else {
            if (globalNodeNames.includes('Root')) {
                layoutOptionsHtml = '<button class="graph-layout-button" onclick="displayRheingoldTilfordLayout(globalAdjacencyMatrix, globalNodeNames)">Reingold-Tilford Tree Layout</button>' +
                '<button class="graph-layout-button" onclick="displayIcicleTree(globalAdjacencyMatrix, globalNodeNames)">Icicle Tree Layout</button>';
            } else {
                switch (graphType) {
                    case 'General Graph':
                        layoutOptionsHtml = '<button class="graph-layout-button" onclick="displayGridLayout(globalAdjacencyMatrix, globalNodeNames)">Grid Layout</button>' +
                        '<button class="graph-layout-button" onclick="displayChordDiagram(globalAdjacencyMatrix, globalNodeNames)">Chord Diagram</button>';
                        break;
                    case 'Directed Acyclic Graph':
                        layoutOptionsHtml = 
                            '<button class="graph-layout-button" onclick="displayDirectedSugiyamaLayout(globalAdjacencyMatrix, sugiyamaLayers(globalAdjacencyMatrix), globalNodeNames)">Sugiyama Layout</button>' +
                            '<button class="graph-layout-button" onclick="drawRadialSugiyamaLayout(globalAdjacencyMatrix, globalNodeNames)">Radial Sugiyama Layout</button>';
                        break;                
                    case 'Tree':
                        layoutOptionsHtml = '<button class="graph-layout-button" onclick="displayRheingoldTilfordLayout(globalAdjacencyMatrix, globalNodeNames)">Rheingold Tilford Layout</button>' +
                        '<button class="graph-layout-button" onclick="displayIcicleTree(globalAdjacencyMatrix, globalNodeNames)">Icicle Tree Layout</button>';
                        break;
                    default:
                        layoutOptionsHtml = 'No layout options available for this type of graph.';
                }
            }
        }
    
        resultElement.innerHTML = "Graph Type: " + graphType + "<br>" + layoutOptionsHtml;
    }    

    function parseCSV(csvString) {
        const lines = csvString.split('\n');
        const firstLine = lines[0].startsWith(',') ? lines[0].substring(1) : lines[0];
        globalNodeNames = firstLine.split(',').map(name => name.trim());
        
        if (!globalNodeNames.length || globalNodeNames.every(name => name === '')) {
            console.error("Node names are undefined or empty");
            return;
        }
        
        console.log("Node names from CSV:", globalNodeNames);
        globalAdjacencyMatrix = lines.slice(1).filter(line => line.trim() !== '').map(line => {
            return line.split(',').slice(1).map(value => parseInt(value.trim(), 10));
        });
    }     
    
    function hasCycle(matrix) {
        const visited = new Array(matrix.length).fill(false);
        const recStack = new Array(matrix.length).fill(false);

        for (let node = 0; node < matrix.length; node++) {
            if (!visited[node]) {
                if (detectCycleUtil(matrix, node, visited, recStack)) {
                    return true;
                }
            }
        }
        return false;
    }

    function detectCycleUtil(matrix, node, visited, recStack) {
        if (!visited[node]) {
            visited[node] = true;
            recStack[node] = true;

            for (let neighbour = 0; neighbour < matrix.length; neighbour++) {
                if (matrix[node][neighbour]) {
                    if (!visited[neighbour] && detectCycleUtil(matrix, neighbour, visited, recStack)) {
                        return true;
                    } else if (recStack[neighbour]) {
                        return true;
                    }
                }
            }
        }
        recStack[node] = false;
        return false;
    }

    function isConnected(matrix, nodeNames) {
        let visited = new Array(matrix.length).fill(false);
        let startNode = nodeNames.includes('Root') ? nodeNames.indexOf('Root') : 0;
    
        dfs(matrix, startNode, visited);
        if (startNode !== 0 || visited.every(v => v)) {
            return true;
        }
    
        for (let i = 0; i < matrix.length; i++) {
            if (!visited[i]) {
                visited.fill(false);
                dfs(matrix, i, visited);
                if (!visited.every(v => v)) {
                    return false;
                }
            }
        }
    
        return true;
    }    
    
    function dfs(matrix, node, visited) {
        visited[node] = true;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] === 1 && !visited[i]) {
                dfs(matrix, i, visited);
            }
        }
    }
   
    function classifyGraph(matrix, nodeNames) {
        if (nodeNames[0] === 'Root') {
            console.log("Graph is classified as a Tree because 'Root' is present");
            return 'Tree';
        }
    
        if (!isConnected(matrix, nodeNames)) {
            return 'Disconnected Graph';
        } else if (!hasCycle(matrix)) {
            return 'Directed Acyclic Graph';
        } else {
            return 'General Graph';
        }
    }       

    function isTree(matrix, nodeNames) {
        let rootCount = nodeNames.filter(name => name === 'Root').length;
        if (rootCount !== 1) {
            return false;
        }
    
        return isConnected(matrix, nodeNames) && !hasCycle(matrix);
    }