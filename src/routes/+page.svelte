<script>
    import Viz1 from "../components/Viz1.svelte";
    import Viz2 from "../components/Viz2.svelte";
    import Viz3 from "../components/Viz3.svelte";
    import Viz4 from "../components/Viz4.svelte";
    import Viz5 from "../components/Viz5.svelte";
</script>

<div>
    <div class="viz-introduction viz1-introduction">
        <div class="viz-container">
            <h1 class="viz-introduction-title">
                Comparision of the teams' expected performances
            </h1>
            <p>
                In cupidatat velit consectetur non aute ut occaecat nisi
                reprehenderit reprehenderit laborum aute exercitation. Dolore
                aliqua ipsum voluptate ipsum est exercitation irure officia.
                Nostrud sit enim in qui excepteur esse. Quis nostrud excepteur
                eu ipsum laboris amet Lorem.
            </p>
        </div>
    </div>
    <Viz1 />
</div>
<div>
    <div class="viz-introduction viz2-introduction">
        <div class="viz-container">
            <h1 class="viz-introduction-title">X</h1>
            <p>
                Quis elit dolore consectetur ipsum sit sunt quis Lorem eiusmod
                irure do dolor. Ex enim duis exercitation ad consequat
                reprehenderit in sint aute ex do nisi aliquip. Fugiat velit esse
                sit laboris dolore velit.
                <br /><br />
                Veniam sint cupidatat Lorem pariatur duis dolore voluptate mollit
                esse aliqua proident. Dolor duis cupidatat sint aliquip sit ad exercitation
                non mollit. Adipisicing sunt Lorem elit sint dolor. Incididunt laboris
                sint sint mollit consectetur reprehenderit consectetur minim esse
                consectetur ipsum commodo quis. Nulla in commodo ex irure elit. Tempor
                nisi exercitation elit tempor nulla amet Lorem veniam non ad reprehenderit
                aliquip adipisicing in.
            </p>
        </div>
    </div>
    <Viz2 />
</div>
<div class="viz3-container">
    <div class="viz-introduction viz3-introduction">
        <div class="viz-container">
            <h1 class="viz-introduction-title">
                Comparision of France's players
            </h1>
            <p>
                In cupidatat velit consectetur non aute ut occaecat nisi
                reprehenderit reprehenderit laborum aute exercitation. Dolore
                aliqua ipsum voluptate ipsum est exercitation irure officia.
                Nostrud sit enim in qui excepteur esse. Quis nostrud excepteur
                eu ipsum laboris amet Lorem.
                <br /> Nostrud veniam aliquip dolor sit consequat. Aliqua mollit
                incididunt id do deserunt tempor nostrud magna. Quis sit
                pariatur cillum voluptate Lorem mollit eiusmod. Eu eiusmod velit
                in ut id reprehenderit reprehenderit Lorem velit. Cupidatat
                proident mollit elit pariatur pariatur esse occaecat et ex
                exercitation sunt ea ad sint. Est minim veniam id labore magna
                nulla laborum tempor et laborum ipsum ea exercitation. <br />
                Aliqua consectetur excepteur dolore eu magna quis excepteur nulla
                nulla minim est est. Amet occaecat amet aliquip aliquip. Laborum
                aliqua duis mollit duis. Laborum irure consequat qui in quis sunt.
                Qui ea nostrud est quis. Adipisicing deserunt consectetur tempor
                ad. Esse incididunt sit sint aliquip nisi eiusmod id enim laborum
                nisi.
            </p>
        </div>
    </div>
    <Viz3 />
</div>
<div>
    <div class="viz-introduction viz4-introduction">
        <div class="viz-container">
            <h1 class="viz-introduction-title">
                Comparision of top players from different competing teams
            </h1>
            <p>
                In cupidatat velit consectetur non aute ut occaecat nisi
                reprehenderit reprehenderit laborum aute exercitation. Dolore
                aliqua ipsum voluptate ipsum est exercitation irure officia.
                Nostrud sit enim in qui excepteur esse. Quis nostrud excepteur
                eu ipsum laboris amet Lorem.
                <br /> Nostrud veniam aliquip dolor sit consequat. Aliqua mollit
                incididunt id do deserunt tempor nostrud magna. Quis sit
                pariatur cillum voluptate Lorem mollit eiusmod. Eu eiusmod velit
                in ut id reprehenderit reprehenderit Lorem velit. Cupidatat
                proident mollit elit pariatur pariatur esse occaecat et ex
                exercitation sunt ea ad sint. Est minim veniam id labore magna
                nulla laborum tempor et laborum ipsum ea exercitation. <br />
                Aliqua consectetur excepteur dolore eu magna quis excepteur nulla
                nulla minim est est. Amet occaecat amet aliquip aliquip. Laborum
                aliqua duis mollit duis. Laborum irure consequat qui in quis sunt.
                Qui ea nostrud est quis. Adipisicing deserunt consectetur tempor
                ad. Esse incididunt sit sint aliquip nisi eiusmod id enim laborum
                nisi.
            </p>
        </div>
    </div>
    <Viz4 />
</div>
<div>
    <div class="viz-introduction viz5-introduction">
        <div class="viz-container">
            <h1 class="viz-introduction-title">
                Comparision of top players from different competing teams
            </h1>
            <p>
                In cupidatat velit consectetur non aute ut occaecat nisi
                reprehenderit reprehenderit laborum aute exercitation. Dolore
                aliqua ipsum voluptate ipsum est exercitation irure officia.
                Nostrud sit enim in qui excepteur esse. Quis nostrud excepteur
                eu ipsum laboris amet Lorem.
                <br /> Nostrud veniam aliquip dolor sit consequat. Aliqua mollit
                incididunt id do deserunt tempor nostrud magna. Quis sit
                pariatur cillum voluptate Lorem mollit eiusmod. Eu eiusmod velit
                in ut id reprehenderit reprehenderit Lorem velit. Cupidatat
                proident mollit elit pariatur pariatur esse occaecat et ex
                exercitation sunt ea ad sint. Est minim veniam id labore magna
                nulla laborum tempor et laborum ipsum ea exercitation. <br />
                Aliqua consectetur excepteur dolore eu magna quis excepteur nulla
                nulla minim est est. Amet occaecat amet aliquip aliquip. Laborum
                aliqua duis mollit duis. Laborum irure consequat qui in quis sunt.
                Qui ea nostrud est quis. Adipisicing deserunt consectetur tempor
                ad. Esse incididunt sit sint aliquip nisi eiusmod id enim laborum
                nisi.
            </p>
        </div>
    </div>
    <Viz5 />
</div>

<style>
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
</style>
