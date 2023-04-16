<script>
    import Viz1 from "../components/Viz1.svelte";
    import Viz2 from "../components/Viz2.svelte";
    import Viz3 from "../components/Viz3.svelte";
    import Viz4 from "../components/Viz4.svelte";
    import Viz5 from "../components/Viz5.svelte";
</script>
<div class="nav">
    <div class="nav-card">
        Ramenez La Coupe
    </div>
    <div class="nav-list">
        <a href="#viz1-a"><li class="nav-list-item">Goals and Expected Goals For and Against France</li></a>
        <a href="#viz2-a"><li class="nav-list-item">Visualisation of some of France’s playstyle and performance against its opponents</li></a>
        <a href="#viz3-a"><li class="nav-list-item">Comparision of the french national team players</li></a>
        <a href="#viz4-a"><li class="nav-list-item">Visualization of Top Player Performances: Comparing France's Best Players to Opposing Teams' Best Player</li></a>
        <a href="#viz5-a"><li class="nav-list-item">Comparision of France’s performance compared to the other countries in the World Cup 2022</li></a>
    </div>
</div>
<div class="main-viz-container">
<div id="viz1-a" class="viz1-container">
    <Viz1 />
</div>
<div id="viz2-a" class="viz2-container">
    <Viz2 />
</div>
<div id="viz3-a" class="viz3-container">
    <Viz3 />
</div>
<div id="viz4-a" class="viz4-container">
    
    <Viz4 />
</div>
<div id="viz5-a" class="viz5-container">
    <Viz5 />
</div>
</div>

<style>
    .container-title {
        text-align: center;
    }
    .viz-introduction-title {
        text-align: center;
    }
    .viz-container {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        width: 1000px;
        margin: auto;
    }

    .viz-introduction {
        padding: 3em 1em 3em 1em;
        font-size: 20px;
    }

    .viz1-introduction {
        background: lightcyan;
    }

    .viz2-introduction {
        background: lightgrey;
    }

    .viz3-introduction {
        background: lavender;
    }

    .viz4-introduction {
        background: lightblue;
    }
    .viz5-introduction {
        background: lightcoral;
    }

    .main-viz-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .nav {
        height: 100vh;
        display: flex;
        gap: 1rem;
        flex-direction: row;
    }

    .nav-list {
        list-style: none;
        gap: 1rem;
        flex: .75;
        padding: 3rem;
        font-size: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .nav-list-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 75%;
    }

    .nav-list-item:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .nav-card {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #101026 !important;
        color: white;
        font-weight: bolder;
        font-size: 48px;
        text-align: center;
    }
    
    .viz1-container {
        min-height: 100vh;
    }

    .viz2-container {
        height: 100vh;
    }

    .viz3-container {
    }

    .viz4-container {
        min-height: 100vh;
    }

    .viz5-container {
        height: 100vh;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
</style>
