<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import type { Site } from './site'
    import Link from './Link.svelte'

    export let site: Site
    export let date: Date | undefined
    export let minutesToShow: number
    export let compact: boolean

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full my-{compact ? "2" : "4"}">
    {#if !compact}
        <Link path={site.path}>
            <h1 class="font-sans text-[#337ab7] font-medium text-2xl hover:underline mb-2">{site.name}</h1>
        </Link>
    {/if}
    <div class="w-full h-64 lg:h-72 border" bind:offsetWidth={graphWidth} bind:offsetHeight={graphHeight}>
        <WindTalker {site} width={graphWidth} height={graphHeight - 5} {date} {minutesToShow} />
    </div>
</div>
