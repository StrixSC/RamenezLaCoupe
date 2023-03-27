<!-- MyChart.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let data = [
        { game: "vs Australia", gf: 4, xgf: 4, ga: 1, xga: 0.5 },
        { game: "vs Denmark", gf: 2, xgf: 2.4, ga: 1, xga: 0.6},
        { game: "vs Tunisia", gf: 0, xgf: 0.8, ga: 1, xga: 0.5 },
        { game: "vs Poland", gf: 3, xgf: 1.4, ga: 1, xga: 1.7 },
        { game: "vs England", gf: 2, xgf: 0.9, ga: 1, xga: 2.4 },
        { game: "vs Morocoo", gf: 2, xgf: 2, ga: 0, xga: 0.9 },
        { game: "vs Argentina", gf: 3, xgf: 2.2, ga: 3, xga: 3.2 },
    ];

    let svg;

  
    onMount(() => {

    // Create the SVG element
    svg = d3.select('#chart')
      .append('svg')
      .attr('width', 1000)
      .attr('height', 600);

    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 1000)
      .attr('height', 600)
      .attr('stroke', 'black')
      .attr('fill', '#C4F0FF')

    svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text((d, i) => d.game)
      .attr('x', 800)
      .attr('y', (d, i) =>  120 + i * 60)

    // Define the xgf pattern
    const xgfp = svg.append('defs')
        .append('pattern')
        .attr('id', 'xgfp')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(45)');

    // Add a diagonal line to the pattern
    xgfp.append('line')
        .attr('x1', 0)
        .attr('y1', 2)
        .attr('x2', 4)
        .attr('y2', 2)
        .attr('stroke', 'blue')
        .attr('stroke-width', 1);

    // Define the pattern
    const xgap = svg.append('defs')
        .append('pattern')
        .attr('id', 'xgap')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(45)');

    // Add a diagonal line to the pattern
    xgap.append('line')
        .attr('x1', 0)
        .attr('y1', 2)
        .attr('x2', 4)
        .attr('y2', 2)
        .attr('stroke', 'red')
        .attr('stroke-width', 1);

    // Create the bars for gf
    svg.selectAll('.gf-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'gf-bar')
      .attr('x', (d, i) => 500 - (d.gf*50))
      .attr('y', (d, i) => 100 + i * 60)
      .attr('width', d => d.gf * 50)
      .attr('height', 30)
      .attr('stroke', 'black')
      .attr('rx', 10)
      .attr('fill', '#81BDFC');

    //   FF6665 : red

    // 81BDFC : blue
      

    // Create the bars for expected goals
    svg.selectAll('.xgf-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'xgf-bar')
      .attr('x', (d, i) => 500 - (d.xgf*50))
      .attr('y', (d, i) => 100 + i * 60)
      .attr('width', d => d.xgf * 50)
      .attr('height', 30)
      .attr('fill', 'url(#xgfp)')
      .attr('rx', 10)
      .attr('opacity', 1)
      .attr('stroke', 'black')

    // Create the bars for goals
    svg.selectAll('.ga-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'ga-bar')
      .attr('x', (d, i) => 500)
      .attr('y', (d, i) => 100 + i * 60)
      .attr('width', d => d.ga * 50)
      .attr('height', 30)
      .attr('stroke', 'black')
      .attr('rx', 10)
      .attr('fill', '#FF6665');

    // Create the bars for expected goals
    svg.selectAll('.xga-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'xga-bar')
      .attr('x', (d, i) => 500)
      .attr('y', (d, i) => 100 + i * 60)
      .attr('width', d => d.xga * 50)
      .attr('height', 30)
      .attr('fill', 'url(#xgap)')
      .attr('opacity', 1)
      .attr('rx', 10)
      .attr('stroke', 'black')

    svg.append('line')
        .attr('x1', 500)
        .attr('y1', 0)
        .attr('x2', 500)
        .attr('y2', 1000)
        .attr('stroke', 'black')
  });
</script>

<div id="chart"></div>