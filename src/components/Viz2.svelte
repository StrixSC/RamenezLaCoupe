<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import {
        calculatePossAgainstFrance
    } from '../utils/viz2-helpers'

    let posForFrance : number[] = []
    let posAgainstFrance : number[] = []


    function drawAxis(minX, maxX, minY, maxY,i,circleRadius = 50) {
        // espace en haut jusqu'a la ligne en haut du rectangle
        // espace a droite jusqu'a la ligne a droite du rectangle
        // espace en bas jusqu'au bas du rectangle
        // espace a gauche jusqu'a gauche du rectangle
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const diffAxisCenter = 40;
        const marginHor = 10;
        const marginVer = 100;

        const width = 900;
        const height = 500;
        
        
        const sizeAxisX = width / 2 - diffAxisCenter - marginHor;
        
        
        // create a tag svg/rectangle to contain the graph
        // taille de svg qui contient le graph

        const topDiv = d3.select("#graph-viz2_" + i.toString());
        topDiv.style("width", width.toString() + "px");
        topDiv.style("height", (height+marginVer).toString() + "px");
        
        const svg = d3
            .select("#graph-viz2_" + i.toString())
            .append("svg")
            .attr("width", width.toString() + "px")
            .attr("height", (height + marginVer).toString() + "px");

        const xScale1 = d3
            .scaleLinear()
            .domain([maxX, minX])
            .range([0, sizeAxisX]);

        const xScale2 = d3
            .scaleLinear()
            .domain([minX, maxX])
            .range([0, sizeAxisX]);

        const yScale = d3
            .scaleLinear()
            .domain([maxY, minY])
            .range([0, height - (circleRadius*2)]);

        // define an x axis in the graph
        const xAxis1 = d3.axisBottom(xScale1).tickValues(d3.range(minX, maxX, 4))
        const xAxis2 = d3.axisBottom(xScale2).tickValues(d3.range(maxX, minX, -4));
        const yAxis = d3.axisLeft(yScale).tickValues(d3.range(minY, maxY + marginVer, 200));
        svg.selectAll('tick').select('text').attr('class', 'viz2-ticks');

        // to move both x axis to the right increase translate's first parameter
        // second parameter of translate is for height of axis
        const ajustV = 30;
        svg.append("g")
            .attr("transform", "translate(" + (marginHor) + "," + (height + ajustV) + ")")
            .call(xAxis1)

        svg.append("g")
            .attr("transform", "translate(" + (sizeAxisX + 2*diffAxisCenter + marginHor) + "," + (height + ajustV) + ")")
            .call(xAxis2)

        svg.append("g")
            .attr("transform", "translate(" + (sizeAxisX + diffAxisCenter + marginHor) + ", " + (circleRadius*2 + ajustV) +")")
            .call(yAxis);

        const params = {
            diffAxisCenter : diffAxisCenter,
            marginHor : marginHor,
            marginVer : marginVer,
            ajustV : ajustV,
            
            margin: margin,
            yScale: yScale,
            xScale1: xScale1,
            svg: svg,
            width : width,
            height : height
        };

        return params;
    }

    function drawLeftRectangle(params, rectangle) { // (params, yScale, xScale1, rectangle, svg) {
        const rectWidth = Math.abs(params.xScale1(rectangle.x) - params.xScale1(0));
        const rectHeight = params.yScale(0) - params.yScale(rectangle.y);

        const rectX = params.width/2 - params.diffAxisCenter - rectWidth; // position a partir de la gauche du rectangle
        const rectY = params.height + params.ajustV - rectHeight;

        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", "blue")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${rectX}, ${rectY})`
            );
    }

    function drawLeftDashedRectangle(
        params,
        topRect,
        downRect
    ) {

        const topRectWidth = Math.abs(params.xScale1(topRect.x) - params.xScale1(0));
        const topRectHeight = params.yScale(0) - params.yScale(topRect.y);

        const topRectX = params.width/2 - params.diffAxisCenter - topRectWidth; // position a partir de la gauche du rectangle
        const topRectY = params.height + params.ajustV - topRectHeight;

         // create the diagonal pattern
         const pattern = params.svg.append("defs")
        .append("pattern")
        .attr("id", "diagonalPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 10)
        .attr("height", 10)
        .attr("patternTransform","rotate(-45)")

        // diagonal lines from left to right
        pattern.append("line")
        .attr("x1", 0)
        .attr("y1", 5)
        .attr("x2", 10)
        .attr("y2", 5)
        .attr("stroke", "blue")
        .attr("stroke-width", 3);
        
        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("width", topRectWidth)
            .attr("height", topRectHeight)
            .style("fill", "blue")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${topRectX}, ${topRectY})`
            )
            .style("fill", "url(#diagonalPattern)");

        const downRectWidth = Math.abs(params.xScale1(downRect.x) - params.xScale1(0));
        const downRectHeight = params.yScale(0) - params.yScale(downRect.y);

        const downRectX = params.width/2 - params.diffAxisCenter - downRectWidth; // position a partir de la gauche du rectangle
        const downRectY = params.height + params.ajustV - downRectHeight;

        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("width", downRectWidth)
            .attr("height", downRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${downRectX}, ${downRectY})`
            )
            .style("fill", "url(#diagonalPattern)");

    }

    function drawRightRectangle(params, rectangle) {

        const rectWidth = Math.abs(params.xScale1(rectangle.x) - params.xScale1(0));
        const rectHeight = params.yScale(0) - params.yScale(rectangle.y);

        const rectX = params.width/2 + params.diffAxisCenter; // position a partir de la gauche du rectangle
        const rectY = params.height + params.ajustV - rectHeight;

        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr(
                "transform",
                `translate(${rectX}, ${rectY})`
            );
    }

    function drawRightDashedRectangle(
        params,
        topRect,
        downRect
    ) {
        const topRectWidth = Math.abs(params.xScale1(topRect.x) - params.xScale1(0));
        const topRectHeight = params.yScale(0) - params.yScale(topRect.y);

        const topRectX = params.width/2 + params.diffAxisCenter; // position a partir de la gauche du rectangle
        const topRectY = params.height + params.ajustV - topRectHeight;
    
        // create the diagonal pattern
        const pattern = params.svg.append("defs")
        .append("pattern")
        .attr("id", "diagonalPattern2")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 10)
        .attr("height", 10)
        .attr("patternTransform","rotate(45)")

        // diagonal lines from left to right
        pattern.append("line")
        .attr("x1", 0)
        .attr("y1", 5)
        .attr("x2", 10)
        .attr("y2", 5)
        .attr("stroke", "red")
        .attr("stroke-width", 3);


        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("x", topRectX)
            .attr("y", topRectY)
            .attr("width", topRectWidth)
            .attr("height", topRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "url(#diagonalPattern2)");;

        const downRectWidth = Math.abs(params.xScale1(downRect.x) - params.xScale1(0));
        const downRectHeight = params.yScale(0) - params.yScale(downRect.y);

        const downRectX = params.width/2 + params.diffAxisCenter; // position a partir de la gauche du rectangle
        const downRectY = params.height + params.ajustV - downRectHeight;

        // add the rectangle to the graph and flip it 180 degree around the y axis
        params.svg.append("rect")
            .attr("width", downRectWidth)
            .attr("height", downRectHeight)
            .style("fill", "red")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "url(#diagonalPattern2)")
            .attr(
                "transform",
                `translate(${downRectX}, ${downRectY})`
            );
    }

    function drawPossessionCircle(
        donutDiameter,
        width,
        height,
        svg,
        countryName,
        i
    ) {

        // Diametre du cercle
        var donutRadius = donutDiameter / 2

        // Diametre du trou à l'intérieur
        const donnutInnerHoleRadius = 0.65 * donutRadius

        // Rouge pour adversaire, Bleu pour france
        var color = d3.scaleOrdinal()
            .range(['#fc8787', '#81BDFC'])


        var pie = d3.pie().sort(null)
        var arc = d3.arc()
            .innerRadius(donnutInnerHoleRadius)
            .outerRadius(donutRadius)

        
        svg.append('g')
            .attr("width", width + 10 ).attr("height", height + 10)
            .attr('transform', "translate(" + width/ 2 + "," + (donutRadius+7) + ")")
            .append('text')
            .attr('text-anchor', 'middle')
            .text(countryName)
            .attr('font-size', '5px')

        var arcs = svg.append('g')
            .attr('transform', "translate(" + width/2  + "," + donutDiameter/2  + ")")
            .selectAll('arc')
            .data(pie([posAgainstFrance[i],posForFrance[i]]))
            .enter()
            .append('g')
            .attr('class', 'arc')

        arcs.append('path')
            .attr('fill', function(d, i) {
                return color(i)
            })
            .attr('d', arc)

        var label = d3.arc()
                .outerRadius(donutRadius)
                .innerRadius(donnutInnerHoleRadius)

        // labels inside donut
        arcs.append('text')
            .attr("transform", function(d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function(d) {
                return d.value
            })
            .style("font-size", "12px")
            .attr('text-anchor', 'middle')

    }

    onMount(async () => {
        await d3.csv("data/GamesStats/PassingAgainst.csv").then((data) => {
            console.log(data);
        });

        await d3.csv("data/GamesStats/PossesionFor.csv").then((data2) => {
            // Le tableau contient les valeurs possession pour lequique france vs 
            // 0 : argentine, 1 : denemark, 2: tunisie, 3: poland, 4: england, 5 : maroc, 6 : argentine
            // against france it would be 100 - possForFrance[]
            
            const rawData = data2.map(row => row['For France']); 
            const temp = rawData.filter(item => item?.trim());
            const filteredTemp = temp.filter(item => item !== undefined);
            const posFrance = (filteredTemp as string[]);
            posFrance.shift();
            posFrance.pop();

            posForFrance = posFrance.map(str => Number(str))

            posAgainstFrance = calculatePossAgainstFrance(posForFrance) // calculated the pos against 
           console.log('possesion',posForFrance)
            
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

        let viz = {
            "minX" : 0,
            "maxX" : 24,
            "minY" : 0,
            "maxY" : 800
        }
        const donutDiameter = 100;

        const countryName = ['Australia','Denmark', 'Tunisia', 'Poland', 'England', 'Morocco', 'Argentina']

        for(let i = 0; i < countryName.length; ++i){
            const params = drawAxis(viz["minX"], viz["maxX"], viz["minY"], viz["maxY"], i+1);
            const leftFullRect = {
                x: franceSoT[i],
                y: franceCMP[i],
            };
            
            drawLeftRectangle(
                params,
                leftFullRect
            );

            const topDashedRect = {
                x: franceSoT[i],
                y: franceAtt[i],
            };
            const downDashedRect = {
                x: franceSh[i],
                y: franceCMP[i],
            };
            drawLeftDashedRectangle(
                params,
                topDashedRect,
                downDashedRect
            );

            const rightFullRect = {
                x: againstFranceSoT[i],
                y: againstFranceCMP[i],
            };
            drawRightRectangle(
                params,
                rightFullRect
            );

            const rtopDashedRect = {
                x: againstFranceSoT[i],
                y: againstFranceAtt[i],
            };
            const rdownDashedRect = {
                x: againstFranceSh[i],
                y: againstFranceCMP[i],
            };
            drawRightDashedRectangle(
                params,
                rtopDashedRect,
                rdownDashedRect
            );
            
            drawPossessionCircle(
                donutDiameter,
                params.width,
                params.height,
                params.svg,
                countryName[i],
                i
            )
        }
        
    });
</script>

<div>
    <h1 class="container-title">Visualisation of some of France’s playstyle and performance against its opponents.</h1>
    <br>
    <h2> France(en bleu) vs Australia (rouge) </h2>
    <div id="graph-viz2_1" />
    <h2> France(en bleu) vs Denmark (rouge) </h2>
    <div id="graph-viz2_2" />
    <h2> France(en bleu) vs Tunisia (rouge) </h2>
    <div id="graph-viz2_3" />
    <h2> France(en bleu) vs Poland (rouge) </h2>
    <div id="graph-viz2_4" />
    <h2> France(en bleu) vs England (rouge) </h2>
    <div id="graph-viz2_5" />
    <h2> France(en bleu) vs Morocco (rouge) </h2>
    <div id="graph-viz2_6" />
    <h2> France(en bleu) vs Argentina (rouge) </h2>
    <div id="graph-viz2_7" />
</div>

<style>

    #graph-viz2_1, #graph-viz2_2, #graph-viz2_3, #graph-viz2_4, #graph-viz2_5, #graph-viz2_6, #graph-viz2_7  {
        font-size: 14px !important;
        margin : auto;
    }

    .container-title {
        text-align: center;
    }
    :global(.viz2-ticks) {
        font-size: 14px !important;
    }
    h2{
        text-align: center;
    }
</style>
