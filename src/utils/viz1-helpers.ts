import type { GameSummaryData } from "src/models/game-summary-data";

export const transformGameData = (data: Object[]) => {

    let n : GameSummaryData[] = [];
    for (const d of data) {
        
        // console.log(d)

        var obj = {};

        obj['opponent'] = d['Opponent'].split(' ')[1];
        obj['xGF'] = parseFloat(d['xG']);
        obj['xGA'] = parseFloat(d['xGA']);

        if (d['GF'].includes("(")){
            obj['GF'] = parseFloat(d['GF'].split(' ')[0]);
        } else {
            obj['GF'] = parseFloat(d['GF']);
        }

        if (d['GA'].includes("(")){
            obj['GA'] = parseFloat(d['GA'].split(' ')[0]);
        } else {
            obj['GA'] = parseFloat(d['GA']);
        }
        
        obj['result'] = d['Result'];
        obj['date'] = d['Date'];
        obj['time'] = d['Time'];

        n.push(obj as GameSummaryData)

    }

    return n;
}

export const getMaxGoals = (data: GameSummaryData[]) => {
    let maxGoals = 0;

    for (const d of data) {
        if (d.GF > maxGoals) {
            maxGoals = d.GF;
        }
        if (d.GA > maxGoals) {
            maxGoals = d.GA;
        }
        if (d.xGF > maxGoals) {
            maxGoals = d.xGF;
        }
        if (d.xGA > maxGoals) {
            maxGoals = d.xGA;
        }
    }
    
    return Number(maxGoals + 0.5);
}