const fuzzyTopsis = async () => {
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
                console.log('candidates')
                console.log(candidates)
                result = saw(candidates)
                resultMax = _.maxBy(result, 'total')
                
                _.map(_.cloneDeep(result), (e) => {
                    source < e['Node'] ? $(`#line-${source}-${e['Node']}`).text(Math.floor(e['total']*10000)/10000) : $(`#line-${e['Node']}-${source}`).text(Math.floor(e['total']*10000)/10000)
                })
                
                await indicatePath([], source, resultMax['Node'])
                source = resultMax['Node']
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

const topsis = (candidates) => {
    let normalized = tpsNormalize(_.cloneDeep(candidates))
    console.log('normalized')
    console.log(normalized)
    let normalizedWeight = tpsWeightNormalize(_.cloneDeep(normalized))
    console.log('normalizedWeight')
    console.log(normalizedWeight)
    let idealBestWorst = tpsIdealBestWorst(_.cloneDeep(normalizedWeight))
    console.log('idealBestWorst')
    console.log(idealBestWorst)
    let distanceBestWorst = _.map(_.cloneDeep(normalizedWeight), (el) => tpsDistanceBestWorst(el, _.cloneDeep(idealBestWorst)))
    console.log('distanceBestWorst')
    console.log(distanceBestWorst)
    let rankResult = _.map(_.cloneDeep(distanceBestWorst), (el) => tpsPerformanceScore(el))
    console.log('rankResult')
    console.log(rankResult)
    return rankResult
}

const tpsNormalize = (candidate) => {
    tmp = _.cloneDeep(candidate)
    _.map(listCriteriaWeight, (el) => {        
        _.map(tmp, (e) => {
            e[el['criteria']] = e[el['criteria']] / Math.sqrt(_.sumBy(candidate, function(n) { return n[el['criteria']]**2; }))
        })
    })
    return tmp;
}

const tpsWeightNormalize = (candidate) => {
    _.map(listCriteriaWeight, (el) => {
        _.map(candidate, (e) => {
            e[el['criteria']] = e[el['criteria']] * el['weight']
        })
    })
    return candidate;
}

const tpsIdealBestWorst = (candidate) => {
    let listBestWorst = {}
    _.map(listCriteriaWeight, (el) => {
        bestWorst = {}
        bestWorst['best'] = el['type'] == 'cost' ? _.minBy(candidate, el['criteria'])[el['criteria']] : _.maxBy(candidate, el['criteria'])[el['criteria']]
        bestWorst['worst'] = el['type'] == 'cost' ? _.maxBy(candidate, el['criteria'])[el['criteria']] : _.minBy(candidate, el['criteria'])[el['criteria']]
        listBestWorst[el['criteria']] = bestWorst
    })
    return listBestWorst;
}

const tpsDistanceBestWorst = (candidate, bestWorst) => {
    let bestSumPow = 0
    let worstSumPow = 0
    _.map(listCriteriaWeight, (el) => {
        bestSumPow += Math.pow((candidate[el['criteria']] - bestWorst[el['criteria']]['best']), 2)
        worstSumPow += Math.pow((candidate[el['criteria']] - bestWorst[el['criteria']]['worst']), 2)
    })
    candidate['siPositive'] = Math.sqrt(bestSumPow)
    candidate['siNegative'] = Math.sqrt(worstSumPow)
    return candidate;
}


const tpsPerformanceScore = (candidate) => {
    let total = (candidate['siNegative'] / (candidate['siNegative']+candidate['siPositive']))

    const result = {
        Node: candidate.Node,
        total: total
    }
    return result;
}