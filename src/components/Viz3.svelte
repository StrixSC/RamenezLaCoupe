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

    const handleStepEnter = (response: any) => {
        // response = { element, direction, index }

        // fade in current step
        step.classed("is-active", (_, i) => {
            return i === response.index;
        });

        // update graphic based on step here
        const stepData = parseFloat(response.element.getAttribute('data-step'));
        console.log(stepData);
    };

    let _data: PlayerData[][] = [];
    let current: PlayerData[] = [];
    const margins = { top: 80, right: 0, bottom: 80, left: 55 };

    const X_PADDING = 0.15;
    const SUB_X_PADDING = 0.015;

    let container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let graphic: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let chart: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let text: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    let step: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>
    let scroller: scrollama.ScrollamaInstance;
    let bounds: DOMRect;
    let svgSize: { width: number, height: number };
    let graphSize: { width: number, height: number };

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
        container = d3.select("#scroll");
        graphic = container.select(".scroll__graphic");
        chart = graphic.select(".chart");
        text = container.select(".scroll__text");
        step = text.selectAll(".step");
        scroller = scrollama();
        scroller.setup({
            step: ".scroll__text .step", // the step elements
            offset: 0.5, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);


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
                .attr("font-size", "12px")
                .attr("transform", `translate(0,${graphSize.height})`)
                .call((d3.axisBottom(xScale) as any).tickFormat((x) => x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");

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
        }

        window.addEventListener("resize", () => {
            setSizing();
            build();
        });
    });
</script>

<div class="container" id="scroll">
    <div class="scroll__graphic">
        <div class="graph" id="bar-chart">
            <svg class="main-svg" />
        </div>
    </div>
    <div class="scroll__text">
        <div class="step" data-step="1">
            <h1>Step 1</h1>
        </div>
        <div class="step" data-step="2">
            <h1>Anim anim nulla aliqua consectetur exercitation voluptate sint aliquip.</h1>
            <p>
                Lorem deserunt qui deserunt anim et do ipsum est dolor aute voluptate. Cillum nisi nisi minim laboris occaecat elit ipsum. Reprehenderit cupidatat nisi est dolor consequat aute exercitation occaecat. Reprehenderit labore nostrud laboris labore culpa. Consequat proident anim nisi excepteur officia fugiat ea officia magna officia adipisicing reprehenderit ullamco.
            </p>
        </div>
        <div class="step" data-step="3">
            <h1>Step 3</h1>
        </div>
        <div class="step" data-step="4">
            <h1>Step 4</h1>
        </div>
        <div class="step" data-step="5">
            <h1>Step 5</h1>
        </div>
        <div class="step" data-step="6">
            <h1>Step 6</h1>
        </div>
        <div class="step" data-step="7">
            <h1>Step 7</h1>
        </div>
    </div>
</div>

<style>
    * {
        font-family: Georgia, "Times New Roman", Times, serif !important;
    }

    :global(.hoverable-element:hover) {
        cursor: pointer;
        text-decoration: underline;
    }

    #scroll {
        position: relative;
        width: 100%;
        height: 100vh;
    }

    .scroll__graphic {
        position: fixed;
        top: 0;
        right: 0;
        bottom: auto;
        width: 50%;
        height: 100%;
    }

    .scroll__text {
        padding: 0 1rem;
        height: 100%;
        width: 40%;
    }

    .step {
        opacity: 0;
        border: 1px solid palevioletred;
        padding: 1rem;
        min-height: 100%;
    }

    :global(.step.is-active) {
        opacity: 1;
    }

    :global(.scroll__graphic.is-fixed) {
        position: fixed;
    }

    :global(.scroll__graphic.is-bottom) {
        bottom: 0;
        top: auto;
    }
</style>
