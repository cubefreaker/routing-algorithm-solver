// Function to find shortest path from given source to all other nodes
const findPath = () => {
    clearScreen()

    if (algoType != 'dijkstra' && $('#destination-node').val() == '') {
        Swal.fire({
            title: 'Warning!',
            text: 'Please input destination',
            icon: 'warning',
        })
        return
    }

    let source = Number($('#source-node').val())
    let destination = Number($('#destination-node').val())

    if(cnt == 0){
        Swal.fire({
            title: 'Warning!',
            text: 'Please create node first',
            icon: 'warning',
        })
        return
    } else if(source >= cnt || isNaN(source)){
        Swal.fire({
            title: 'Warning!',
            text: `Origin node must be a number within 0 and ${cnt-1}`,
            icon: 'warning'
        })
        return
    } else if(destination >= cnt || isNaN(destination)){
        
        Swal.fire({
            title: 'Warning!',
            text: `Destination node must be a number within 0 and ${cnt-1}`,
            icon: 'warning'
        })
        return
    }
    
    $(`#${source}`).css('backgroundColor', 'lime')

    switch (algoType) {
        case 'saw':
            fuzzySaw()
            break;
        case 'topsis':
            fuzzyTopsis()
            break;
        case 'dijkstra-saw':
            dijkstraSaw()
            break;
        default:
            dijsktra()
            break;
    }
}

const indicatePath = async (parentArr, src, dst)=>{
    $('.path').empty()

    if (algoType == 'saw' || algoType == 'topsis') {
        let tmp = src < dst ? $(`#line-${src}-${dst}`) : $(`#line-${dst}-${src}`)
        await colorEdge(tmp)
    } else if(algoType == 'dijkstra-saw') {
        for(i=0;i<cnt;i++){
            if(i == dst){
                let tes = [...parentArr]
                console.log(tes)
                await printPath(parentArr, i, '')
                $(`#${dst}`).css('backgroundColor', 'lime')
            }
        }
    } else {
        for(i=0;i<cnt;i++){
            if($('#destination-node').val() != ''){
                if(i == dst){
                    let p = $(document.createElement('p')).text('Node ' + i + ' --> ' + src)
                    await printPath(parentArr, i, p)
                    p.text(p.text() + ' ' + '(Cost : ' + minCost[i] + ')')
                    $(`#${dst}`).css('backgroundColor', 'lime')
                }
            } else {
                let p = $(document.createElement('p')).text('Node ' + i + ' --> ' + src)
                await printPath(parentArr, i, p)
                p.text(p.text() + ' ' + '(Cost : ' + minCost[i] + ')')
            }
        }
    }
}

const printPath = async (parent, j, el_p) => {
    if(algoType == 'dijkstra-saw'){
        if(parent[j]===-1){
            routeNode = _.map(_.reverse(visited), (el) => {
                return {...listNodeCriteria[Number(el)]}
            })

            let sumCriteria = {}
            _.map(listCriteriaWeight, (el) => {
                sumCriteria[el['criteria']] = _.sumBy(routeNode, el['criteria'])
            })

            console.log(visited)
            printRouteSum(routeNode, sumCriteria)
            console.log(routeNode)
            console.log(sumCriteria)
            return
        }        
        visited.push(j)
        await printPath(parent, parent[j], el_p)
    } else {
        if(parent[j]===-1) return
        await printPath(parent, parent[j], el_p)
        el_p.text(el_p.text() + ' -> ' + j)

        $('.path').css('padding', '1rem')
        $('.path').append(el_p)
    }

    // console.log(j,parent[j])

    if(j<parent[j]){
        let tmp = $(`#line-${j}-${parent[j]}`)
        await colorEdge(tmp)
    }else {
        let tmp = $(`#line-${parent[j]}-${j}`)
        await colorEdge(tmp)
    }
}

const colorEdge = async (el) => {
    if(el.css('backgroundColor') !== 'aqua'){
        await wait(200)
        el.css({
            backgroundColor: 'aqua',
            height: '8px'
        })
    }
}

const clearScreen = ()=>{
    unvisited = []    
    visited = []
    cost = []
    parent = []
    for(i=0;i<cnt;i++){
        $(`#${i}`).css('backgroundColor', '#fff')
    }
    $('.path').empty()
    $('.line').css({
        backgroundColor: '#EEE',
        height: '5px'
    })
}

const wait = async (t)=>{
    let pr = new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve('done!')
        }, t)
    })
    res = await pr
}
