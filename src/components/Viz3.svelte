<script lang="ts">
    import * as d3 from "d3";
    import scrollama from "scrollama";
    import d3Tip from 'd3-tip'

    import { onMount } from "svelte";
    import {
        getLargestValue,
        getDataGroups,
        getDataSubgroups,
        transformData,
    } from "../utils/viz3-helpers";
    import type { PlayerData } from "src/models/france-player-data";

    let container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let text: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    let step: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
    let scroller: scrollama.ScrollamaInstance;
    let bounds: DOMRect;
    let svgSize: { width: number; height: number };
    let graphSize: { width: number; height: number };

    const handleStepEnter = (response: any) => {
        // response = { element, direction, index }

        // fade in current step
        step.classed("is-active", (_, i) => {
            return i === response.index;
        });

        // update graphic based on step here
        const stepData = parseFloat(
            response.element.getAttribute("data-step-viz3")
        );
        currentStep = stepData;
        if (currentStep >= _data.length) {
            currentStep = 0;
        }
        build();
    };

    let _data: PlayerData[][] = [];
    let _columns: string[][] = [];
    let _columnTitleWithKeys: PlayerData[] = [];
    let currentStep = 0;
    const margins = { top: 40, right: 55, bottom: 50, left: 125 };

    const X_PADDING = 0.05;
    const SUB_X_PADDING = 0.025;
    const colors = ["#fc8787", "#44BDFC", "#555555", "#0ed56d", "#6153A2"];

    const getAndParseData = (order: number, src: string) => {
        return d3
            .csv(src)
            .then((data) => {
                const [columns, __data, columnTitlesWithKeys] = transformData(data);
                return { order, columns, __data, columnTitlesWithKeys };
            })
            .catch((e) => {
                console.error(e);
                _data.push([]);
            });
    };

    onMount(async () => {
        
        container = d3.select("#scroll-viz3");
        text = container.select(".scroll__text-viz3");
        step = text.selectAll(".step-viz3");
        scroller = scrollama();
        scroller
            .setup({
                step: ".scroll__text-viz3 .step-viz3", // the step elements
                offset: 0.6, // set the trigger to be 1/2 way down screen
                debug: false, // display the trigger offset for testing
            })
            .onStepEnter(handleStepEnter);

        Promise.all([
            getAndParseData(
                1,
                "/data/PlayerStats/France/Offensive_1_Goals_And_Shots.csv"
            ),
            getAndParseData(
                2,
                "/data/PlayerStats/France/Offensive_2_Kicks.csv"
            ),
            getAndParseData(
                3,
                "/data/PlayerStats/France/Offensive_3_Goals_And_Expected_Goals.csv"
            ),
            getAndParseData(
                4,
                "/data/PlayerStats/France/Defensive_1_Tackles.csv"
            ),
            getAndParseData(
                5,
                "/data/PlayerStats/France/Defensive_2_Blocks.csv"
            ),
            getAndParseData(
                6,
                "/data/PlayerStats/France/Defensive_3_Challenges.csv"
            ),
            getAndParseData(
                7,
                "/data/PlayerStats/France/Passing_1_Total_Passing.csv"
            ),
            getAndParseData(
                8,
                "/data/PlayerStats/France/Possession_1_Controls.csv"
            ),
        ]).then((values) => {
            values.sort((a, b) => a!.order - b!.order);
            for (const value of values) {
                _data.push(value!.__data);
                _columns.push(value!.columns);
                _columnTitleWithKeys.push(value!.columnTitlesWithKeys);
            }
            setSizing();
            build();
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
            width: bounds.width - 100,
            height: 900,
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
    
    function build() {
        if (_data.length <= 0) {
            return;
        }

        const groups = getDataGroups(_data[currentStep])
        const subgroups = getDataSubgroups(_data[currentStep])
        const colorScale = d3.scaleOrdinal().range(colors).domain(subgroups);

        const xScale = d3
            .scaleLinear()
            .rangeRound([0, graphSize.width])
            .domain([0, getLargestValue(_data[currentStep])]);
        const yScale = d3
            .scaleBand()
            .rangeRound([0, graphSize.height])
            .padding(X_PADDING)
            .domain(groups);
        const ySubgroupsScale = d3
            .scaleBand()
            .padding(SUB_X_PADDING)
            .domain(subgroups)
            .rangeRound([yScale.bandwidth(), 0]);

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
            .attr("dx", "0.25em")
            .attr("dy", "1em");

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
                (data: PlayerData) => `translate(0, ${yScale(data.player)})`
            );

        // Subgroups:
        d3.select("#graph-g-viz3")
            .selectAll(".group")
            .selectAll("rect")

            .data((d: any) => [d])
            .join("rect")
            .attr("x", xScale(0))
            .attr("y", (d: PlayerData) => ySubgroupsScale(d.subgroup)!)
            .attr("width", xScale(0))
            .attr("height", ySubgroupsScale.bandwidth())
            .attr("class", (d: PlayerData) => ["hoverable-element", `viz3-subgroup-${d.subgroup}`])
            .style("fill", (d: PlayerData) => colorScale(d.subgroup) as string)
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
                d3.select(this).style("fill", colorScale(d.subgroup) as string);
            })
            .transition()
            .duration(1000)
            .attr("width", (d: PlayerData) => xScale(d.value) - xScale(0))

        for (let i = 0; i < _data.length; i++) {
            const adjusedSubgroups = getDataSubgroups(_data[i])
            const adjustedColorScale = d3
                .scaleOrdinal()
                .range(colors)
                .domain(adjusedSubgroups);
            const svg = d3.select(`.legend-viz3-${i}`);
            svg.selectChildren().remove();
            svg.attr("width", 600).attr("height", _columns[i].length * 100);
            var size = 20;

            svg.selectAll("dots-viz3")
                .data(adjusedSubgroups)
                .enter()
                .append("rect")
                .attr("class", (d: string) => `viz3-${i}-subgroup-${d}`)
                .attr("x", 0)
                .attr("y", (_, j: number) => 100 + j * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", (d: string) => adjustedColorScale(d) as string);

            svg.selectAll("labels-viz3")
                .data(subgroups)
                .enter()
                .append("text")
                .attr("x", size * 1.2)
                .attr("y", (_, j: number) => 100 + j * (size + 5) + size / 2) // 100 is where the first dot appears. 25 is the distance between dots
                .text((d: string) => _columnTitleWithKeys[i][d])
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");
        }
    }
</script>

<main>
    <div class="container-viz3" id="scroll-viz3">
        <div class="scroll__graphic-viz3 graph-viz3" id="bar-chart-viz3">
            <svg class="svg-viz3 main-svg" />
        </div>
        <div class="scroll__text-viz3">
            <div class="step-viz3" data-step-viz3="0">
                <h1>Offensive: Goals and Shots</h1>
                <br />
                <p>
                    Goals, Shots on Target, and Shots Taken are key statistics
                    in analyzing a team's performance in soccer. Goals represent
                    the number of times a team successfully scores a goal during
                    a match. Shots on Target indicate the number of shots taken
                    by a team that are on target and pose a potential threat to
                    the opponent's goal. Shots Taken represent the total number
                    of shots attempted by a team during a match, including shots
                    that missed the target. This helps to provide an overview of
                    France's offensive performance in the World Cup.
                </p>
                <svg class="legend-viz3-0" />
            </div>
            <div class="step-viz3" data-step-viz3="1">
                <h1>Offensive: Kicks</h1>
                <br />
                <p>
                    In soccer, kicks are crucial in determining the outcome of a
                    match. Field Kicks refer to any kick taken during the normal
                    course of play that is not a penalty kick. <br />Penalty
                    Kicks, on the other hand, are kicks awarded to a team when
                    the opposing team commits a foul inside their own penalty
                    area.
                    <br />
                    Penalty Kicks Attempted represent the total number of penalty
                    kicks taken by a team during a tournament, including those that
                    were successfully converted into goals and those that were missed.
                    <br />This allows a comparision of the performance of
                    France's players in these different types of kicks and
                    provides an overview of the team's performance in the
                    offensive kicks category.
                </p>
                <svg class="legend-viz3-1" />
            </div>
            <div class="step-viz3" data-step-viz3="2">
                <h1>Offensive: Expected Goals</h1>
                <br />
                <p>
                    Expected Goals (xG) is a statistical measure used to
                    quantify the quality of chances created by a team during a
                    soccer match. The xG value is calculated by analyzing
                    various factors such as the location of the shot, the angle
                    of the shot, the type of pass leading to the shot, and the
                    number of defenders present in the box. A higher xG value
                    indicates a higher likelihood of a goal being scored from a
                    particular shot.
                    <br /><br />
                    Non-Penalty Expected Goals (npxG) is a subset of xG that excludes
                    penalty kicks from the calculations. It measures the likelihood
                    of a goal being scored from open play situations and thus provides
                    a more accurate assessment of a team's attacking performance.
                </p>
                <svg class="legend-viz3-2" />
            </div>
            <div class="step-viz3" data-step-viz3="3">
                <h1>Defensive: Tackles</h1>
                <br />
                <p>
                    Tackles are a key defensive action in soccer that involve a
                    player dispossessing the opponent of the ball through a
                    sliding or standing challenge. Tackles won refer to the
                    percentage of successful tackles made by a player or team,
                    while tackles in different thirds of the field refer to the
                    number of tackles made in specific areas of the field.
                    <br /><br />
                    Tackles in Defensive 1/3 refer to the number of tackles made
                    in the defensive third of the field, which is the area closest
                    to the team's own goal. Tackles in Middle 1/3 refer to the number
                    of tackles made in the middle third of the field, which is the
                    central area of the field where the game is often played. Tackles
                    in Attacking 1/3 refer to the number of tackles made in the attacking
                    third of the field, which is the area closest to the opponent's
                    goal.
                </p>
                <svg class="legend-viz3-3" />
            </div>
            <div class="step-viz3" data-step-viz3="4">
                <h1>Defensive: Blocks</h1>
                <br />
                <p>
                    Defensive Blocks are a key defensive action in soccer that
                    involve a player intercepting or blocking an opponent's shot
                    or pass.

                    <br /><br />
                    Total Blocks refer to the total number of blocks made by a player
                    or team, while Shots Blocked and Passes Blocked are subsets of
                    Total Blocks that refer to the number of shots or passes blocked
                    respectively.
                    <br /><br />
                    Shots Blocked refer to the number of shots blocked by a player
                    or team during the tournament. This includes any shot that is
                    either on target or off target.
                    <br /><br />
                    Passes Blocked refer to the number of passes blocked by a player
                    or team during the tournament. This includes any pass that is
                    intended to go to another player, either on the ground or in
                    the air.
                </p>
                <svg class="legend-viz3-4" />
            </div>
            <div class="step-viz3" data-step-viz3="5">
                <h1>Defensive: Challenges</h1>
                <br />
                <p>
                    Defensive Challenges refer to the number of times a player
                    or team attempts to win the ball back from an opponent who
                    is dribbling with the ball. The category includes three
                    subcategories: Number of Dribblers Tackled, Number of
                    Dribblers Challenged, and Number of Unsuccessful Attempts to
                    Challenge a Dribbling Player.
                    <br /><br />
                    Number of Dribblers Tackled refers to the number of times a player
                    or team successfully tackles an opponent who is dribbling with
                    the ball. This means that the player dispossesses the opponent
                    and gains control of the ball.
                    <br /><br />
                    Number of Dribblers Challenged refers to the number of times
                    a player or team attempts to tackle an opponent who is dribbling
                    with the ball. This includes both successful and unsuccessful
                    attempts.
                    <br /><br />
                    Number of Unsuccessful Attempts to Challenge a Dribbling Player
                    refers to the number of times a player or team attempts to tackle
                    an opponent who is dribbling with the ball but fails to win the
                    ball back.
                </p>
                <svg class="legend-viz3-5" />
            </div>
            <div class="step-viz3" data-step-viz3="6">
                <h1>Passing</h1>
                <br />
                <p>
                    Passes are an important aspect of soccer that involve a
                    player kicking the ball to a teammate in order to maintain
                    possession of the ball or advance it towards the opposing
                    team's goal.
                    <br /><br />
                    Total Passes Completed refer to the total number of passes successfully
                    completed by a player or team during the tournament. A pass is
                    considered completed when the intended teammate successfully
                    receives the ball.
                    <br /><br />
                    Total Passes Attempted refer to the total number of passes attempted
                    by a player or team during the tournament. This includes both
                    successful and unsuccessful passes.
                </p>
                <svg class="legend-viz3-6" />
            </div>
            <div class="step-viz3" data-step-viz3="7">
                <h1>Possessions</h1>
                <br />
                <p>
                    Possession is a crucial aspect of soccer that involves a
                    team maintaining control of the ball and preventing the
                    opposing team from gaining possession.
                    <br /><br />
                    Number of Times a Player Touched a Ball includes all instances
                    where a player comes into contact with the ball, such as passes,
                    dribbles, and shots.
                    <br /><br />
                    Number of Times a Player Controlled the Ball with Their Feet
                    includes instances where a player receives a pass, dribbles the
                    ball, or takes a shot.
                </p>
                <svg class="legend-viz3-7" />
            </div>
        </div>
    </div>
</main>

<style>
    .svg-viz3 {
        background: white !important;
        border-radius: 10px;
        margin: 2rem;
    }
    .graph-viz3 {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
