const fuzzySaw = async () => {
    let source = Number($('#source-node').val())
    let destination = Number($('#destination-node').val())

    visited.push(source)
    let sumCriteria = {}
    let routeNode = []
    let arrived = false
    while (!arrived) {
        if(source == destination){
            visited.push(destination)
            arrived = true
        }

        let sourceRelation = []

        _.map(nodeRelation, (el) => {
            let elArr = _.map(el.split('-'), (j) => { return Number(j)})
            if(elArr.includes(source)){
                _.map(elArr, (e) => {
                    if(e != source && !visited.includes(e)) sourceRelation.push(e)
                })
            }
        })
        console.log(sourceRelation)
        if(sourceRelation.length == 1){
            if (Number(sourceRelation[0]) == destination) {
                await indicatePath([], source, sourceRelation[0])
                visited.push(destination)
                arrived = true
            } else {
                await indicatePath([], source, sourceRelation[0])
                source = sourceRelation[0]
                visited.push(source)
            }
        } else {
            if (sourceRelation.includes(destination)) {
                await indicatePath([], source, destination)
                visited.push(destination)
                arrived = true
            } else {
                let candidates = _.map(sourceRelation, (el) => {
                    return {...listNodeCriteria[el]}
                })
    
                result = _.maxBy(saw(candidates), 'total')
                await indicatePath([], source, result['Node'])
                source = result['Node']
                visited.push(source)
                console.log(result)
                if(source == destination) arrived = true                
            }
        }
    }

    routeNode = _.map(_.drop(visited), (el) => {
        return {...listNodeCriteria[Number(el)]}
    })

    _.map(listCriteriaWeight, (el) => {
        sumCriteria[el['criteria']] = _.sumBy(routeNode, el['criteria'])
    })
    
    printRouteSum(routeNode, sumCriteria)
    console.log(routeNode)
    console.log(sumCriteria)
}

const saw = (candidates) => {
    let minMax = getMinMax(candidates);
    let normalized = _.map(candidates, (el) => normalize(el, minMax));
    let rankResult = _.map(normalized, (el) => calculateRank(el));
    return rankResult
}

const getMinMax = (candidates) => {
    let resMinMax = {}
    _.map(listCriteriaWeight, (el) => {
        resMinMax[el['criteria']] = el['type'] ==  'cost' ? _.minBy(candidates, el['criteria'])[el['criteria']] : _.maxBy(candidates, el['criteria'])[el['criteria']]
    })
    return resMinMax
}

const normalize = (candidate, minMax) => {
    _.map(listCriteriaWeight, (el) => {
        candidate[el['criteria']] = el['type'] ==  'cost' ? minMax[el['criteria']] / candidate[el['criteria']] : candidate[el['criteria']] / minMax[el['criteria']]
    })
    return candidate;
}

const calculateRank = (candidate) => {
    let total = 0
    _.map(listCriteriaWeight, (el) => {
        total += (candidate[el['criteria']] * el['weight'])
    })

    const result = {
        Node: candidate.Node,
        total: total
    }
    return result;
}

const printRouteSum = (routeNode, sumCriteria) => {
    let p = $(document.createElement('p'))
    p.append('ROUTE :<br>')
    _.map(routeNode, (el) => {
        p.append(`> Node ${el['Node']}<br>`)
    })
    
    p.append('<br>TOTAL :<br>')
    _.map(sumCriteria, (el, i) => {
        p.append(`> ${i}: ${el}<br>`)
    })
    $('.path').css('padding', '1rem')
    $('.path').append(p)
}