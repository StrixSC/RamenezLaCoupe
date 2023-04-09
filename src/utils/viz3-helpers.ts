export const parseData = (keys: string[], data: Object[]) => {
    const returnData: any[] = [];
    for (const d of data) {
        const tmp = {};
        for (const key of keys) {
            tmp[key] = Number(d[key]);
        }

        returnData.push({...tmp, player: (d as any).player});
    }
    return returnData;
}

export const findMaximumKeyValue = (keys: string[], data: Object[]) => {
    let maximum = 0;
    for (const object of data) {
        const values: number[] = Object.values(object).filter((v) => typeof(v) === "number")
        maximum = Math.max(...values, maximum);
    }
    return maximum;
}

export const getHighestColumnKey = (keys: string[], data: Object[]) => {
    let highestKey = keys[0];
    let highestKeyValue = 0;
    for (const key of keys) {
        const keyValues: number[] = data.map((d) => d[key]).filter((d) => typeof(d) === 'number')
        const maximum = Math.max(...keyValues);
        if (highestKeyValue < maximum) {
            highestKey = key;
            highestKeyValue = maximum;
        }
    }
    return highestKey;
}