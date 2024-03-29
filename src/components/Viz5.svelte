<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

    const datafile = "/data/OverallStats/TeamOverallStats.csv";

    const margins = {
        top: 100,
        left: 200,
        right: 500,
        bottom: 50,
    };

    const width = 1600 - margins.left - margins.right;
    const height = 1600 - margins.top - margins.bottom;

    onMount(async () => {
        let svg = d3
            .select("#viz5")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);

        d3.csv(datafile).then(function (data) {
            data.forEach(function (t) {
                const team = t.Squad?.split(" ")[0];
                t.Poss = parseFloat(t.Poss);
                t.Ast = parseInt(t.Ast);
                t.CrdY = parseInt(t.CrdY);
                t.team = team;
                t.goalsToExGRatio = (
                    parseFloat(t.Gls) / parseFloat(t.xG)
                ).toFixed(2);
            });

            let xScalePoss = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d) => d.Poss),
                    d3.max(data, (d) => d.Poss),
                ])
                .range([0, 600]);

            let xScaleAssists = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d) => d.Ast),
                    d3.max(data, (d) => d.Ast),
                ])
                .range([0, 600]);

            let xScaleYellowCrd = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d) => d.CrdY),
                    d3.max(data, (d) => d.CrdY),
                ])
                .range([0, 600]);

            let xScaleGExRatio = d3
                .scaleLinear()
                .domain([
                    d3.min(data, (d) => d.goalsToExGRatio),
                    d3.max(data, (d) => d.goalsToExGRatio),
                ])
                .range([0, 600]);

            let possessionChart = svg
                .append("g")
                .attr("class", "possession-viz5");
            
            svg.append("g")
                .call(d3.axisBottom(xScalePoss))
                .attr("transform", `translate(0, 50)`);

            possessionChart
                .append("rect")
                .attr("class", "viz5-possession")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("fill", "rgb(129, 189, 252)");

            possessionChart
                .append("text")
                .attr("class", `poss-text-title`)
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("font-weight", "lighter")
                .text("Possessions")
                .attr("y", -60)
            
            let assistsChart = svg
                .append("g")
            
            assistsChart
                .attr("class", "assists-viz5")
                .append("rect")
                .attr("class", "viz5-assists")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 200)
                .attr("fill", "rgb(129, 189, 252)");

            assistsChart
                .append("text")
                .attr("class", `poss-text-title`)
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("font-weight", "lighter")
                .text("Assists")
                .attr("y", 140)

            svg.append("g")
                .call(d3.axisBottom(xScaleAssists))
                .attr("transform", `translate(0, 250)`);

            let yellowCardsChart = svg
                .append("g")
                .attr("class", "yellowCrd-viz5")
            
            yellowCardsChart
                .append("rect")
                .attr("class", "viz5-yellowCrd")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 400)
                .attr("fill", "rgb(129, 189, 252)");

            yellowCardsChart
                .append("text")
                .attr("class", `poss-text-title`)
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("font-weight", "lighter")
                .text("Yellow Cards")
                .attr("y", 340)

            svg.append("g")
                .call(d3.axisBottom(xScaleYellowCrd))
                .attr("transform", `translate(0, 450)`);

            let ExpGRatioChart = svg
                .append("g")
                .attr("class", "gToExG-viz5")
            
            ExpGRatioChart
                .append("rect")
                .attr("class", "viz5-gToExG")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 600)
                .attr("fill", "rgb(129, 189, 252)");

            ExpGRatioChart
                .append("text")
                .attr("class", `poss-text-title`)
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("font-weight", "lighter")
                .text("Goals to Expected Goals Ratio")
                .attr("y", 540)

            svg.append("g")
                .call(d3.axisBottom(xScaleGExRatio))
                .attr("transform", `translate(0, 650)`);

            ///////////////
            //Possession///
            ///////////////

            data.sort((a: any, b: any) => b.Poss - a.Poss);
            const gSelectionPoss = svg
                .select(".possession-viz5")
                .selectAll("g")
                .data(() => data)
                .enter()
                .append("g");

            gSelectionPoss
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", (d) => {
                    if (d.team === "fr") {
                        return "france-possession-scale";
                    } else {
                        return "";
                    }
                })
                .attr("width", (d: any) => xScalePoss(d.Poss))
                .attr("height", 50)
                .attr("fill", (d: any) => {
                    if (d.team === "fr") {
                        return "rgb(51, 78, 105)";
                    }
                    return "rgb(129, 189, 252)";
                })
                .attr("opacity", (d: any) => {
                    if (d.team === "fr") {
                        return "1";
                    }
                    return "0";
                })
                .on("mouseover", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr("fill", "rgb(116, 174, 89)");
                    d3.select(this).attr("opacity", 1);
                    d3.select(`.${data.team}-poss`).attr("opacity", 1);
                    d3.select(`.${data.team}-poss-text`)
                        .attr("opacity", 1)
                        .text(data.Squad.split(" ")[1]);
                })
                .on("mouseleave", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }

                    d3.select(this).attr(
                        "fill",
                        data.team === "fr" ? "rgb(51, 78, 105)" : "rgb(129, 189, 252)"
                    );
                    d3.select(this).attr("opacity", 0);
                    d3.select(`.${data.team}-poss`).attr("opacity", 0.25);
                    d3.select(`.${data.team}-poss-text`)
                        .attr("opacity", 0)
                        .text("");
                });

            gSelectionPoss
                .append("line")
                .attr("class", (d: any) => `${d.team}-poss`)
                .attr("x1", (d: any) => xScalePoss(d.Poss))
                .attr("x2", (d: any) => xScalePoss(d.Poss))
                .attr("y1", (d: any) => {
                    if (d.team === "fr") {
                        return 50;
                    }
                    return 0;
                })
                .attr("y2", (d: any) => {
                    if (d.team === "fr") {
                        return 65;
                    }
                    return -15;
                })
                .attr("stroke", "black")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return "1";
                    } else {
                        return "0.25";
                    }
                });

            gSelectionPoss
                .append("text")
                .attr("class", (d: any) => `${d.team}-poss-text`)
                .attr("x", (d: any) => xScalePoss(d.Poss))
                .attr("y", (d: any) => {
                    if (d.team === "fr") {
                        return 75;
                    }
                    return -20;
                })
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return 1;
                    }
                    return 0;
                })
                .attr("transform", (d: any) => {
                    if (d.team === "fr") {
                        return `translate(-30, 40) rotate(-45,${xScalePoss(
                            d.Poss
                        )},75)`;
                    } else return "";
                })
                .attr("font-weight", "lighter")
                .text((d: any) => d.Squad.split(" ")[1]);

            ///////////////
            ////Assists///
            //////////////

            data.sort((a: any, b: any) => b.Ast - a.Ast);

            const gSelectionAst = svg
                .select(".assists-viz5")
                .selectAll("g")
                .data(() => data)
                .enter()
                .append("g");

            gSelectionAst
                .append("rect")
                .attr("x", 0)
                .attr("y", 200)
                .attr("class", (d) => {
                    if (d.team === "fr") {
                        return "france-assists-scale";
                    } else {
                        return "";
                    }
                })
                .attr("width", (d: any) => xScaleAssists(d.Ast))
                .attr("height", 50)
                .attr("fill", (d: any) => {
                    if (d.team === "fr") {
                        return "rgb(51, 78, 105)";
                    }
                    return "rgb(129, 189, 252)";
                })
                .attr("opacity", (d: any) => {
                    if (d.team === "fr") {
                        return "1";
                    }
                    return "0";
                })
                .on("mouseover", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr("fill", "rgb(116, 174, 89)");
                    d3.select(this).attr("opacity", 1);
                    d3.select(`.${data.team}-assists`).attr("opacity", 1);
                    d3.select(`.${data.team}-assists-text`)
                        .attr("opacity", 1)
                        .text(data.Squad.split(" ")[1]);
                })
                .on("mouseleave", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr(
                        "fill",
                        data.team === "fr" ? "rgb(51, 78, 105)" : "rgb(129, 189, 252)"
                    );
                    d3.select(this).attr("opacity", 0);
                    d3.select(`.${data.team}-assists`).attr("opacity", 0.25);
                    d3.select(`.${data.team}-assists-text`)
                        .attr("opacity", 0)
                        .text("");
                });

            gSelectionAst
                .append("line")
                .attr("class", (d: any) => `${d.team}-assists`)
                .attr("x1", (d: any) => xScaleAssists(d.Ast))
                .attr("x2", (d: any) => xScaleAssists(d.Ast))
                .attr("y1", (d: any) => {
                    if (d.team === "fr") {
                        return 250;
                    }
                    return 200;
                })
                .attr("y2", (d: any) => {
                    if (d.team === "fr") {
                        return 265;
                    }
                    return 185;
                })
                .attr("stroke", "black")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return "1";
                    } else {
                        return "0.25";
                    }
                });

            gSelectionAst
                .append("text")
                .attr("class", (d: any) => `${d.team}-assists-text`)
                .attr("x", (d: any) => xScaleAssists(d.Ast))
                .attr("y", (d: any) => {
                    if (d.team === "fr") {
                        return 350;
                    }
                    return 175;
                })
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return 1;
                    }
                    return 0;
                })
                .attr("transform", (d: any) => {
                    if (d.team === "fr") {
                        return `translate(-225, 50) rotate(-45,${xScaleAssists(
                            d.Ast
                        )},75)`;
                    } else return "";
                })
                .attr("font-weight", "lighter")
                .text((d: any) => d.Squad.split(" ")[1]);

            /////////////////
            //Yellow Cards///
            /////////////////

            data.sort((a: any, b: any) => b.CrdY - a.CrdY);

            const gSelectionYllwCrd = svg
                .select(".yellowCrd-viz5")
                .selectAll("g")
                .data(() => data)
                .enter()
                .append("g");

            gSelectionYllwCrd
                .append("rect")
                .attr("x", 0)
                .attr("y", 400)
                .attr("class", (d) => {
                    if (d.team === "fr") {
                        return "france-yellowCrd-scale";
                    } else {
                        return "";
                    }
                })
                .attr("width", (d: any) => xScaleYellowCrd(d.CrdY))
                .attr("height", 50)
                .attr("fill", (d: any) => {
                    if (d.team === "fr") {
                        return "rgb(51, 78, 105)";
                    }
                    return "rgb(129, 189, 252)";
                })
                .attr("opacity", (d: any) => {
                    if (d.team === "fr") {
                        return "1";
                    }
                    return "0";
                })
                .on("mouseover", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr("fill", "rgb(116, 174, 89)");
                    d3.select(this).attr("opacity", 1);
                    d3.select(`.${data.team}-yellowCrd`).attr("opacity", 1);
                    d3.select(`.${data.team}-yellowCrd-text`)
                        .attr("opacity", 1)
                        .text(data.Squad.split(" ")[1]);
                })
                .on("mouseleave", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr(
                        "fill",
                        data.team === "fr" ? "rgb(51, 78, 105)" : "rgb(129, 189, 252)"
                    );
                    d3.select(this).attr("opacity", 0);
                    d3.select(`.${data.team}-yellowCrd`).attr("opacity", 0.25);
                    d3.select(`.${data.team}-yellowCrd-text`)
                        .attr("opacity", 0)
                        .text("");
                });

            gSelectionYllwCrd
                .append("line")
                .attr("class", (d: any) => `${d.team}-yellowCrd`)
                .attr("x1", (d: any) => xScaleYellowCrd(d.CrdY))
                .attr("x2", (d: any) => xScaleYellowCrd(d.CrdY))
                .attr("y1", (d: any) => {
                    if (d.team === "fr") {
                        return 450;
                    }
                    return 400;
                })
                .attr("y2", (d: any) => {
                    if (d.team === "fr") {
                        return 465;
                    }
                    return 385;
                })
                .attr("stroke", "black")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return "1";
                    } else {
                        return "0.25";
                    }
                });

            gSelectionYllwCrd
                .append("text")
                .attr("class", (d: any) => `${d.team}-yellowCrd-text`)
                .attr("x", (d: any) => xScaleYellowCrd(d.CrdY))
                .attr("y", (d: any) => {
                    if (d.team === "fr") {
                        return 550;
                    }
                    return 375;
                })
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return 1;
                    }
                    return 0;
                })
                .attr("transform", (d: any) => {
                    if (d.team === "fr") {
                        return `translate(-365, 105) rotate(-45,${xScaleYellowCrd(
                            d.CrdY
                        )},75)`;
                    } else return "";
                })
                .attr("font-weight", "lighter")
                .text((d: any) => d.Squad.split(" ")[1]);

            /////////////////////////////////
            //Goals to expected Goals Ratio//
            /////////////////////////////////

            data.sort(
                (a: any, b: any) => b.goalsToExGRatio - a.goalsToExGRatio
            );

            const gSelectionGtoExG = svg
                .select(".gToExG-viz5")
                .selectAll("g")
                .data(() => data)
                .enter()
                .append("g");

            gSelectionGtoExG
                .append("rect")
                .attr("x", 0)
                .attr("y", 600)
                .attr("class", (d) => {
                    if (d.team === "fr") {
                        return "france-gToExG-scale";
                    } else {
                        return "";
                    }
                })
                .attr("width", (d: any) => xScaleGExRatio(d.goalsToExGRatio))
                .attr("height", 50)
                .attr("fill", (d: any) => {
                    if (d.team === "fr") {
                        return "rgb(51, 78, 105)";
                    }
                    return "rgb(129, 189, 252)";
                })
                .attr("opacity", (d: any) => {
                    if (d.team === "fr") {
                        return "1";
                    }
                    return "0";
                })
                .on("mouseover", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr("fill", "rgb(116, 174, 89)");
                    d3.select(this).attr("opacity", 1);
                    d3.select(`.${data.team}-gToExG`).attr("opacity", 1);
                    d3.select(`.${data.team}-gToExG-text`)
                        .attr("opacity", 1)
                        .text(data.Squad.split(" ")[1]);
                })
                .on("mouseleave", function (_: any, data: any) {
                    if (data.team === "fr") {
                        return;
                    }
                    d3.select(this).attr(
                        "fill",
                        data.team === "fr" ? "rgb(51, 78, 105)" : "rgb(129, 189, 252)"
                    );
                    d3.select(this).attr("opacity", 0);
                    d3.select(`.${data.team}-gToExG`).attr("opacity", 0.25);
                    d3.select(`.${data.team}-gToExG-text`)
                        .attr("opacity", 0)
                        .text("");
                });

            gSelectionGtoExG
                .append("line")
                .attr("class", (d: any) => `${d.team}-gToExG`)
                .attr("x1", (d: any) => xScaleGExRatio(d.goalsToExGRatio))
                .attr("x2", (d: any) => xScaleGExRatio(d.goalsToExGRatio))
                .attr("y1", (d: any) => {
                    if (d.team === "fr") {
                        return 650;
                    }
                    return 600;
                })
                .attr("y2", (d: any) => {
                    if (d.team === "fr") {
                        return 665;
                    }
                    return 585;
                })
                .attr("stroke", "black")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return "1";
                    } else {
                        return "0.25";
                    }
                });

            gSelectionGtoExG
                .append("text")
                .attr("class", (d: any) => `${d.team}-gToExG-text`)
                .attr("x", (d: any) => xScaleGExRatio(d.goalsToExGRatio))
                .attr("y", (d: any) => {
                    if (d.team === "fr") {
                        return 750;
                    }
                    return 575;
                })
                .attr("stroke", "black")
                .attr("font-size", "16px")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return 1;
                    }
                    return 0;
                })
                .attr("transform", (d: any) => {
                    if (d.team === "fr") {
                        return `translate(-507, 165) rotate(-45,${xScaleGExRatio(
                            d.goalsToExGRatio
                        )},75)`;
                    } else return "";
                })
                .attr("font-weight", "lighter")
                .text((d: any) => d.Squad.split(" ")[1]);
        });
    });
</script>

<div class="vizContainer">
    <div id="description">
        <h1>
            France's performance compared to the other countries in the World
            Cup 2022
        </h1>
        This visualization has per goal to display the performance of the France national
        team in comparison with the other participating teams. The graphs shown above will
        be replicated for a number of team stats (e.g., goals,  yellow cards, red cards, etc.).
        <br /><br />
        The x-axis will contain all the teams in the order of their stats. The light blue color
        represents the interval of values bigger than France. As for the dark blue color, it
        represents the interval of values lower than France.
        <br /><br />
        To complement the visualization,
        a percentage of how they compare with the France national team. The range of graphs 
        will be delimited by the teams with the lowest and highest stat for each category.
        <br /><br />
    </div>

    <div id="viz5" />
</div>

<style>
    .vizContainer {
        display: flex;
        padding: 2rem;
    }

    #viz5 {
        flex: 3;
        display: flex;
        list-style-type:none;
        padding: 0px;
        margin: 0px;
        justify-content:flex-end;
    }

    #description {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 20vw;
        margin: 0;
        padding: 0;
        gap: 1rem;
    }
</style>
