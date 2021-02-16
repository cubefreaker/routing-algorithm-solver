const dijkstraSaw = () => {
    let source = Number($('#source-node').val())
    let destination = Number($('#destination-node').val())

    parent[source] = -1
    for(i=0;i<cnt;i++) unvisited.push(i)

    //calculate edge weight with saw
    let edgeCriteria = []
    _.map(nodeRelation, (el) => {
        let relation = el.split('-')
        let relationData = {edge: [Number(relation[0]),Number(relation[1])]}
        _.map(listCriteriaWeight, (e) => {
            relationData[e['criteria']] = listNodeCriteria[Number(relation[0])][e['criteria']] + listNodeCriteria[Number(relation[1])][e['criteria']]
        })
        edgeCriteria.push(relationData)
    })
    result = djkSaw(edgeCriteria)
    console.log(edgeCriteria)
    _.map(result, (el) => {
        el['edge'][0] < el['edge'][1] ? $(`#line-${el['edge'][0]}-${el['edge'][1]}`).text(Math.floor(el['total']*10000)/10000) : $(`#line-${el['edge'][1]}-${el['edge'][0]}`).text(Math.floor(el['total']*10000)/10000)
        dist[el['edge'][0]][el['edge'][1]] = el['total']
        dist[el['edge'][1]][el['edge'][0]] = el['total']
    })

    // Array containing cost of reaching i(th) node from source
    console.log(dist)
    for(i=0;i<cnt;i++){
        i===source ? null : (dist[source][i] ? cost[i]=dist[source][i] : cost[i]=Infinity )
    }
    cost[source] = 0
    console.log(cost)

    // Array which will contain final minimum cost
    minCost[source]=0

    // Repeating until all edges are visited
    while(unvisited.length){
        let mini = cost.indexOf(Math.min(...cost))
        // console.log("draw", visited[visited.length-1],mini)
        // visited.push(mini)
        unvisited.splice(unvisited.indexOf(mini),1)

        // Relaxation of unvisited edges
        for(j of unvisited){
            console.log(mini, j)
            if(j===mini) continue
            if(cost[j] > dist[mini][j]+cost[mini]){
                minCost[j] = dist[mini][j]+cost[mini]
                cost[j] = dist[mini][j]+cost[mini]
                parent[j] = mini
            }else{
                minCost[j] = cost[j]
                // parent[j] = source
            }
        }
        cost[mini]=Infinity
    }

    for(i=0;i<cnt;i++) parent[i]===undefined ? parent[i]=source : null
    // console.log(parent)
    indicatePath(parent, source, destination)
}

const djkSaw = (candidates) => {
    let minMax = djkSawGetMinMax(candidates);
    let normalized = _.map(candidates, (el) => djkSawNormalize(el, minMax));
    let rankResult = _.map(normalized, (el) => djkSawCalculateRank(el));
    return rankResult
}

const djkSawGetMinMax = (candidates) => {
    let resMinMax = {}
    _.map(listCriteriaWeight, (el) => {
        resMinMax[el['criteria']] = el['type'] ==  'benefit' ? _.minBy(candidates, el['criteria'])[el['criteria']] : _.maxBy(candidates, el['criteria'])[el['criteria']]
    })
    return resMinMax
}

const djkSawNormalize = (candidate, minMax) => {
    _.map(listCriteriaWeight, (el) => {
        candidate[el['criteria']] = el['type'] ==  'benefit' ? minMax[el['criteria']] / candidate[el['criteria']] : candidate[el['criteria']] / minMax[el['criteria']]
    })
    return candidate;
}

const djkSawCalculateRank = (candidate) => {
    let total = 0
    _.map(listCriteriaWeight, (el) => {
        total += (candidate[el['criteria']] * el['weight'])
    })

    const result = {
        edge: candidate.edge,
        total: total
    }
    return result;
}