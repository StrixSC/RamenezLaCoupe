import type { PlayerData } from "src/models/player-data";

export const transformData = (data: Object[]): [string[], PlayerData[]] => {
    let n: PlayerData[] = [];
    const columns = data.shift() as PlayerData;
    const columnTitles = Object.keys(columns)
        .map((k) => columns[k])
        .filter((v) => v != "Player");
    for (const d of data) {
        const tmp: PlayerData[] = [];
        const keys = Object.keys(d);
        for (const k of keys) {
            if (k === "player") {
                continue;
            }
            tmp.push({
                name: (d as any).player!.split(" ")[1],
                country: (d as any).squad!.split(" ")[1],
                axis: k,
                value: Number(d[k]),
            } as PlayerData);
        }
        n = n.concat(tmp);
    }
    return [columnTitles!, n.sort((a, b) => b.value - a.value)];
};

export const getBaselineValues = (data: Object[]) => {
    let map = new Map();
    for (const value of data as PlayerData[]) {
        if (!map.has(value.axis)) {
            map.set(value.axis, [value.value]);
        } else {
            let currentAxisData: number[] = map.get(value.axis);
            currentAxisData.push(value.value);
            map.set(value.axis, currentAxisData);
        }
    }
    let regroupedData: PlayerData[] = [];
    map.forEach((values, keys) => {
        regroupedData.push({
            name: "Baseline",
            country: "",
            axis: keys,
            value: getAverageStatValue(values),
        } as PlayerData);
    });
    return regroupedData;
};

const getAverageStatValue = (array: []) => {
    const sum = array.reduce((a, b) => a + b, 0);
    return (sum / array.length).toFixed(2) || 0;
};

export const getRegroupPlayers = (data: Object[]) => {
    let map = new Map();
    for (const value of data as PlayerData[]) {
        if (!map.has(value.name)) {
            map.set(value.name, [value]);
        } else {
            let currentPlayerData: PlayerData[] = map.get(value.name);
            currentPlayerData.push(value);
            map.set(value.name, currentPlayerData);
        }
    }
    let regroupedData: PlayerData[][] = [];
    map.forEach((values, keys) => {
        regroupedData.push(values);
    });
    return regroupedData;
};
