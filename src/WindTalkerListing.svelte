<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import WindTalkerTable from './WindTalkerTable.svelte'
    import type { Site } from './site'
    import Link from './Link.svelte'
    import { compact, table } from './state'

    export let site: Site

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full mt-{$compact ? "2" : "4"}">
    {#if !$compact}
        <Link path={site.path}>
            <h1 class="font-sans text-[#337ab7] font-medium text-2xl hover:underline mb-2">{site.name}</h1>
        </Link>
    {/if}
    {#if $table}
        <WindTalkerTable {site} />
    {:else}
        <div class="w-full h-64 sm:h-72 lg:h-80 xl:h-96 2xl:h-112 {$compact ? "" : "border"}" bind:offsetWidth={graphWidth} bind:offsetHeight={graphHeight}>
            <WindTalker {site} width={graphWidth} height={graphHeight - 5} />
        </div>
    {/if}
</div>
