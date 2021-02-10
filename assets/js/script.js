let blocks = $('.base-plate');
let addEdge = false;
let cnt = 0;
let dist;
let visited = [];
let unvisited = [];
let cost = [];
let minCost=[];
let parent = [];

let alerted = localStorage.getItem('alerted') || '';
if (alerted !== 'yes') {
    alert("Read instructions before proceeding by clicking i-icon in the top-right corner");
    localStorage.setItem('alerted','yes');
}

// Allow creating nodes on screen by clicking
blocks.click((e)=>{
    if(addEdge) return;
    // if(cnt>12) {
    //     alert("cannot add more than 12 vertices");
    //     return;
    // }
    appendBlock(e.pageX,e.pageY);
})

// Temporary array to store clicked elements to make an edge between the(max size =2)
let arr = [];

const appendBlock = (x,y)=>{
    $('.click-instruction').css('display', 'none');
    // Creating a node
    const block = $(document.createElement('div'))
                    .attr('id', cnt)
                    .addClass('block')
                    .text(cnt++)
                    .css({
                        top: `${y}px`,
                        left: `${x}px`,
                        transform: `translate(-50%,-50%)`
                    })
    
                    // Click event for node
                    .click((e)=>{
                        // Prevent node upon node
                        e.stopPropagation() || (window.event.cancelBubble = 'true');

                        // If state variable addEdge is false, can't start adding edges
                        if(!addEdge) return;

                        block.css('backgroundColor', 'lime');
                        arr.push(block[0].id);

                        // When two elements are push, draw a edge and empty the array
                        if( arr.length === 2 ) {
                            drawUsingId(arr);
                            arr=[];
                        }
                    })

    blocks.append(block);
}

// It is called when user starts adding edges by clicking on button given
const addEdges = () => {
    addEdge = true; 
    $('#add-edge-enable').attr('disabled', true);
    // Initializing array for adjacency matrix representation
    dist = _.map(new Array(cnt+1), () => {
        return _.fill(new Array(cnt+1), Infinity);
    });
}

// Function to get (x, y) coordinates of clicked node
const drawUsingId = (ar) => {
    if(ar[0]===ar[1]){
        $(`#${arr[0]}`).css('backgroundColor', '#fff');
        arr=[];
        return;
    }
    x1 = Number($(`#${arr[0]}`).css('left').slice(0,-2));
    y1 = Number($(`#${arr[0]}`).css('top').slice(0,-2));
    x2 = Number($(`#${arr[1]}`).css('left').slice(0,-2));
    y2 = Number($(`#${arr[1]}`).css('top').slice(0,-2));
    drawLine(x1,y1,x2,y2,ar);
}

// Function to draw a line between nodes
const drawLine = (x1,y1,x2,y2,ar) => {
    // console.log(ar);

    // Length of line
    const len = Math.sqrt((x1-x2)**2 + (y1-y2)**2);
    const slope = (x2-x1) ? (y2-y1)/(x2-x1) : (y2>y1 ? 90 : -90);

    const weightValue = Math.round(len/10);

    // Adding length to distance array
    dist[Number(ar[0])][Number(ar[1])] = weightValue;
    dist[Number(ar[1])][Number(ar[0])] = weightValue;
    // console.log(dist);

    // Drawing line
    const line = $(document.createElement('div'))
                   .attr('id', Number(ar[0])<Number(ar[1]) ? `line-${ar[0]}-${ar[1]}` : `line-${ar[1]}-${ar[0]}`)
                   .addClass('line')
                   .css({
                       width: `${len}px`,
                       left: `${x1}px`,
                       top: `${y1}px`,
                       transform: `rotate(${(x1>x2) ? Math.PI + Math.atan(slope) : Math.atan(slope)}rad)`
                   })
    
    let weight = $(document.createElement('div'))
              .addClass('edge-weight')
              .text(weightValue)
              .attr({
                contenteditable: true,
                inputmode: 'numeric'
              })
              .css({
                  transform: `rotate(-${(x1>x2) ? Math.PI + Math.atan(slope) : Math.atan(slope)}rad)`
              })
              .blur((e)=>{
                n1 = Number(weight.closest('.line')[0].id.split('-')[1]);
                n2 = Number(weight.closest('.line')[0].id.split('-')[2]);
                
                if(isNaN(Number(e.target.innerText))){
                    Swal.fire({
                        title: 'Warning!',
                        text: 'Please input a valid number weight',
                        icon: 'warning'
                    })

                    if(dist[n1][n2] != Infinity){
                        weight.text(dist[n1][n2]);
                    } else {
                        weight.text(weightValue);
                    }
                    return;
                } else if(e.target.innerText == '') {
                    Swal.fire({
                        title: 'Warning!',
                        text: 'Weight can not be empty',
                        icon: 'warning'
                    })

                    if(dist[n1][n2] != Infinity){
                        weight.text(dist[n1][n2]);
                    } else {
                        weight.text(weightValue);
                    }
                    return;
                }
        
                // console.log(p.closest('.line'), e.target.innerText, n1, n2);
                dist[n1][n2] = Number(e.target.innerText);
                dist[n2][n1] = Number(e.target.innerText);
            })

    line.append(weight);
    blocks.append(line);
    $(`#${arr[0]}`).css('backgroundColor', '#fff');
    $(`#${arr[1]}`).css('backgroundColor', '#fff');
}

const reset = () => {    
    dist = [];
    visited = [];
    unvisited = [];
    cost = [];
    parent = [];

    for(i=0;i<cnt;i++){
        $(`#${i}`).remove();
    }    
    cnt = 0;

    addEdge = false;
    $('#add-edge-enable').attr('disabled', false);

    $('.path').css('padding', 0).empty();
    $('.line').remove();
}
