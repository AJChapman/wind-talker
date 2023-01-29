<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import type { Site } from './site'
    import Link from './Link.svelte'
    import type { State } from './state'

    export let site: Site
    export let state: State

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full mt-{state.compact ? "2" : "4"}">
    {#if !state.compact}
        <Link path={site.path}>
            <h1 class="font-sans text-[#337ab7] font-medium text-2xl hover:underline mb-2">{site.name}</h1>
        </Link>
    {/if}
    <div class="w-full h-52 sm:h-64 lg:h-72 xl:h-80 2xl:h-96 {state.compact ? "" : "border"}" bind:offsetWidth={graphWidth} bind:offsetHeight={graphHeight}>
        <WindTalker {site} width={graphWidth} height={graphHeight - 5} date={state.date} minutesToShow={state.minutesToShow} />
    </div>
</div>
