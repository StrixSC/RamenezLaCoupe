<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

    const datafile = "/src/data/OverallStats/TeamOverallStats.csv";

    let teams = [];
    let goalsToExGRatio = [];

    const margins = {
        top: 50,
        left: 50,
        right: 30,
        bottom: 10,
    };

    const width = 1000 - margins.left - margins.right;
    const height = 900 - margins.top - margins.bottom;

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
                teams.push(t.Squad);
                t.Poss = parseFloat(t.Poss);
                t.Ast = parseInt(t.Ast);
                t.CrdY = parseInt(t.CrdY);
                t.team = team;

                goalsToExGRatio.push(
                    (parseFloat(t.Gls) / parseFloat(t.xG)).toFixed(2)
                );
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
                    d3.min(goalsToExGRatio, (d) => d),
                    d3.max(goalsToExGRatio, (d) => d),
                ])
                .range([0, 600]);

            let possessionChart = svg
                .append("g")
                .attr("class", "possession-viz5")
                .append("rect")
                .attr("class", "viz5-possession")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("fill", "lightblue");

            svg.append("g")
                .call(d3.axisBottom(xScalePoss))
                .attr("transform", `translate(0, 50)`);

            let assistsChart = svg
                .append("rect")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 150)
                .attr("fill", "lightblue");

            svg.append("g")
                .call(d3.axisBottom(xScaleAssists))
                .attr("transform", `translate(0, 200)`);

            let yellowCardsChart = svg
                .append("rect")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 300)
                .attr("fill", "lightblue");

            svg.append("g")
                .call(d3.axisBottom(xScaleYellowCrd))
                .attr("transform", `translate(0, 350)`);

            let ExpGRatioChart = svg
                .append("rect")
                .attr("width", 600)
                .attr("height", 50)
                .attr("rx", 5)
                .attr("y", 450)
                .attr("fill", "lightblue");

            svg.append("g")
                .call(d3.axisBottom(xScaleGExRatio))
                .attr("transform", `translate(0, 500)`);

            data.sort((a: any, b: any) => b.Poss - a.Poss);
            console.log(data);
            const gSelection = svg
                .select(".possession-viz5")
                .selectAll("g")
                .data(() => data)
                .enter()
                .append("g");

            gSelection
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
                        return "darkblue";
                    }
                    return "lightblue";
                })
                .attr("opacity", (d: any) => {
                    if (d.team === "fr") {
                        return "1";
                    }
                    return "0";
                })
                .on("mouseover", function (_: any, data: any) {
                    d3.select(this).attr("fill", "darkgreen");
                    d3.select(this).attr("opacity", 1);
                    d3.select(`.${data.team}-poss`).attr("opacity", 1);
                    d3.select(`.${data.team}-poss-text`)
                        .attr("opacity", 1)
                        .text(data.Squad.split(' ')[1]);
                })
                .on("mouseleave", function (_: any, data: any) {
                    d3.select(this).attr(
                        "fill",
                        data.team === "fr" ? "darkblue" : "lightblue"
                    );
                    d3.select(this).attr("opacity", 0);
                    d3.select(`.${data.team}-poss`).attr("opacity", 0.25);
                    d3.select(`.${data.team}-poss-text`)
                        .attr("opacity", 0)
                        .text("");
                });

            gSelection
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

            gSelection
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
                .attr("font-size", "0.75rem")
                .attr("opacity", (d) => {
                    if (d.team === "fr") {
                        return 1;
                    }
                    return 0;
                })
                .attr("transform", (d: any) => {
                    if (d.team === "fr") {
                        return `translate(-30, 30) rotate(-45,${xScalePoss(
                            d.Poss
                        )},75)`;
                    } else return "";
                })
                .attr('font-weight', 'lighter')
                .text((d: any) => d.Squad.split(' ')[1]);
        });
    });
</script>

<div class="vizContainer">
    <div id="description">
        <h1>Adipisicing aute irure consequat laborum minim mollit deserunt ad ut magna consequat dolor cupidatat ullamco.</h1>
        Amet dolor culpa cupidatat exercitation. Lorem nulla ad nisi aute elit
        laboris reprehenderit. Commodo adipisicing reprehenderit dolor sunt
        duis. Reprehenderit ex mollit cupidatat sunt labore elit ut voluptate
        adipisicing magna aliquip. Dolor magna nulla ad anim magna fugiat
        laborum quis ad.
        <br /><br />
        Eiusmod ex duis anim irure. Enim officia in non minim mollit duis consequat.
        Cillum id culpa eu do magna. Lorem cillum sunt eiusmod amet consequat. Pariatur
        labore dolore nostrud excepteur ea proident enim duis eiusmod commodo eu
        mollit. Aliquip incididunt aliqua excepteur commodo ullamco enim nostrud
        consectetur enim duis commodo eu.
        <br /><br />
        Non adipisicing laboris amet esse cillum. Ad nisi sint commodo enim sint
        adipisicing ipsum. Qui nulla exercitation dolor incididunt minim. Laborum
        eiusmod cillum non elit magna officia duis irure cupidatat sint enim. Enim
        non minim cillum aute sit est id Lorem. Dolore do consectetur labore amet
        pariatur anim ex. Veniam culpa culpa adipisicing qui dolor anim est qui ad.
    </div>
    <div id="viz5" />
</div>

<style>
    .vizContainer {
        display: flex;
        padding: 2rem;
        gap: 1rem;
    }

    #viz5 {
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #description {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

</style>
