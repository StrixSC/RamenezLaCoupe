<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from 'svelte'

  let margin = {
    top: 70,
    right: 75,
    bottom: 20,
    left: 85
  }

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

  onMount(() => {	


    buildViz();
    //buildLegend();

	});

  let data = [
      { game: "vs Australia", gf: 4, xgf: 4, ga: 1, xga: 0.5 },
      { game: "vs Denmark", gf: 2, xgf: 2.4, ga: 1, xga: 0.6},
      { game: "vs Tunisia", gf: 0, xgf: 0.8, ga: 1, xga: 0.5 },
      { game: "vs Poland", gf: 3, xgf: 1.4, ga: 1, xga: 1.7 },
      { game: "vs England", gf: 2, xgf: 0.9, ga: 1, xga: 2.4 },
      { game: "vs Morocoo", gf: 2, xgf: 2, ga: 0, xga: 0.9 },
      { game: "vs Argentina", gf: 3, xgf: 2.2, ga: 3, xga: 3.2 },
  ];

  function buildViz() {
    const width = 1200 - margin.left - margin.right;
    const height = 1200 - margin.top - margin.bottom;

    const maxG = 4.5
    const goalsScale = d3.scaleLinear().domain([0, maxG]).range([0, width/2]);

    const barHeight = 50
    const barOffset = 40

    const yOffsetFn = (i) => margin.top + (barHeight+barOffset) * i;

    // Remove whatever chart with the same id/class that was present before in svg
    d3.select("#viz1").selectAll("svg").remove();

    // Create the svg
    const svg = d3
      .select("#viz1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    // Draw line in the middle of the graph
    svg
      .append("line")
      .attr("x1", width/2)
      .attr("y1", margin.top)
      .attr("x2", width/2)
      .attr("y2", height + margin.top)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
  }  
</script>


<div id="viz1"/>