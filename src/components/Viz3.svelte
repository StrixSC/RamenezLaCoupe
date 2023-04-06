<script lang="ts">
    import * as d3 from "d3";

    import type { Dimensions } from "../models/dimensions";
    import { onMount } from "svelte";

    export let datafile: string;

    const margins = {
        top: 10,
        left: 50,
        right: 30,
        bottom: 10,
    } as Dimensions;

    const width = 1000 - margins.left - margins.right;
    const height = 1000 - margins.top - margins.bottom;
    let processedData: Map<string, Object> = new Map<string, Object>();
    let opponentTotal;
    let squadTotal;

    onMount(async () => {
        let svg = d3
            .select("#viz3")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);

        d3.csv(datafile).then(function (data) {
            // Remove Opponent Total and Squad Total from list of players:
            opponentTotal = data.find((d) => d["Player"] === "Opponent Total");
            squadTotal = data.find((d) => d["Player"] === "Squad Total");
            data.sort(
                (a, b) =>
                    parseInt(b["StandardxG"]!) - parseInt(a["StandardxG"]!)
            );
            for (const d of data) {
                const entityName = d["Player"];
                if (
                    entityName === opponentTotal["Player"] ||
                    entityName === squadTotal["Player"]
                ) {
                    continue;
                }

                processedData.set(entityName!, d);
            }

            const subgroups = data.columns.slice(4, 7);
            const groups = [...processedData.keys()].slice(0, 3);

            const x = d3
                .scaleBand()
                .domain(groups)
                .range([0, width])
                .padding(0.2);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickSize(0));

            var y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
            svg.append("g").call(d3.axisLeft(y));
        });
    });
</script>

<div id="viz3" />
