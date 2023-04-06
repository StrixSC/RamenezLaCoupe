<script lang="ts">
  
  import * as d3 from "d3";
  import { onMount } from 'svelte'
    
  ////////////////////////////////////////////////////////////// 
  //////////////////////// Set-Up ////////////////////////////// 
  ////////////////////////////////////////////////////////////// 
  onMount(async () => {
    SetupRadarChart();
    buildLegend();
  })

  var data = [
        [
        {axis:"Shots",value:22, name: "Messi"},
        {axis:"SoT",value:28},
        {axis:"Passes",value:29},
        {axis:"Touches",value:17},
        {axis:"Dribbles",value:22},
        {axis:"Block",value:2},
        {axis:"Interceptions",value:21},
        {axis:"Tackle",value:50}			
        ],[
        {axis:"Shots",value:27,  name: "Mbappe"},
        {axis:"SoT",value:16},
        {axis:"Passes",value:35},
        {axis:"Touches",value:13},
        {axis:"Dribbles",value:20},
        {axis:"Block",value:13},
        {axis:"Interceptions",value:35},
        {axis:"Tackle",value:38}		
        ],[
          {axis:"Shots",value:12, name: "Ronaldo"},
        {axis:"SoT",value:28},
        {axis:"Passes",value:29},
        {axis:"Touches",value:17},
        {axis:"Dribbles",value:22},
        {axis:"Block",value:35},
        {axis:"Interceptions",value:21},
        {axis:"Tackle",value:50}		
        ]
      ];

  function SetupRadarChart() {
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
      width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
      height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var color = d3.scaleOrdinal()
      .range(["#EDC951","#CC333F","#00A0B0"]);
      
    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    };
    
    RadarChart(".radarChart", data, radarChartOptions);
  }

    var cfg = {
      w: 600, //Width of the circle
      h: 600, //Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 3, //How many levels or inner circles should there be drawn
      maxValue: 0, //What is the value that the biggest circle will represent
      labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, //The opacity of the area of the blob
      dotRadius: 4, //The size of the colored circles of each blog
      opacityCircles: 0.1, //The opacity of the circles of each blob
      strokeWidth: 2, //The width of the stroke around each blob
      roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
    };

  function RadarChart(id: String, data: any[], options: {}) {



    //Put all of the options into a variable called cfg
    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i];
        }
      } //for i
    } //if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue: number = Math.max(
      cfg.maxValue,
      d3.max(data, function (i: []) {
        return d3.max(
          i.map(function (o: any) {
            return o.value ;
          })
        );
      }) as unknown as number);

    var allAxis =  [//iPhone
						{axis:"Shots"},
						{axis:"SoT"},
						{axis:"Passes"},
						{axis:"Touches"},
						{axis:"Dribbles"},
						{axis:"Blocks"},
						{axis:"Interceptions"},
						{axis:"Tackle"}			
				].map(function (i: any, j) {
        return i.axis;
      }), //Names of each axis
      total = allAxis.length, //The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), // Radius of the outermost circle
      Format = d3.format("0"),
      angleSlice = (Math.PI * 2) / total; // The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id.toString()).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3
      .select(id.toString())
      .append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar" + id);
    //Append a g element
    var g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (cfg.w / 2 + cfg.margin.left) +
          "," +
          (cfg.h / 2 + cfg.margin.top) +
          ")"
      );

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function (d, i) {
        return (radius / cfg.levels) * d;
      })
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    axisGrid
      .selectAll(".axisLabel")
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function (d) {
        return (-d * radius) / cfg.levels;
      })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function (d, i) {
        return Format(parseFloat(((maxValue * d) / cfg.levels).toFixed(2)));
      });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function (d, i) {
        return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("y2", function (d, i) {
        return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr("y", function (d, i) {
        return (
          rScale(maxValue * cfg.labelFactor) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .text(function (d) {
        return d;
      })
      

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.lineRadial()
      .curve(d3.curveBasisClosed)
      .radius(function (d: any) {
        return rScale(d.value);
      })
      .angle(function (d, i) {
        return i * angleSlice;
      });

    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }

    //Create a wrapper for the blobs
    var blobWrapper = g
      .selectAll(".radarWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("id", function (d, i) {
        return "area-" + d[0].name;
      })
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("fill", function (d, i: any) {
        return cfg.color(i);
      })
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function (d, i) {
        d3.select("#text-" + i[0].name).transition().duration(200).style("fill-opacity", 0.9);
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function (d, i) {
        d3.select("#text-" + i[0].name).transition().duration(200).style("fill-opacity", 0.5);
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

    //Create the outlines
    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function (d, i: any) {
        return cfg.color(i);
      })
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper
      .selectAll(".radarCircle")
      .data(function (d, i) {
        return d;
      })
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function (d: any, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function (d: any, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", function (d, i, j: any) {
        return cfg.color(j);
      })
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g
      .selectAll(".radarCircleWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper
      .selectAll(".radarInvisibleCircle")
      .data(function (d, i) {
        return d;
      })
      .enter()
      .append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 1.5)
      .attr("cx", function (d: any, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function (d: any, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (d, i: any) {
        var newX = parseFloat(d3.select(this).attr("cx")) - 10;
        var newY = parseFloat(d3.select(this).attr("cy")) - 10;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(Format(i.value))
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);
  } //RadarChart

  function buildLegend() {
    // select the svg area
    var svg = d3.select("#radarLegend")
      .data(data)
      .append("svg")
      .attr("width", 275)
      .attr("height", 350)

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d, i: any) {
        return cfg.color(i);
      })
      .append("text")
       .attr("dx", function(d){return -20})
       .text(function(d: any){ return d[0].name})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(data)
      .enter()
      .append("text")
      .attr("id", function (d, i) {
        return "text-" + d[0].name;
      })
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i: any) {
          return cfg.color(i);
        })
        .style("fill-opacity", 0.5)
        .text(function(d: any){ return d[0].name})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", function (d, i) {
          d3.select(this).transition().duration(200).style("fill-opacity", 0.9)
          //Dim all blobs
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.1);
          //Bring back the hovered over blob
          d3.select("#area-" + i[0].name).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).style("fill-opacity", 0.5)
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

  }

</script>

<div class="radarContainer">
  <div id="radarLegend"></div>
  <div class="radarChart"></div>
</div>


<style>
  .radarContainer {
    display: flex;
  }

  #radarLegend {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }
</style>

