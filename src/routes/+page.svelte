<script>
    import Viz1 from "../components/Viz1.svelte";
    import Viz2 from "../components/Viz2.svelte";
    import Viz3 from "../components/Viz3.svelte";
    import Viz4 from "../components/Viz4.svelte";
    import Viz5 from "../components/Viz5.svelte";
</script>

<div>
    <iframe title="viz1" src="/viz1"></iframe>
</div>
<div>
    <iframe title="viz2" src="/viz2"></iframe>
</div>
<div>
    <iframe title="viz3" src="/viz3"></iframe>
</div>
<div>
    <iframe title="viz4" src="/viz4"></iframe>
</div>
<div>
    <iframe title="viz5" src="/viz5"></iframe>
</div>

<style>
    iframe {
        width: 100vw;
        border: none;
        height: 100vh;
    }
</style>