import type { PlayerData } from "src/models/player-data";

export const Stats = {
    Minutes: "Minutes Played / 50",
    Shots: "Shots / 2",
    SoT: "SoT",
    Touches: "Touches / 30",
    Passes: "Passes / 20",
    Tackles: "Tackles",
    Blocks: "Blocks",
    Interceptions: "Interceptions",
};

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

export const getBaselineValues = (data: Object[], name: String) => {
    let map = new Map();
    for (const value of data as PlayerData[]) {
        if (!map.has(value.axis)) {
            map.set(value.axis, [normalizeValue(value).value]);
        } else {
            let currentAxisData: number[] = map.get(value.axis);
            currentAxisData.push(normalizeValue(value).value);
            map.set(value.axis, currentAxisData);
        }
    }
    let regroupedData: PlayerData[] = [];
    map.forEach((values, keys) => {
        regroupedData.push({
            name: name,
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

export const getFranceValues = (data: Object[]) => {
    let map = new Map();
    for (const value of data as PlayerData[]) {
        if (!map.has(value.name)) {
            map.set(value.name, [normalizeValue(value)]);
        } else {
            let currentPlayerData: PlayerData[] = map.get(value.name);
            currentPlayerData.push(normalizeValue(value));
            map.set(value.name, currentPlayerData);
        }
    }
    let regroupedData: PlayerData[][] = [];
    map.forEach((values, keys) => {
        regroupedData.push(values);
    });
    return regroupedData;
};

const normalizeValue = (playerData: PlayerData) => {
    let normalizedPlayerData: PlayerData = playerData;
    switch (playerData.axis) {
        case Stats.Minutes:
            normalizedPlayerData.value = normalizedPlayerData.value / 50;
            break;
        case Stats.Shots:
            normalizedPlayerData.value = normalizedPlayerData.value / 2;
            break;
        case Stats.SoT:
            break;
        case Stats.Touches:
            normalizedPlayerData.value = normalizedPlayerData.value / 30;
            break;
        case Stats.Passes:
            normalizedPlayerData.value = normalizedPlayerData.value / 20;
            break;
        case Stats.Tackles:
            break;
        case Stats.Tackles:
            break;
    }
    return normalizedPlayerData;
};
