let blocks = document.getElementsByClassName('block-dijk')[0];
let addEdge = false;
let cnt = 0;
let visited = [];
let dist;

let alerted = localStorage.getItem('alerted') || '';
    if (alerted !== 'yes') {
        alert("Read instructions before proceeding by clicking i-icon in the top-right corner");
       localStorage.setItem('alerted','yes');
}

// It is called when user starts adding edges by clicking on button given
const addEdges = () => {
    addEdge = true; 
    document.getElementById('add-edge-enable').disabled = true;
    // Initializing array for adjacency matrix representation
    dist = new Array(cnt+1).fill(Infinity).map(() => new Array(cnt+1).fill(Infinity));
}

// Temporary array to store clicked elements to make an edge between the(max size =2)
let arr = [];

let appendBlock = (x,y)=>{
    document.querySelector('.click-instruction').style.display = 'none';
    // Creating a node
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.top = `${y}px`;
    block.style.left = `${x}px`;
    block.style.transform = `translate(-50%,-50%)`;
    block.id = cnt;

    block.innerText = cnt++;

    // Click event for node
    block.addEventListener('click', (e)=>{
        // Prevent node upon node
        e.stopPropagation() || (window.event.cancelBubble = 'true');

        // If state variable addEdge is false, can't start adding edges
        if(!addEdge) return;

        block.style.backgroundColor = 'lime';
        arr.push(block.id);

        // When two elements are push, draw a edge and empty the array
        if( arr.length === 2 ) {
            drawUsingId(arr);
            arr=[];
        }
    })
    blocks.appendChild(block);
}

// Allow creating nodes on screen by clicking
blocks.addEventListener('click', (e)=>{
    if(addEdge) return;
    // if(cnt>12) {
    //     alert("cannot add more than 12 vertices");
    //     return;
    // }
    // console.log(e.x,e.y);
    appendBlock(e.x,e.y);
})

// Function to draw a line between nodes
const drawLine = (x1,y1,x2,y2,ar) => {
    // console.log(ar);
    // Length of line
    const len = Math.sqrt((x1-x2)**2 + (y1-y2)**2);
    const slope = (x2-x1) ? (y2-y1)/(x2-x1) : (y2>y1 ? 90 : -90);
    
    // Adding length to distance array
    dist[Number(ar[0])][Number(ar[1])] = Math.round(len/10);
    dist[Number(ar[1])][Number(ar[0])] = Math.round(len/10);
    // console.log(dist);

    // Drawing line
    const line = document.createElement('div');
    line.id = Number(ar[0])<Number(ar[1]) ? `line-${ar[0]}-${ar[1]}` : `line-${ar[1]}-${ar[0]}`;
    line.classList.add('line');
    line.style.width = `${len}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    let p = document.createElement('p');
    p.classList.add('edge-weight');
    p.innerText = Math.round(len/10);
    p.contentEditable='true';
    p.inputMode='numeric';
    p.addEventListener('blur', (e)=>{
        n1 = Number(p.closest('.line').id.split('-')[1]);
        n2 = Number(p.closest('.line').id.split('-')[2]);
        
        if(isNaN(Number(e.target.innerText))){
            alert('Enter valid edge weight');
            return;
        } else if(e.target.innerText == '') {
            alert('Edge weight can not be empty');
            if(dist[n1][n2] != Infinity){
                p.innerText = dist[n1][n2];
            } else {
                p.innerText = Math.round(len/10);
            }
            return;
        }

        // console.log(p.closest('.line'), e.target.innerText, n1, n2);
        dist[n1][n2] = Number(e.target.innerText);
        dist[n2][n1] = Number(e.target.innerText);
    })
    line.style.transform = `rotate(${
        (x1>x2) ? Math.PI + Math.atan(slope) : 
        Math.atan(slope)}rad)`;

    p.style.transform = `rotate(-${
        (x1>x2) ? Math.PI + Math.atan(slope) : 
        Math.atan(slope)}rad)`;

    line.append(p);
    blocks.appendChild(line);
    document.getElementById(arr[0]).style.backgroundColor = '#fff';
    document.getElementById(arr[1]).style.backgroundColor = '#fff';
}

// Function to get (x, y) coordinates of clicked node
const drawUsingId = (ar) => {
    if(ar[0]===ar[1]){
        document.getElementById(arr[0]).style.backgroundColor = '#fff';
        arr=[];
        return;
    }
    x1 = Number(document.getElementById(ar[0]).style.left.slice(0,-2));
    y1 = Number(document.getElementById(ar[0]).style.top.slice(0,-2));
    x2 = Number(document.getElementById(ar[1]).style.left.slice(0,-2));
    y2 = Number(document.getElementById(ar[1]).style.top.slice(0,-2));
    drawLine(x1,y1,x2,y2,ar);
}

const reset = () => {    
    dist = [];
    visited = [];
    unvisited = [];
    cost = [];
    parent = [];

    for(i=0;i<cnt;i++){
        document.getElementById(i).remove();
    }    
    cnt = 0;

    addEdge = false;
    document.getElementById('add-edge-enable').disabled = false;

    document.getElementsByClassName('path')[0].innerHTML = '';
    let lines = document.getElementsByClassName('line');
    while(lines.length > 0){
        lines[0].parentNode.removeChild(lines[0]);
    }
}
