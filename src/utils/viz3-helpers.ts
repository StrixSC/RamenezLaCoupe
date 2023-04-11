import type { PlayerData } from "src/models/france-player-data";

export const transformData = (data: Object[]) => {
    let n: PlayerData[] = [];
    for (const d of data) {
        const tmp: PlayerData[] = [];
        const keys = Object.keys(d);
        for (const k of keys) {
            if (k === "player") {
                continue;
            }
            tmp.push({
                player: (d as any).player!.split(" ")[1],
                subgroup: k,
                value: Number(d[k]),
            } as PlayerData);
        }
        n = n.concat(tmp);
    }

    return n.sort((a, b) => b.value - a.value).filter((d) => d.value !== 0);
};

export const findMaximumKeyValue = (keys: string[], data: Object[]) => {
    let maximum = 0;
    for (const object of data) {
        const values: number[] = Object.values(object).filter(
            (v) => typeof v === "number"
        );
        maximum = Math.max(...values, maximum);
    }
    return maximum;
};

export const getHighestColumnKey = (keys: string[], data: Object[]) => {
    let highestKey = keys[0];
    let highestKeyValue = 0;
    for (const key of keys) {
        const keyValues: number[] = data
            .map((d) => d[key])
            .filter((d) => typeof d === "number");
        const maximum = Math.max(...keyValues);
        if (highestKeyValue < maximum) {
            highestKey = key;
            highestKeyValue = maximum;
        }
    }
    return highestKey;
};

export const getDataGroups = (data: PlayerData[]): string[] => {
    return [...new Set(data.map((d) => d.player))];
};

export const getDataSubgroups = (data: PlayerData[]): string[] => {
    return [...new Set(data.map((d) => d.subgroup))];
};

export const getLargestValue = (data: PlayerData[]): number => {
    return Math.max(...data.map((d) => d.value));
};
