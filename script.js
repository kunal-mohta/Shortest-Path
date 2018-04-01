var adjMatrix = [];// Adjacency Matrix

var nodes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W'];//nodes

//creating an empty multidimensional array of adjMatrix to store the relevant info later
for(i=0;i<nodes.length;i++){
    adjMatrix[i] = [];
    for(j=0;j<nodes.length;j++){
        adjMatrix[i][j] = [0];
    }
}

var addedNodes = [];//stores nodes as (nodes,coords) pairs

function dist(node1,node2){//distance between two nodes
    return (((node1[1][0]-node2[1][0])**2) + ((node1[1][1]-node2[1][1])**2))**(0.5);
}

function addNode(node,coords){//Adds node info to adjMatrix
    var elemsAdded = addedNodes.length;
    addedNodes[elemsAdded] = [node,coords];
}

function addEdge(node1,node2){//to specify which points are connected
    index1 = nodes.indexOf(node1);

    //making the adjacency matrix
    for(i = 0; i < node2.length; i++){
        index2 = nodes.indexOf(node2[i]);

        adjMatrix[index1][index2] = dist(addedNodes[index1],addedNodes[index2]);
        adjMatrix[index2][index1] = dist(addedNodes[index2],addedNodes[index1]);
    }
}

addNode('A',[72,110]);
addNode('B',[75,234]);
addNode('C',[28,236]);
addNode('D',[28,34]);
addNode('E',[124,35]);
addNode('F',[125,61]);
addNode('G',[212,61]);
addNode('H',[365,57]);
addNode('I',[370,196]);
addNode('J',[413,194]);
addNode('K',[376,336]);
addNode('L',[224,360]);
addNode('M',[220,277]);
addNode('N',[178,276]);
addNode('O',[172,356]);
addNode('P',[29,352]);
addNode('Q',[217,195]);
addNode('R',[214,174]);
addNode('S',[196,181]);
addNode('T',[193,207]);
addNode('U',[167,207]);
addNode('V',[165,165]);
addNode('W',[128,161]);

for(x = 0; x < addedNodes.length; x++){
    for(y = 0; y < addedNodes.length; y++){
        adjMatrix[x][y] = 0;
    }
}

addEdge('A',['B']);
addEdge('B',['C','A']);
addEdge('C',['B','D','P']);
addEdge('D',['C','E']);
addEdge('E',['D','F']);
addEdge('F',['E','G','W']);
addEdge('G',['F','H','R']);
addEdge('H',['I','G']);
addEdge('I',['H','J','Q','K']);
addEdge('J',['I']);
addEdge('K',['I','L']);
addEdge('L',['M','K']);
addEdge('M',['Q','L','N']);
addEdge('N',['O','M']);
addEdge('O',['N','P']);
addEdge('P',['O','C']);
addEdge('Q',['I','R','M']);
addEdge('R',['S','Q','G']);
addEdge('S',['R','T']);
addEdge('T',['S','U']);
addEdge('U',['T','V']);
addEdge('V',['W','U']);
addEdge('W',['F','V']);

// console.log(adjMatrix);
function callDijkstra(a,b,c){
    var visited = [];//visited nodes

    function isVisited(node){//param is the node
        if(visited.indexOf(node)>-1) return 1;
        else return 0;
    }

    function markVisited(node){//param is the node
        visited[visited.length] = node;
    }

    function enqueueP(pq,node){//param are the data struc and node
        for(i=0;i<pq.length;i++){
            if(isVisited(pq[i][1])) pq.splice(i,i+1);
        }

        pq[pq.length] = node;

        //sorting on the basis of distance_covered
        pq.sort((a,b) => {
            if(a[0]<b[0]) return 1;//increase priority of a
            else if(a[0]==b[0]){
                if(nodes.indexOf(a[1])<nodes.indexOf(b[1])) return 1;
            }
        });
    }

    function dequeueP(pq){//param is the data struc
        for(i=0;i<pq.length;i++){
            if(isVisited(pq[i][1])) pq.splice(i,i+1);
        }
        if(pq.length>0)	return pq[pq.length-1];
        else return false;
    }

    function findAdjacent(node){
        var index = nodes.indexOf(node);

        var adjacents = [];

        //finding adjacent elems using adjacency matrix
        for(i=0;i<adjMatrix[index].length;i++){
            if(adjMatrix[index][i] > 0){
                adjacents[adjacents.length] = nodes[i];
            }
        }

        return adjacents;
    }

    var priorityQueue = [];//data structure used - pattern [distance_covered,current_node, prev_node]
    var rememberQueue = [];// remebers the data which is consecutively stored in  priorityQueue

    function dijkstra(distanceCovered,currentNode,prevNode){
        if(!isVisited(currentNode)){
            markVisited(currentNode);
            rememberQueue[rememberQueue.length] = [distanceCovered,currentNode,prevNode];
        }

        var currentNodeIndex = nodes.indexOf(currentNode);
        var prevNodeIndex = nodes.indexOf(prevNode);	

        //if(distanceCovered>0) enqueueP(priorityQueue,[distanceCovered,currentNode,prevNode]);
        var adjElems = findAdjacent(currentNode);
        for(j=0;j<adjElems.length;j++){
            if(!isVisited(adjElems[j])){
                thisIndex = nodes.indexOf(adjElems[j]);
                enqueueP(priorityQueue,[distanceCovered+adjMatrix[currentNodeIndex][thisIndex],adjElems[j],currentNode]);
                //console.log(priorityQueue);
            }
        }

        // console.log(visited);
        // if(dequeueP(priorityQueue)) dijkstra(...dequeueP(priorityQueue));
        // return rememberQueue;
        try{
            dijkstra(...dequeueP(priorityQueue));
            return rememberQueue;
        }
        catch(e){
            return rememberQueue;
        }
    }
        
    return dijkstra(a,b,c);
}
// dijkstra(0,nodes[3],nodes[3]);//input taken as (0,start,start)
//remeberQueue output format (dist,to,from)
//     return dijkstra(a,b,c);
// }
// console.log(rememberQueue);
function findPath(){
    var fromNode = document.getElementById("from").value.toString().toUpperCase();
    var toNode = document.getElementById("to").value.toString().toUpperCase();
    
    var fromIndex = nodes.indexOf(fromNode);
    var toIndex = nodes.indexOf(toNode);

    var pathInfo = callDijkstra(0,nodes[fromIndex],nodes[fromIndex]);;
    // console.log(pathInfo);
    //breaking the info in pathInfo array into multiple arrays
    var fromPoints = [], toPoints = [];
    var i;
    for(i = 0; i < pathInfo.length; i++){
        fromPoints[i] = pathInfo[i][1];
        toPoints[i] = pathInfo[i][2];
    }

    //finding the shortest path 
    var j = fromPoints.indexOf(toNode);
    var shortestPath = [pathInfo[j][1]];
    while(j){
        j = fromPoints.indexOf(pathInfo[j][2]);
        shortestPath.unshift(pathInfo[j][1]);
    }
    alert("Shortest Path from "+fromNode+" to "+toNode+" is along the nodes "+shortestPath);
}