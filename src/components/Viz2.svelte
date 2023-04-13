<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

    function drawAxis() {
        // espace en haut jusqu'a la ligne en haut du rectangle
        // espace a droite jusqu'a la ligne a droite du rectangle
        // espace en bas jusqu'au bas du rectangle
        // espace a gauche jusqu'a gauche du rectangle
        const margin = { top: 100, right: 70, bottom: 50, left: 265 };
        const width = 900 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // create a tag svg/rectangle to contain the graph
        // taille de svg qui contient le graph
        // width + margin.left + margin.right=900 will only be visible if graph remain inside this border
        // height + margin.top + margin.bottom=500
        const svg = d3
            .select("#graph-viz2")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 300)
            .attr("height", height + margin.top + margin.bottom);

        const xScale1 = d3
            .scaleLinear()
            .domain([0, 24])
            .range([margin.left, width - margin.right]);

        const xScale2 = d3
            .scaleLinear()
            .domain([24, 0])
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([800, 0])
            .range([margin.top, height - margin.bottom]);

        // define an x axis in the graph
        const xAxis1 = d3.axisBottom(xScale1).tickValues(d3.range(0, 25, 4));
        const xAxis2 = d3.axisBottom(xScale2).tickValues(d3.range(24, -1, -4));
        const yAxis = d3.axisLeft(yScale).tickValues(d3.range(0, 900, 200));

        // adjust x axises to the bottom make sure it is glued with x axis
        const adjustH = height - 47;

        // this value is a trial and error to make sure y axis is between both x axis
        const adjustX = margin.left + 625;

        // to move both x axis to the right increase translate's first parameter
        // second parameter of translate is for height of axis
        svg.append("g")
            .attr("transform", "translate(650," + adjustH + ")")
            .call(xAxis1);

        svg.append("g")
            .attr("transform", "translate(360," + adjustH + ")")
            .call(xAxis2);

        svg.append("g")
            .attr("transform", "translate(" + adjustX + ",0)")
            .call(yAxis);

        const params = {
            margin: margin,
            yScale: yScale,
            xScale1: xScale1,
            svg: svg,
        };

        return params;
    }

    function drawLeftRectangle(margin, yScale, xScale1, rectangle, svg) {
        const rectX = margin.left + 590; // position a partir de la gauche du rectangle
        const rectY = yScale(rectangle.y);

        const rectWidth = xScale1(rectangle.x) - xScale1(0);
        const rectHeight = yScale(0) - yScale(rectangle.y);

        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", rectX)
            .attr("y", rectY)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${rectX}, ${
                    rectY + rectHeight / 2
                }) scale(-1, 1) translate(${-rectX}, ${-(
                    rectY +
                    rectHeight / 2
                )})`
            );
    }

    function drawLeftDashedRectangle(
        margin,
        yScale,
        xScale1,
        topRect,
        downRect,
        svg
    ) {
        const topRectX = margin.left + 590; // position a partir de la gauche du rectangle
        const topRectY = yScale(topRect.y);

        const topRectWidth = xScale1(topRect.x) - xScale1(0);
        const topRectHeight = yScale(0) - yScale(topRect.y);

         // create the diagonal pattern
         const pattern = svg.append("defs")
        .append("pattern")
        .attr("id", "diagonalPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 10)
        .attr("height", 10)

        // diagonal lines from left to right
        pattern.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 10)
        .attr("y2", 10)
        .attr("stroke", "red")
        .attr("stroke-width", 2);
        
        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", topRectX)
            .attr("y", topRectY)
            .attr("width", topRectWidth)
            .attr("height", topRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${topRectX}, ${
                    topRectY + topRectHeight / 2
                }) scale(-1, 1) translate(${-topRectX}, ${-(
                    topRectY +
                    topRectHeight / 2
                )})`
            )
            .style("fill", "url(#diagonalPattern)")

        const downRectY = yScale(downRect.y);

        const downRectWidth = xScale1(downRect.x) - xScale1(0);
        const downRectHeight = yScale(0) - yScale(downRect.y);

        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", topRectX)
            .attr("y", downRectY)
            .attr("width", downRectWidth)
            .attr("height", downRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "url(#diagonalPattern)")
            .attr(
                "transform",
                `translate(${topRectX}, ${
                    downRectY + downRectHeight / 2
                }) scale(-1, 1) translate(${-topRectX}, ${-(
                    downRectY +
                    downRectHeight / 2
                )})`
            );
    }

    function drawRightRectangle(margin, yScale, xScale1, rectangle, svg) {
        const rectX = margin.left + 650; // position a partir de la gauche du rectangle
        const rectY = yScale(rectangle.y);

        const rectWidth = xScale1(rectangle.x) - xScale1(0);
        const rectHeight = yScale(0) - yScale(rectangle.y);

        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", rectX)
            .attr("y", rectY)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2);
    }

    function drawRightDashedRectangle(
        margin,
        yScale,
        xScale1,
        topRect,
        downRect,
        svg
    ) {
        const topRectX = margin.left + 650; // position a partir de la gauche du rectangle
        const topRectY = yScale(topRect.y);

        const topRectWidth = xScale1(topRect.x) - xScale1(0);
        const topRectHeight = yScale(0) - yScale(topRect.y);


        // create the diagonal pattern
        const pattern = svg.append("defs")
        .append("pattern")
        .attr("id", "diagonalPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 10)
        .attr("height", 10)

        // diagonal lines from left to right
        pattern.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 10)
        .attr("y2", 10)
        .attr("stroke", "red")
        .attr("stroke-width", 2);


        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", topRectX)
            .attr("y", topRectY)
            .attr("width", topRectWidth)
            .attr("height", topRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "url(#diagonalPattern)");

        const downRectY = yScale(downRect.y);

        const downRectWidth = xScale1(downRect.x) - xScale1(0);
        const downRectHeight = yScale(0) - yScale(downRect.y);

        // add the rectangle to the graph and flip it 180 degree around the y axis
        svg.append("rect")
            .attr("x", topRectX)
            .attr("y", downRectY)
            .attr("width", downRectWidth)
            .attr("height", downRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "url(#diagonalPattern)");
    }

    onMount(async () => {
        await d3.csv("data/GamesStats/PassingAgainst.csv").then((data) => {
            console.log(data);
        });
        console.log("START");
        // for france
        let franceCMP = [678, 455, 573, 501, 325, 309, 436]; // pass completed
        let franceAtt = [768, 539, 676, 601, 409, 390, 586]; // pass attempted
        let franceSoT = [6, 6, 3, 8, 5, 2, 3]; // number of shots on target
        let franceSh = [23, 21, 10, 16, 8, 14, 8]; // number of of shots attempted

        // against france
        let againstFranceCMP = [391, 485, 272, 401, 463, 519, 554];
        let againstFranceAtt = [473, 572, 368, 490, 543, 612, 689];
        let againstFranceSoT = [1, 2, 3, 1, 6, 2, 9];
        let againstFranceSh = [4, 10, 5, 11, 14, 13, 19];

        const params = drawAxis();
        const leftFullRect = {
            x: franceSoT[0],
            y: franceCMP[0],
        };
        drawLeftRectangle(
            params.margin,
            params.yScale,
            params.xScale1,
            leftFullRect,
            params.svg
        );

        const topDashedRect = {
            x: franceSoT[0],
            y: franceAtt[0],
        };
        const downDashedRect = {
            x: franceSh[0],
            y: franceCMP[0],
        };
        drawLeftDashedRectangle(
            params.margin,
            params.yScale,
            params.xScale1,
            topDashedRect,
            downDashedRect,
            params.svg
        );

        const rightFullRect = {
            x: againstFranceSoT[0],
            y: againstFranceCMP[0],
        };
        drawRightRectangle(
            params.margin,
            params.yScale,
            params.xScale1,
            rightFullRect,
            params.svg
        );

        const rtopDashedRect = {
            x: againstFranceSoT[0],
            y: againstFranceAtt[0],
        };
        const rdownDashedRect = {
            x: againstFranceSh[0],
            y: againstFranceCMP[0],
        };
        drawRightDashedRectangle(
            params.margin,
            params.yScale,
            params.xScale1,
            rtopDashedRect,
            rdownDashedRect,
            params.svg
        );
    });
</script>

<div>
    <div id="graph-viz2" />
</div>
