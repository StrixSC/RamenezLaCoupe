<script lang="ts">
  import * as d3 from "d3";

  let data = [
      { game: "vs Australia", gf: 4, xgf: 4, ga: 1, xga: 0.5 },
      { game: "vs Denmark", gf: 2, xgf: 2.4, ga: 1, xga: 0.6},
      { game: "vs Tunisia", gf: 0, xgf: 0.8, ga: 1, xga: 0.5 },
      { game: "vs Poland", gf: 3, xgf: 1.4, ga: 1, xga: 1.7 },
      { game: "vs England", gf: 2, xgf: 0.9, ga: 1, xga: 2.4 },
      { game: "vs Morocoo", gf: 2, xgf: 2, ga: 0, xga: 0.9 },
      { game: "vs Argentina", gf: 3, xgf: 2.2, ga: 3, xga: 3.2 },
  ];

  const width = 1200;

  const margins = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
  };

  const topN = 10;

  const barHeight = 50;
  const barOffset = 40;

  // Compute the overall height of the visual
  //const height = data.length * barHeight + margins.top + margins.bottom;
  const height = 700
  const highlightColor = "cornflowerblue";

  // Grab the maximum value from the data for later use
  const maxG = 5;
  const goalsScale = d3
      .scaleLinear()
      .domain([0, maxG])
      .range([0, width/2]);

  const forScale = d3
      .scaleLinear()
      .domain([maxG, 0])
      .range([margins.left, width/2]);

  // Calculate the index-based offset from the top of the SVG
  // Note: Add textHeight to shift text below the starting point
  //       as text is placed according the the baseline
  const yOffsetFn = (i) => (barHeight+barOffset) * i + margins.top;

</script>

<style>
  .gf {
      fill: #81BDFC;
      stroke: black;
  }
  .ga{
      fill: #fc8787;
      stroke: black;
  }
  .xgf {
      stroke: none;
  }
  .xga{
      stroke: none;
  }
</style>

<p class="text-center text-lg text-gray-700 bg-white">Felton 2013 Bar Chart</p>
<svg
  style="--highlight-color: {highlightColor};"
  class="border border-gray-500"
  viewBox="0 0 {width} {height}"
>
  <!-- dashed patterns for expected goals -->
  <pattern
      id="diagonalHatchExGF"
      width=8
      height=8
      patternUnits='userSpaceOnUse'
      patternTransform='rotate(45)'>
      <line
          x1=0
          y1=4
          x2=8
          y2=4
          stroke=blue
          stroke-width=3
      >
      </line>
  </pattern>

  <pattern
      id="diagonalHatchExGA"
      width=8
      height=8
      patternUnits='userSpaceOnUse'
      patternTransform='rotate(45)'>
      <line
          x1=0
          y1=4
          x2=8
          y2=4
          stroke=red
          stroke-width=3
      >
      </line>
  </pattern>

  {#each data as game, i}

      <!-- clip path hack for rounded corners -->
      <!-- <clipPath
          id=gfCorner{i}>
          <rect
              x={margins.left + width/2 - goalsScale(game.gf)}
              y={yOffsetFn(i)}
              width={goalsScale(game.gf)+50}
              height={barHeight}
              rx=15
              ry=15
          >
          </rect>
      </clipPath>
      <clipPath
          id=xgfCorner{i}>
          <rect
              x={margins.left + width/2 - goalsScale(game.xgf)}
              y={yOffsetFn(i)}
              width={goalsScale(game.xgf)+50}
              height={barHeight}
              rx=15
              ry=15
          >
          </rect>
      </clipPath>
      <clipPath
          id=gaCorner{i}>
          <rect
          x={width/2 + margins.left - 50}
          y={yOffsetFn(i)}
          width={goalsScale(game.ga)+50}
          height={barHeight}
              rx=15
              ry=15
          >
          </rect>
      </clipPath>
      <clipPath
          id=xgaCorner{i}>
          <rect
          x={width/2 + margins.left - 50}
          y={yOffsetFn(i)}
          width={goalsScale(game.xga)+50}
          height={barHeight}
              rx=15
              ry=15
          >
          </rect>
      </clipPath> -->

      <!-- goals for-->
      <rect
          class="gf"
          x={margins.left + width/2 - goalsScale(game.gf)}
          y={yOffsetFn(i)}
          width={goalsScale(game.gf)}
          height={barHeight}
          stroke='black'
          clip-path={`url(#gfCorner${i})`}
          >
      </rect>

      <!-- goals against -->
      <rect
          class="ga"
          x={width/2 + margins.left}
          y={yOffsetFn(i)}
          width={goalsScale(game.ga)}
          height={barHeight}
          stroke='black'
          clip-path={`url(#gaCorner${i})`}
          >
      </rect>

      <!-- expected goals for -->
      <rect
          class="xgf"
          x={margins.left + width/2 - goalsScale(game.xgf)}
          y={yOffsetFn(i)}
          width={goalsScale(game.xgf)}
          height={barHeight}
          stroke='black'
          fill='url(#diagonalHatchExGF)'
          clip-path={`url(#xgfCorner${i})`}
       >
      </rect>

      <!-- expected goals against -->
      <rect
          class="xga"
          x={width/2 + margins.left}
          y={yOffsetFn(i)}
          width={goalsScale(game.xga)}
          height={barHeight}
          stroke='black'
          fill='url(#diagonalHatchExGA)'
          clip-path={`url(#xgaCorner${i})`}
      >
      </rect>

      <!-- lines for each goals for -->
      {#each Array.from({length: game.gf}, (v, i) => i) as g, j}
          <line
              x1={margins.left + width/2 - goalsScale(game.gf) + goalsScale(j+1)}
              x2={margins.left + width/2 - goalsScale(game.gf) + goalsScale(j+1)}
              y1={yOffsetFn(i)}
              y2={yOffsetFn(i) + barHeight}
              stroke='black'>
          </line>
      {/each}

      <!-- lines for each goals against -->
      {#each Array.from({length: game.ga}, (v, i) => i) as g, j}
          <line
              x1={width/2 + margins.left + goalsScale(j+1)}
              x2={width/2 + margins.left + goalsScale(j+1)}
              y1={yOffsetFn(i)}
              y2={yOffsetFn(i) + barHeight}
              stroke='black'>
          </line>
      {/each}

      <!-- text on the left to show each game goals for -->
      <text
          x={margins.left}
          y={yOffsetFn(i) + barHeight/2 + 5}
          text-anchor='start'
          font-size=22
          font-weight=bold
          fill='black'>
          {game.gf} ({game.xgf})
      </text>

      <!-- text on the right to show each game goals against -->
      <text
          x={width - margins.right}
          y={yOffsetFn(i) + barHeight/2}
          text-anchor='end'
          font-size=22
          font-weight=bold
          fill='black'>
          ({game.xga}) {game.ga}</text>

      <!-- text on the right, under goals against, to show game description -->
      <text
          x={width - margins.right}
          y={yOffsetFn(i) + barHeight/2 + 5 + 12}
          text-anchor='end'
          font-size=15
          fill='black'>
          {game.game}</text>

      
      
  {/each}

  <line
      x1={width/2 + margins.left}
      x2={width/2 + margins.left}
      y1=0
      y2=1000
      stroke='black'>

  </line>
  <!-- <polygon
      style="fill: none"
      points={`${margins.left},${margins.top} ${width - margins.right},${
          margins.top
      } ${width - margins.right},${height - margins.bottom} ${margins.left},${
          height - margins.bottom
      }`}
  /> -->
</svg>