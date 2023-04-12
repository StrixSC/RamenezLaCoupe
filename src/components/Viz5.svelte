<script lang="ts">
  
  import * as d3 from "d3";
  import { onMount } from 'svelte'

  export let datafile: string;

  let teams = [];
  let goalsToExGRatio = [];

  const margins = {
        top: 10,
        left: 50,
        right: 30,
        bottom: 10,
    }

  const width = 1000 - margins.left - margins.right;
  const height = 900 - margins.top - margins.bottom;

  onMount(async () => {
    let svg = d3.select("#viz5")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);


    

    d3.csv(datafile).then(function(data) {
      data.forEach(function(t){
        teams.push(t.Squad)
        t.Poss = parseFloat(t.Poss)
        t.Ast = parseInt(t.Ast)
        t.CrdY = parseInt(t.CrdY)
        
        goalsToExGRatio.push((parseFloat(t.Gls) / parseFloat(t.xG)).toFixed(2))
      })

      let xScalePoss = d3.scaleLinear()
      .domain([d3.min(data, d => d.Poss), d3.max(data, d => d.Poss)])
      .range([0, 600]);
    
      let xScaleAssists = d3.scaleLinear()
      .domain([d3.min(data, d => d.Ast), d3.max(data, d => d.Ast)])
      .range([0, 600]);

      let xScaleYellowCrd = d3.scaleLinear()
      .domain([d3.min(data, d => d.CrdY), d3.max(data, d => d.CrdY)])
      .range([0, 600]);

      let xScaleGExRatio = d3.scaleLinear()
      .domain([d3.min(goalsToExGRatio, d => d), d3.max(goalsToExGRatio, d => d)])
      .range([0, 600]);

      let possessionChart = svg.append('rect')
      .attr('width', 600)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('fill', 'lightblue');

      svg.append('g')
      .call(d3.axisBottom(xScalePoss))
      .attr("transform", `translate(0, 50)`);
      

      let assistsChart = svg.append('rect')
      .attr('width', 600)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('y',150)
      .attr('fill', 'lightblue');

      svg.append('g')
      .call(d3.axisBottom(xScaleAssists))
      .attr("transform", `translate(0, 200)`);

      let yellowCardsChart = svg.append('rect')
      .attr('width', 600)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('y',300)
      .attr('fill', 'lightblue');

      svg.append('g')
      .call(d3.axisBottom(xScaleYellowCrd))
      .attr("transform", `translate(0, 350)`);

      let ExpGRatioChart = svg.append('rect')
      .attr('width', 600)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('y',450)
      .attr('fill', 'lightblue');

      svg.append('g')
      .call(d3.axisBottom(xScaleGExRatio))
      .attr("transform", `translate(0, 500)`);

      // svg.append('rect')
      // .attr('width', 200)
      // .attr('height', 50)
      // .attr('rx', 5)
      // .attr('opacity', 0.3)
      // .attr('fill', 'darkblue');

    });
  });

</script>

<div class = "vizContainer">
    <div id="description" />
    <div id="viz5" />
</div>

<style>
  
</style>
