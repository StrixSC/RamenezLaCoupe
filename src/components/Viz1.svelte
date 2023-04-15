<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { transformGameData, getMaxGoals } from "../utils/viz1-helpers";

    import type { GameSummaryData } from "src/models/game-summary-data";

    let _data: GameSummaryData[] = [];

    const margins = { top: 40, right: 60, bottom: 80, left: 55 };

    let bounds;
    let svgSize;
    let graphSize;

    const legendData = [
        {
            fill: "#81BDFC",
            label: "Goals For France",
            fontweight: "bold",
        },
        {
            fill: "#fc8787",
            label: "Goals Against France",
            fontweight: "bold",
        },
        {
            fill: "url(#diagonalHatchExGF)",
            label: "(Expected Goals For France)",
            fontweight: "normal",
        },
        {
            fill: "url(#diagonalHatchExGA)",
            label: "(Expected Goals Against France)",
            fontweight: "normal",
        },
    ];

    const font = "Georgia";

    onMount(async () => {
        Promise.all([
            d3
                .csv("/data/GamesStats/ScoresAndFixtures.csv")
                .then((data) => (_data = transformGameData(data)))
                .catch((error) => console.log(error)),
        ]).then(() => {
            //console.log(_data)
            setSizing();
            build(true);
        });

        // Generate graph:
        const g = d3
            .select(".graph-viz1")
            .select("svg")
            .append("g")
            .attr("id", "graph-g")
            .attr(
                "transform",
                "translate(" + margins.left + "," + margins.top + ")"
            );

        g.append("g").attr("class", "x axis");

        g.append("g").attr("class", "y axis");

        //setSizing();
        //build();

        function setSizing() {
            bounds = (
                d3.select(".graph-viz1").node() as any
            ).getBoundingClientRect();

            svgSize = {
                width: bounds.width,
                height: 900,
            };

            graphSize = {
                width: svgSize.width - margins.right - margins.left,
                height: svgSize.height - margins.bottom - margins.top,
            };

            d3.select("#game-summary-chart")
                .select("svg")
                .attr("width", svgSize.width)
                .attr("height", svgSize.height);
        }

        function build(anime=false) {
            let maxG = getMaxGoals(_data);
            console.log(maxG);

            const xScaleF = d3
                .scaleLinear()
                .domain([0, maxG])
                .range([graphSize.width/2, 0]);

            const xAxisF = d3.axisBottom(xScaleF).ticks(10);

            const xScaleA = d3
                .scaleLinear()
                .domain([0, maxG])
                .range([graphSize.width/2, graphSize.width]);
            
            const xAxisA = d3.axisBottom(xScaleA).ticks(10);

            const widthScale = d3
                .scaleLinear()
                .domain([0, maxG])
                .range([0, graphSize.width / 2]);

            const barHeight = 30;
            const barOffset = 10;

            const yScale = d3
                .scaleBand()
                .domain(_data.map((d) => d.opponent))
                .range([0, graphSize.height])
                .padding(0.1);

            const svg = d3.select("#game-summary-chart")
                .select("svg")
            
            svg.append("g")
                .attr("transform", "translate(" + margins.left + "," + (svgSize.height - margins.bottom) + ")")
                .call(xAxisF)

            svg.append("g")
                .attr("transform", "translate(" + margins.left  + "," + (svgSize.height - margins.bottom) + ")")
                .call(xAxisA)
            
            // Title
            d3.select(".title")
                .attr("class", "title")
                .attr("x", graphSize.width / 2)
                .attr("y", 45)
                .attr("text-anchor", "middle")
                .attr("font-size", "1.5rem")
                .attr("font-family", font)
                .text("Goals Scored");

            //X-AXIS

            // Add goals for bars
            var gf = d3.select("#graph-g")
                .selectAll(".goals-for")
                .data(_data)
                .join("rect")
                .attr("class", "goals-for")
                .attr("x", graphSize.width/2)
                .attr("y", (d) => yScale(d.opponent)!)
                .attr("height", barHeight)
                .attr("fill", "#81BDFC");
			
			if (anime) {
				gf.transition()
					.duration(1000)
					.attr("width", (d) => widthScale(d.GF))
					.attr("x", (d) => xScaleF(d.GF))
			} else {
				gf.attr("width", (d) => widthScale(d.GF))
					.attr("x", (d) => xScaleF(d.GF))
			}

            // add xG for bars
            var xgf = d3.select("#graph-g")
                .selectAll(".xG-for")
                .data(_data)
                .join("rect")
                .attr("class", "xG-for")
                .attr("x", graphSize.width/2)
                .attr("y", (d) => yScale(d.opponent)!)
                .attr("height", barHeight)
                .attr("fill", "url(#diagonalHatchExGF)");

			if (anime) {
				xgf.transition()
					.duration(1000)
					.attr("width", (d) => widthScale(d.xGF))
					.attr("x", (d) => xScaleF(d.xGF));
			} else {
				xgf.attr("width", (d) => widthScale(d.xGF))
					.attr("x", (d) => xScaleF(d.xGF));
			}
			


            // add goals against bars
            var ga = d3.select("#graph-g")
                .selectAll(".goals-against")
                .data(_data)
                .join("rect")
                .attr("class", "goals-against")
                .attr("x", (d) => xScaleA(0))
                .attr("y", (d) => yScale(d.opponent)!)
                .attr("height", barHeight)
                .attr("fill", "#fc8787");

			if (anime) {
				ga.transition()
					.duration(1000)
					.attr("width", (d) => widthScale(d.GA));
			} else {
				ga.attr("width", (d) => widthScale(d.GA));
			}

            // add xG against bars
            var xga = d3.select("#graph-g")
                .selectAll(".xG-against")
                .data(_data)
                .join("rect")
                .attr("class", "xG-against")
                .attr("x", (d) => xScaleA(0))
                .attr("y", (d) => yScale(d.opponent)!)
                .attr("height", barHeight)
                .attr("fill", "url(#diagonalHatchExGA)");
			
			if (anime) {
				xga.transition()
					.duration(1000)
					.attr("width", (d) => widthScale(d.xGA));
			} else {
				xga.attr("width", (d) => widthScale(d.xGA));
			}

            // Add line in the middle of the graph with animation
            var midLine = d3.select("#graph-g")
                .selectAll(".middle-line")
                .data([0])
                .join("line")
                .attr("class", "middle-line")
                .attr("x1", graphSize.width / 2)
                .attr("y1", graphSize.height)
                .attr("x2", graphSize.width / 2)
                .attr("y2", graphSize.height)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5")
                .attr("stroke-opacity", 0.5);

            if (anime) {
                midLine
                    .transition()
                    .duration(1000)
                    .attr("y2", 0)
            } else {
                midLine
                    .attr("y2", 0)
            }
            // Add opponent names on the right side with goals for under
            d3.select("#graph-g")
                .selectAll(".opponent")
                .data(_data)
                .join("text")
                .attr("class", "opponent")
                .attr("x", (d) => graphSize.width)
                .attr("y", (d) => yScale(d.opponent)!)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("font-size", "0.8rem")
                .attr("font-family", font)
                .text((d) => d.opponent);

            // Add goals for labels
            d3.select("#graph-g")
                .selectAll(".goals-for-label")
                .data(_data)
                .join("text")
                .attr("class", "goals-for-label")
                .attr("x", (d) => 0)
                .attr("y", (d) => yScale(d.opponent)! + barHeight / 2)
                .attr("dy", "0.35em")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("font-size", "1rem")
                .attr("font-family", font)
                .text((d) => d.GF);

            // Add goals against labels
            d3.select("#graph-g")
                .selectAll(".goals-against-label")
                .data(_data)
                .join("text")
                .attr("class", "goals-against-label")
                .attr("x", (d) => graphSize.width)
                .attr("y", (d) => yScale(d.opponent)! + barHeight / 2)
                .attr("dy", "0.35em")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("font-size", "1rem")
                .attr("font-family", font)
                .text((d) => d.GA);

            // Add xG for labels
            d3.select("#graph-g")
                .selectAll(".xG-for-label")
                .data(_data)
                .join("text")
                .attr("class", "xG-for-label")
                .attr("x", (d) => 0)
                .attr("y", (d) => yScale(d.opponent)! + barHeight / 2 + 15)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("font-size", "0.8rem")
                .attr("font-family", font)
                .text((d) => "(" + d.xGF + ")");

            // Add xG against labels
            d3.select("#graph-g")
                .selectAll(".xG-against-label")
                .data(_data)
                .join("text")
                .attr("class", "xG-against-label")
                .attr("x", (d) => graphSize.width)
                .attr("y", (d) => yScale(d.opponent)! + barHeight / 2 + 15)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("font-size", "0.8rem")
                .attr("font-family", font)
                .text((d) => "(" + d.xGA + ")");

            // Add legends for each bar fill under text
            d3.select(".legeng-svg")
                .selectAll("rect")
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", (d, i) => 0)
                .attr("y", (d, i) => 30 + i * 30)
                .attr("width", 60)
                .attr("height", 20)
                .attr("fill", (d) => d.fill);

            d3.select(".legeng-svg")
                .selectAll("text")
                .data(legendData)
                .enter()
                .append("text")
                .attr("x", (d, i) => 70)
                .attr("y", (d, i) => 30 + i * 30 + 15)
                .attr("font-size", "0.8rem")
                .attr("font-family", font)
                .attr("font-weight", (d) => d.fontweight)
                .text((d) => d.label);
        }

        window.addEventListener("resize", () => {
            setSizing();
            build();
        });
    });

    // })

    // function setSizes(){
    //   // Si on veut que ce soit dynamique

    //   windowWidth = window.innerWidth
    //   legendWidth = 0.33*windowWidth
    //   vizContainerWidth = 0.67*windowWidth
    //   vizContainerHeight = window.innerHeight
    //   graphWidth = 0.90*vizContainerWidth
    //   graphHeight = 0.90*vizContainerHeight
    //   graphX = (vizContainerWidth - graphWidth)/2
    //   graphY = 0.05*window.innerHeight;

    //   console.log(graphWidth)
    // }
</script>

<div class="container">
    <div class="text">
        <h1>Goals and Expected Goals For and Against France</h1>
        <br>
        <br>
        <p>
            In this bar chart, we show, for every game played by France in the 2022 World Cup, 
            the goals and expected goals for and against France.
        </p>
        <br>
        <p>
            Expected goals is a metric designed to measure the probability of a shot resulting in a goal.
            Based on multiple informations such as ; historical data, position of shoter, distance from the goal,
            position of goal keeper and more, the expected goal is an estimation of the likelihood of a goal on a scale between 0 and 1. 
        </p>
        <br> 
        <p>For example, a player shoting 1 meter away from the goal while the goalkeeper is laying on the ground 
            could have an expected goal of 0.9, meaning that there is a 90% chance of scoring a goal. On the other hand,
            a player shoting 30 meters away from the goal while the goalkeeper is up and facing the shot could have an expected goal of 0.1,
            meaning that there is a 10% chance of scoring a goal.
        </p>
        <br>
        <p>
            Expected Goals is a good measure to help determine how lucky or unlucky a team is. Indeed, if a team has a lot of goals scored
            but a low expected goals, it could mean that the team was lucky and they scored more than they should have. On the other hand, if a team has not a lot of goals scored
            but a high expected goals, it could mean that the team was unlucky or unable to finish. 
        </p>

        <br>
        <br>

        <svg class="legeng-svg" />
    </div>
    <div class="graph-viz1" id="game-summary-chart">
        <svg class="main-svg">
            <pattern
                id="diagonalHatchExGF"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
            >
                <line
                    x1="0"
                    y1="4"
                    x2="8"
                    y2="4"
                    stroke="blue"
                    stroke-width="3"
                />
            </pattern>

            <pattern
                id="diagonalHatchExGA"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
            >
                <line
                    x1="0"
                    y1="4"
                    x2="8"
                    y2="4"
                    stroke="red"
                    stroke-width="3"
                />
            </pattern>
        </svg>
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

    .container {
        width: 100%;
        display: flex;
    }

    .text {
        flex: 2;
        flex-direction: column;
        padding: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.graph-viz1) {
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
