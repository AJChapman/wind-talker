<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import type { Site } from './site'

    export let site: Site
    export let minutesToShow: number

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full flex flex-col h-96 my-4">
    <a class="flex-none" href="{import.meta.env.BASE_URL}{site.folder}/">
        <h1 class="font-sans text-[#337ab7] font-medium text-2xl hover:underline mb-2">{site.name}</h1>
    </a>
    <div class="grow w-full border" bind:offsetWidth={graphWidth} bind:offsetHeight={graphHeight}>
        <WindTalker site={site} width={graphWidth} height={graphHeight - 5} {minutesToShow} />
    </div>
</div>
