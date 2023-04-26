const ONE_HUNDRED = 100; 

export function calculatePossAgainstFrance(posForFrance : number[]){
    let posAgainst : number[] = []
    for(let i = 0 ; i < posForFrance.length; ++i){
        posAgainst.push(ONE_HUNDRED - posForFrance[i])
    }

    return posAgainst
}
