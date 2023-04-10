<script lang="ts">
    import * as d3 from "d3";

    import { onMount } from "svelte";
    import {
        getLargestValue,
        getDataGroups,
        getDataSubgroups,
        transformData,
    } from "../utils/viz3-helpers";
    import type { PlayerData } from "src/models/france-player-data";

    let _data: PlayerData[][] = [];
    let current: PlayerData[] = [];
    const margins = { top: 80, right: 0, bottom: 80, left: 55 };

    const X_PADDING = 0.15;
    const SUB_X_PADDING = 0.015;

    let bounds;
    let svgSize;
    let graphSize;
    const colors = [
        "#74ae59",
        "#334e69",
        "#d0af76",
        "#f64999",
        "#54d8f8",
        "#69cccf",
        "#70ff6b",
    ];

    const font = "Georgia"

    onMount(async () => {
        Promise.all([
            d3
                .csv("/src/data/PlayerStats/France/Offensive_1.csv")
                .then((data) => _data.push(transformData(data)))
                .catch((e) => {
                    console.error(e);
                    _data.push([]);
                }),
            d3
                .csv("/src/data/PlayerStats/France/Offensive_2.csv")
                .then((data) => _data.push(transformData(data)))
                .catch((e) => {
                    console.error(e);
                    _data.push([]);
                }),
        ]).then(() => {
            current = _data[0];
            setSizing();
            build();
        });

        // Generate graph:
        const g = d3
            .select(".graph")
            .select("svg")
            .append("g")
            .attr("id", "graph-g")
            .attr(
                "transform",
                "translate(" + margins.left + "," + margins.top + ")"
            );

        g.append("g").attr("class", "x axis");

        g.append("g").attr("class", "y axis");

        setSizing();
        build();

        function setSizing() {
            bounds = (
                d3.select(".graph").node() as any
            ).getBoundingClientRect();

            svgSize = {
                width: bounds.width,
                height: 600,
            };

            graphSize = {
                width: svgSize.width - margins.right - margins.left,
                height: svgSize.height - margins.bottom - margins.top,
            };

            d3.select("#bar-chart")
                .select("svg")
                .attr("width", svgSize.width)
                .attr("height", svgSize.height);
        }

        function build() {
            const groups = getDataGroups(current);
            const subgroups = getDataSubgroups(current);
            const xScale = d3
                .scaleBand()
                .rangeRound([0, graphSize.width])
                .padding(X_PADDING)
                .domain([...groups]);
            const xSubgroupsScale = d3
                .scaleBand()
                .padding(SUB_X_PADDING)
                .domain(subgroups)
                .rangeRound([0, xScale.bandwidth()]);
            const yScale = d3
                .scaleLinear()
                .rangeRound([graphSize.height, 0])
                .domain([0, getLargestValue(current)]);
            const colorScale = d3
                .scaleOrdinal()
                .range(colors)
                .domain(subgroups);

            // Title:
            d3.select(".title")
                .attr("x", graphSize.width / 2)
                .attr("y", -35);

            // X-Axis:
            d3.select(".x.axis")
                .attr("transform", `translate(0,${graphSize.height})`)
                .call((d3.axisBottom(xScale) as any).tickFormat((x) => x));

            // Y Axis:
            d3.select(".y.axis").call((d3.axisLeft(yScale) as any).ticks(5));

            // Groups:
            d3.select("#graph-g")
                .selectAll(".group")
                .data(current)
                .join("g")
                .attr("class", "group")
                .attr(
                    "transform",
                    (data: PlayerData) => `translate(${xScale(data.player)})`
                );

            // Subgroups:
            d3.select("#graph-g")
                .selectAll(".group")
                .selectAll("rect")

                .data((d: any) => [d])
                .join("rect")
                .attr("x", (d: PlayerData) => xSubgroupsScale(d.subgroup)!)
                .attr("y", (d: PlayerData) => yScale(d.value))
                .attr("width", xSubgroupsScale.bandwidth())
                .attr(
                    "height",
                    (d: PlayerData) => graphSize.height - yScale(d.value)
                )
                .attr("class", "hoverable-element")
                .style(
                    "fill",
                    (d: PlayerData) => colorScale(d.subgroup) as string
                )
                .on("mouseover", function (_, d: PlayerData) {
                    d3.select(this).style(
                        "fill",
                        d3
                            .color(colorScale(d.subgroup) as string)!
                            .darker(0.2)
                            .formatRgb()
                    );
                })
                .on("mouseout", function (_, d: PlayerData) {
                    d3.select(this).style(
                        "fill",
                        colorScale(d.subgroup) as string
                    );
                })
                .transition()
                .duration(1000)
        }

        window.addEventListener("resize", () => {
            setSizing();
            build();
        });
    });
</script>

<div class="graph" id="bar-chart">
    <svg class="main-svg" />
</div>

<style>
    * {
        font-family: Georgia, "Times New Roman", Times, serif !important;
    }

    :global(.hoverable-element:hover) {
        cursor: pointer;
        text-decoration: underline;
    }

    :global(.tick) {
        font-size: 8px;
    }
</style>
