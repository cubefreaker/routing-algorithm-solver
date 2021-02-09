let minCost=[];
function shortestPathMethod(source) {
    // Array which will contain final minimum cost
    minCost[source]=0;

    // Repeating until all edges are visited
    while(unvisited.length){
        let mini = cost.indexOf(Math.min(...cost));
        // console.log("draw", visited[visited.length-1],mini);
        visited.push(mini);
        unvisited.splice(unvisited.indexOf(mini),1);

        // Relaxation of unvisited edges
        for(j of unvisited){
            console.log(mini, j);
            if(j===mini) continue;
            if(cost[j] > dist[mini][j]+cost[mini]){
                minCost[j] = dist[mini][j]+cost[mini];
                cost[j] = dist[mini][j]+cost[mini];
                parent[j] = mini;
            }else{
                minCost[j] = cost[j];
                // parent[j] = source;
            }
        }
        cost[mini]=Infinity;
    }
    console.log("Minimum Cost", minCost);
}    
