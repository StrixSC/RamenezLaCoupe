<script lang="ts">
    import * as d3 from "d3";
    import scrollama from "scrollama";

    import { onMount } from "svelte";
    import {
        getLargestValue,
        getDataGroups,
        getDataSubgroups,
        transformData,
    } from "../utils/viz3-helpers";
    import type { PlayerData } from "src/models/france-player-data";

    let container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let text: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    let step: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>
    let scroller: scrollama.ScrollamaInstance;
    let bounds: DOMRect;
    let svgSize: { width: number, height: number };
    let graphSize: { width: number, height: number };

    const handleStepEnter = (response: any) => {
        // response = { element, direction, index }

        // fade in current step
        step.classed("is-active", (_, i) => {
            return i === response.index;
        });

        // update graphic based on step here
        const stepData = parseFloat(response.element.getAttribute('data-step-viz3'));
        currentStep = stepData - 1;
        if (currentStep >= _data.length) {
            currentStep = 0;
        }
        build();
    };

    let _data: PlayerData[][] = [];
    let _columns: string[][] = [];
    let currentStep = 0;
    const margins = { top: 80, right: 0, bottom: 80, left: 55 };

    const X_PADDING = 0.15;
    const SUB_X_PADDING = 0.015;

    const colors = [
        "#74ae59",
        "#334e69",
        "#d0af76",
        "#f64999",
        "#54d8f8",
        "#69cccf",
        "#70ff6b",
    ];

    onMount(async () => {
        container = d3.select("#scroll-viz3");
        text = container.select(".scroll__text-viz3");
        step = text.selectAll(".step-viz3");
        scroller = scrollama();
        scroller.setup({
            step: ".scroll__text-viz3 .step-viz3", // the step elements
            offset: 0.6, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);


        Promise.all([
            d3
                .csv("/data/PlayerStats/France/Offensive_1.csv")
                .then((data) => {
                    const [columns, __data] = transformData(data);
                    _columns.push(columns);
                    _data.push(__data);
                })
                .catch((e) => {
                    console.error(e);
                    _data.push([]);
                }),
            d3
                .csv("/data/PlayerStats/France/Offensive_2.csv")
                .then((data) => {
                    const [columns, __data] = transformData(data);
                    _columns.push(columns);
                    _data.push(__data);
                })
                .catch((e) => {
                    console.error(e);
                    _data.push([]);
                }),
        ]).then(() => {
            setSizing();
            build();
            buildLegend();
        });

        // Generate graph:
        const g = d3
            .select(".graph-viz3")
            .select("svg")
            .append("g")
            .attr("id", "graph-g-viz3")
            .attr(
                "transform",
                "translate(" + margins.left + "," + margins.top + ")"
        );

        g.append("g").attr("class", "x-axis-viz3");
        g.append("g").attr("class", "y-axis-viz3");

        setSizing();
        build();

        
        window.addEventListener("resize", () => {
            setSizing();
            build();
        });
    });

    function setSizing() {
            bounds = (
                d3.select(".graph-viz3").node() as any
            ).getBoundingClientRect();

            svgSize = {
                width: bounds.width,
                height: 600,
            };

            graphSize = {
                width: svgSize.width - margins.right - margins.left,
                height: svgSize.height - margins.bottom - margins.top,
            };

            d3.select("#bar-chart-viz3")
                .select("svg")
                .attr("width", svgSize.width)
                .attr("height", svgSize.height);
        }

        function buildLegend() {
            
        }

        function build() {
            const groups = getDataGroups(_data[currentStep]);
            const subgroups = getDataSubgroups(_data[currentStep]);
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
                .domain([0, getLargestValue(_data[currentStep])]);
            const colorScale = d3
                .scaleOrdinal()
                .range(colors)
                .domain(subgroups);

            // Title:
            d3.select(".title")
                .attr("x", graphSize.width / 2)
                .attr("y", -35);

            // X-Axis:
            d3.select(".x-axis-viz3")
                .attr("font-size", "12px")
                .attr("transform", `translate(0,${graphSize.height})`)
                .call((d3.axisBottom(xScale) as any).tickFormat((x) => x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");

            // Y Axis:
            d3.select(".y-axis-viz3").call((d3.axisLeft(yScale) as any).ticks(5));

            // Groups:
            d3.select("#graph-g-viz3")
                .selectAll(".group")
                .data(_data[currentStep])
                .join("g")
                .attr("class", "group")
                .attr(
                    "transform",
                    (data: PlayerData) => `translate(${xScale(data.player)})`
                );

            // Subgroups:
            d3.select("#graph-g-viz3")
                .selectAll(".group")
                .selectAll("rect")

                .data((d: any) => [d])
                .join("rect")
                .attr("x", (d: PlayerData) => xSubgroupsScale(d.subgroup)!)
                .attr("y", graphSize.height)
                .attr("width", xSubgroupsScale.bandwidth())
                .attr("height", 0)
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
                .attr(
                    "height",
                    (d: PlayerData) => graphSize.height - yScale(d.value)
                )
                .attr("y", (d: PlayerData) => yScale(d.value));
            
            // Legend

            const svg = d3.select('.legend-viz3').attr('height', _columns[currentStep].length * 100).attr('width', 400);
            var size = 20;
            svg.selectChildren().remove();
            svg.selectAll("dots-viz3")
                .data(() => subgroups)
                .enter()
                .append("rect")
                    .attr("x", 100)
                    .attr("y", (_, i: number) => 100 + i*(size+5)) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("width", size)
                    .attr("height", size)
                    .style("fill", (d: string) => colorScale(d) as string );
            
            svg.selectAll("labels-viz3")
                .data(_columns[currentStep])
                .enter()
                .append("text")
                .attr("x", 100 + size*1.2)
                .attr("y", (_, i: number) => 100 + i*(size+5) + (size/2)) // 100 is where the first dot appears. 25 is the distance between dots
                .text((d: string) => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }

</script>

<main>
<div class="container-viz3" id="scroll-viz3">
    <div class="scroll__graphic-viz3 graph-viz3" id="bar-chart-viz3">
            <svg class="main-svg" />
            <svg class="legend-viz3" />
    </div>
    <div class="scroll__text-viz3">
        <div class="step-viz3" data-step-viz3="1">
            <h1>Step 1</h1>
        </div>
        <div class="step-viz3" data-step-viz3="2">
            <h1>Anim anim nulla aliqua consectetur exercitation voluptate sint aliquip.</h1>
            <p>
                Lorem deserunt qui deserunt anim et do ipsum est dolor aute voluptate. Cillum nisi nisi minim laboris occaecat elit ipsum. Reprehenderit cupidatat nisi est dolor consequat aute exercitation occaecat. Reprehenderit labore nostrud laboris labore culpa. Consequat proident anim nisi excepteur officia fugiat ea officia magna officia adipisicing reprehenderit ullamco.
            </p>
        </div>
        <div class="step-viz3" data-step-viz3="3">
            <h1>Step 3</h1>
        </div>
        <div class="step-viz3" data-step-viz3="4">
            <h1>Step 4</h1>
        </div>
        <div class="step-viz3" data-step-viz3="5">
            <h1>Step 5</h1>
        </div>
        <div class="step-viz3" data-step-viz3="6">
            <h1>Step 6</h1>
        </div>
        <div class="step-viz3" data-step-viz3="7">
            <h1>Step 7</h1>
        </div>
    </div>
</div>
</main>
<style>

    .graph-viz3 {
        width: 100%;
    }
</style>
