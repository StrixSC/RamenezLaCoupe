<script lang="ts">
    import * as d3 from "d3";

    import type { Dimensions } from "../models/dimensions";
    import { onMount } from "svelte";
    import { findMaximumKeyValue, getHighestColumnKey, parseData } from "../utils/viz3-helpers";

    export let datafile: string;

    const margins = { top: 80, right: 0, bottom: 80, left: 55 } as Dimensions;
    let bounds;
    let svgSize;
    let graphSize;
    const colors = [
        '#ad8c2f',
        '#97a515',
        '#8a766b',
        '#781d20',
        '#9b7f68',
        '#b0714c',
        '#a13d79',
    ]

    const X_PADDING = 0.15;
    const SUB_X_PADDING = 0.015;

    onMount(async () => {
        d3.csv(datafile).then((data) => {
            const xScale = d3.scaleBand().padding(X_PADDING)
            const xSubgroupScale = d3.scaleBand().padding(SUB_X_PADDING);
            const yScale = d3.scaleLinear();

            const colNames = Object.values(data.splice(0, 1)[0]).slice(1) as string[];
            const colKeys = Object.keys(data[0]).slice(1);
            const parsedData = parseData(colKeys, data).slice(0, 3);
            const highestColumnKey = getHighestColumnKey(colKeys, parsedData)


            const colorScale = d3.scaleOrdinal().range(colors).domain(colKeys);

            // Generate graph:
            const g = d3.select('.graph')
                .select('svg')
                .append('g')
                .attr('id', 'graph-g')
                .attr('transform',
                'translate(' + margins.left + ',' + margins.top + ')')

            g.append('g')
                .attr('class', 'x axis')

            g.append('g')
                .attr('class', 'y axis')

            g.append('text')
                .text('Comparaison de la performance des joueurs de la France')
                .style('text-anchor', 'middle')
                .attr('class', 'title')

            setSizing()
            build()

            function setSizing () {
                bounds = (d3.select('.graph').node() as any).getBoundingClientRect()

                svgSize = {
                    width: bounds.width,
                    height: 600
                }

                graphSize = {
                    width: svgSize.width - margins.right - margins.left,
                    height: svgSize.height - margins.bottom - margins.top
                }

                d3.select('#bar-chart').select('svg')
                    .attr('width', svgSize.width)
                    .attr('height', svgSize.height)
            }

            function build () {
                d3.select('.y.axis-text')
                    .attr('x', -50)
                    .attr('y', graphSize.height / 2)

                d3.select('.title')
                    .attr('x', graphSize.width / 2)
                    .attr('y', -35)

                const xGroups = parsedData.map((d) => d.player);
                const xSubgroups = colNames;
                xScale.domain(xGroups).range([0, graphSize.width]);
                xSubgroupScale.domain(xSubgroups).range([0, xScale.bandwidth()]);
                yScale.domain([0, findMaximumKeyValue(colKeys, parsedData)]).range([graphSize.height, 0]);

                d3.select('.x.axis')
                    .attr('transform', `translate(0,${graphSize.height})`)
                    .call((d3.axisBottom(xScale) as any).tickFormat(x => x.split(' ')[1]))
                    
                d3.select('.y.axis').call((d3.axisLeft(yScale) as any).ticks(5))
                d3.select("#graph-g")
                .selectAll(".group")
                .data(parsedData)
                .join("g")
                .attr("class", "group")
                .attr("transform", (group) => `translate(${xScale(group.player as string)})`);
             
                d3.select("#graph-g")
                .selectAll(".group")
                .selectAll("rect")
                .data((d: any) => d)
                .join("rect")
                .attr("width", xSubgroupScale(xSubgroups[1])! - xSubgroupScale(xSubgroups[0])!)
                .attr("height", (d: any) => graphSize.height - yScale(d[highestColumnKey]))
                .attr("x", (d: any) => {
                    console.log(d)
                    return xSubgroupScale(Object.keys(d)[0])!
                })
                .attr("y", (d: any) => yScale(d[Object.keys(d)[0]]))
                .style("fill", (d: any) => colorScale(Object.keys(d)[0]) as string)
            }

            window.addEventListener('resize', () => {
                setSizing()
                build()
            })
        });
    });
</script>

<div class="graph" id="bar-chart">
    <svg class="main-svg"></svg>
</div>
