<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import type { Site } from './site'

    export let site: Site
    export let minutesToShow: number

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full h-96 p-4 mb-4">
    <a href="/{site.folder}/">
        <h1 class="font-sans text-sky-700 text-xl hover:underline mb-2">{site.name}</h1>
    </a>
    <div class="w-full h-full border" bind:clientWidth={graphWidth} bind:clientHeight={graphHeight}>
        <WindTalker site={site} width={graphWidth} height={graphHeight} {minutesToShow} />
    </div>
</div>
