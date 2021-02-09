// Function to find shortest path from given source to all other nodes
let unvisited = [];
let cost = [];
let parent = [];

const findShortestPath = () => {
    clearScreen();
    
    let source = Number(document.getElementById('source-node').value);
    let destination = Number(document.getElementById('destination-node').value);

    if(source >= cnt || isNaN(source)){
        alert('Invalid source');
        return;
    } else if(destination >= cnt || isNaN(destination)){
        alert('Invalid destination');
        return;
    }
    
    document.getElementById(source).style.backgroundColor = 'lime';
    if(destination) document.getElementById(destination).style.backgroundColor = 'lime';

    parent[source] = -1;
    visited = [];
    for(i=0;i<cnt;i++) unvisited.push(i);

    // Array containing cost of reaching i(th) node from source
    console.log(dist);
    for(i=0;i<cnt;i++){
        i===source ? null : (dist[source][i] ? cost[i]=dist[source][i] : cost[i]=Infinity );
    }
    cost[source] = 0;
    console.log(cost);
    shortestPathMethod(source);
    for(i=0;i<cnt;i++) parent[i]===undefined ? parent[i]=source : null;
    // console.log(parent);
    indicatePath(parent, source, destination);
}


const indicatePath = async (parentArr, src, dst)=>{
    document.getElementsByClassName('path')[0].innerHTML = '';
    for(i=0;i<cnt;i++){
        if(document.getElementById('destination-node').value != ''){
            if(i == dst){
                let p = document.createElement('p');
                p.innerText = ("Node " + i + " --> " + src);
                await printPath(parentArr, i, p);
                p.innerText = p.innerText + " " + "(Cost : " + minCost[i] + ")";
            }
        } else {
            let p = document.createElement('p');
            p.innerText = ("Node " + i + " --> " + src);
            await printPath(parentArr, i, p);
            p.innerText = p.innerText + " " + "(Cost : " + minCost[i] + ")";
        }
    }
}

const printPath = async (parent, j, el_p) => {
    if(parent[j]===-1) return;
    await printPath(parent, parent[j], el_p);
    el_p.innerText = el_p.innerText + " -> " + j;

    document.getElementsByClassName('path')[0].style.padding ='1rem';
    document.getElementsByClassName('path')[0].appendChild(el_p);

    // console.log(j,parent[j]);

    if(j<parent[j]){
        let tmp = document.getElementById(`line-${j}-${parent[j]}`);
        await colorEdge(tmp);
    }else {
        let tmp = document.getElementById(`line-${parent[j]}-${j}`);
        await colorEdge(tmp);
    }
}

const colorEdge = async (el) => {
    if(el.style.backgroundColor !== 'aqua'){
        await wait(200);
        el.style.backgroundColor = 'aqua';
        el.style.height = '8px';
    }
}

const clearScreen = ()=>{
    unvisited = [];
    cost = [];
    parent = [];
    for(i=0;i<cnt;i++){
        document.getElementById(i).style.backgroundColor = '#fff';
    }
    document.getElementsByClassName('path')[0].innerHTML = '';
    let lines = document.getElementsByClassName('line');
    for(line of lines){
        line.style.backgroundColor = '#EEE';
        line.style.height = '5px';
    }
}

const wait = async (t)=>{
    let pr = new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve('done!')
        }, t)
    });
    res = await pr;
}
