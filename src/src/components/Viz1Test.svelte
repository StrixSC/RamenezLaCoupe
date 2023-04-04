<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from 'svelte'

  let margin = {
    top: 20,
    right: 75,
    bottom: 20,
    left: 75
  }

  let windowWidth = 1200
  let legendWidth = 300
  let vizContainerWidth = 900
  let vizContainerHeight = 1000
  let graphWidth = vizContainerWidth - margin.left - margin.right
  let graphHeight = vizContainerHeight - margin.top - margin.bottom
  let graphX = margin.left
  let graphY = margin.top
  

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

    // window.addEventListener('resize', () => {
    //   setSizes()
    // })

    console.log(margin.left)

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

  const maxG = 4.5
  const goalsScale = d3
    .scaleLinear()
    .domain([0, maxG])
    .range([0, graphWidth/2]);

  const barHeight = 50
  const barOffset = 40

  const yOffsetFn = (i) => graphY + (barHeight+barOffset) * i + margin.top;

  
  
</script>



<style>
    .container {
      display: flex;
      height: 100vh;
    }
  
    .legend {
      width: 33vw;
      height: 100%;
      background-color: #f5f5f5;
    }
  
    .vizContainer {
      flex: 1;
      height: 100%;
      background-color: aquamarine;
    }
    .gf {
      fill: #81BDFC;
      stroke: black;
    }
    .ga{
      fill: #fc8787;
      stroke: black;
    }
</style>



<div class="container">

    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <div class="legend">
      <!-- Add your legend elements here -->
    </div>
    <div class="vizContainer">
      <!-- The chart will be created in this div -->

      <div class="graph">
        <svg width={vizContainerWidth} height={vizContainerHeight}>
          
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
          
          <g>
            <rect x={graphX} y={graphY} width={graphWidth} height={graphHeight} fill="white" />
            
            <line
              x1 = {graphX + graphWidth/2}
              x2 = {graphX + graphWidth/2}
              y1 = {graphY}
              y2 = {graphY + graphHeight}
              stroke = 'black'>


            </line>

            {#each data as game, i}

              <rect
                class="gf"
                x={graphX + graphWidth/2 - goalsScale(game.gf)}
                y={yOffsetFn(i)}
                width={goalsScale(game.gf)}
                height={barHeight}
                stroke='black'
                fill='red'
                >
              </rect>

              <!-- goals against -->
              <rect
                class="ga"
                x={graphWidth/2 + margin.left}
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
                x={graphX + graphWidth/2 - goalsScale(game.xgf)}
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
                x={graphWidth/2 + margin.left}
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
                  x1={graphX + graphWidth/2 - goalsScale(game.gf) + goalsScale(j+1)}
                  x2={graphX + graphWidth/2 - goalsScale(game.gf) + goalsScale(j+1)}
                  y1={yOffsetFn(i)}
                  y2={yOffsetFn(i) + barHeight}
                  stroke='black'>
                </line>
              {/each}

              <!-- lines for each goals against -->
              {#each Array.from({length: game.ga}, (v, i) => i) as g, j}
                <line
                  x1={graphX + graphWidth/2 + goalsScale(j+1)}
                  x2={graphX + graphWidth/2 + goalsScale(j+1)}
                  y1={yOffsetFn(i)}
                  y2={yOffsetFn(i) + barHeight}
                  stroke='black'>
                </line>
              {/each}


              <!-- text on the left to show each game goals for -->
              <text
                x=10
                y={yOffsetFn(i) + barHeight/2 + 5}
                text-anchor='start'
                font-size=17
                font-weight=bold
                fill='black'
                font-family= 'Roboto'>
                {game.gf} ({game.xgf})
              </text>


              <text
                x={vizContainerWidth - 5}
                y={yOffsetFn(i) + barHeight/2}
                text-anchor='end'
                font-size=17
                font-weight=bold
                fill='black'
                font-family= 'Roboto'>
                ({game.xga}) {game.ga}
              </text>

              <text
                x={vizContainerWidth - 5}
                y={yOffsetFn(i) + barHeight/2 + 22}
                text-anchor='end'
                font-size=13
                fill='black'
                font-family= 'Roboto'>
                {game.game}
              </text>

            {/each}

          </g>
        </svg>
      </div>

    </div>
</div>

