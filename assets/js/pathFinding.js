// Function to find shortest path from given source to all other nodes
const findShortestPath = () => {
    clearScreen();
    
    let source = Number($('#source-node').val());
    let destination = Number($('#destination-node').val());

    if(cnt == 0){
        Swal.fire({
            title: 'Warning!',
            text: 'Please create node first',
            icon: 'warning',
        })
        return;
    } else if(source >= cnt || isNaN(source)){
        Swal.fire({
            title: 'Warning!',
            text: `Origin node must be a number within 0 and ${cnt-1}`,
            icon: 'warning'
        })
        return;
    } else if(destination >= cnt || isNaN(destination)){
        
        Swal.fire({
            title: 'Warning!',
            text: `Destination node must be a number within 0 and ${cnt-1}`,
            icon: 'warning'
        })
        return;
    }
    
    $(`#${source}`).css('backgroundColor', 'lime');
    if(destination) $(`#${destination}`).css('backgroundColor', 'lime');

    parent[source] = -1;
    for(i=0;i<cnt;i++) unvisited.push(i);

    // Array containing cost of reaching i(th) node from source
    console.log(dist);
    for(i=0;i<cnt;i++){
        i===source ? null : (dist[source][i] ? cost[i]=dist[source][i] : cost[i]=Infinity );
    }
    cost[source] = 0;
    console.log(cost);

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

    for(i=0;i<cnt;i++) parent[i]===undefined ? parent[i]=source : null;
    // console.log(parent);
    indicatePath(parent, source, destination);
}


const indicatePath = async (parentArr, src, dst)=>{
    $('.path').empty()
    for(i=0;i<cnt;i++){
        if($('#destination-node').val() != ''){
            if(i == dst){
                let p = $(document.createElement('p')).text('Node ' + i + ' --> ' + src);
                await printPath(parentArr, i, p);
                p.text(p.text() + ' ' + '(Cost : ' + minCost[i] + ')');
            }
        } else {
            let p = $(document.createElement('p')).text('Node ' + i + ' --> ' + src);
            await printPath(parentArr, i, p);
            p.text(p.text() + ' ' + '(Cost : ' + minCost[i] + ')');
        }
    }
}

const printPath = async (parent, j, el_p) => {
    if(parent[j]===-1) return;
    await printPath(parent, parent[j], el_p);
    el_p.text(el_p.text() + ' -> ' + j);

    $('.path').css('padding', '1rem');
    $('.path').append(el_p);

    // console.log(j,parent[j]);

    if(j<parent[j]){
        let tmp = $(`#line-${j}-${parent[j]}`);
        await colorEdge(tmp);
    }else {
        let tmp = $(`#line-${parent[j]}-${j}`);
        await colorEdge(tmp);
    }
}

const colorEdge = async (el) => {
    if(el.css('backgroundColor') !== 'aqua'){
        await wait(200);
        el.css({
            backgroundColor: 'aqua',
            height: '8px'
        });
    }
}

const clearScreen = ()=>{
    unvisited = [];
    cost = [];
    parent = [];
    for(i=0;i<cnt;i++){
        $(`${i}`).css('backgroundColor', '#fff');
    }
    $('.path').empty();
    $('.line').css({
        backgroundColor: '#EEE',
        height: '5px'
    });
}

const wait = async (t)=>{
    let pr = new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve('done!')
        }, t)
    });
    res = await pr;
}
