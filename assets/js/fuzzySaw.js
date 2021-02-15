const fuzzySaw = () => {
    let source = Number($('#source-node').val())
    let destination = Number($('#destination-node').val())

    visited.push(source)
    let sumCriteria = {}
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
                indicatePath([], source, sourceRelation[0])
                visited.push(destination)
                arrived = true
            } else {
                indicatePath([], source, sourceRelation[0])
                source = sourceRelation[0]
                visited.push(source)
            }
        } else {
            let candidates = _.map(sourceRelation, (el) => {
                return {...listNodeCriteria[el]}
            })

            result = _.maxBy(saw(candidates), 'total')
            indicatePath([], source, result['Node'])
            source = result['Node']
            visited.push(source)
            console.log(result)
        }
    }

    routeNode = _.map(_.drop(visited), (el) => {
        return {...listNodeCriteria[Number(el)]}
    })

    _.map(listCriteriaWeight, (el) => {
        sumCriteria[el['criteria']] = _.sumBy(routeNode, el['criteria'])
    })
    
    console.log(routeNode)
    console.log(sumCriteria)
}

const saw = (candidates) => {
    // console.log(candidates)
    const minMax = getMinMax(candidates);
    // console.log(minMax)
    const normalized = _.map(candidates, (el) => normalize(el, minMax));
    // console.log(normalized)
    const rankResult = _.map(normalized, (el) => calculateRank(el));
    console.log(rankResult)
    return rankResult
}

const getMinMax = (candidates) => {
    let resMinMax = {}
    _.map(listCriteriaWeight, (el) => {
        resMinMax[el['criteria']] = _.minBy(candidates, el['criteria'])[el['criteria']]
    })
    return resMinMax
}

const normalize = (candidate, minMax) => {
    _.map(listCriteriaWeight, (el) => {
        candidate[el['criteria']] = minMax[el['criteria']] / candidate[el['criteria']]
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