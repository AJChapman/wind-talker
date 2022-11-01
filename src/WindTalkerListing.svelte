<script lang="ts">
    import WindTalker from './WindTalker.svelte'
    import type { Site } from './site'
    import Link from './Link.svelte'

    export let site: Site
    export let date: Date | undefined
    export let minutesToShow: number

    let graphWidth: number
    let graphHeight: number
</script>

<div class="w-full flex flex-col h-80 lg:h-96 my-4">
    <Link classes="flex-none" path={site.path}>
        <h1 class="font-sans text-[#337ab7] font-medium text-2xl hover:underline mb-2">{site.name}</h1>
    </Link>
    <div class="grow w-full border" bind:offsetWidth={graphWidth} bind:offsetHeight={graphHeight}>
        <WindTalker {site} width={graphWidth} height={graphHeight - 5} {date} {minutesToShow} />
    </div>
</div>
