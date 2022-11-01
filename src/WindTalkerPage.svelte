<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import type { Site } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'

    export let site: Site
    export let date: Date | undefined = undefined
    export let minutesToShow: number = 60
</script>

<svelte:head>
    <title>{site.name} Wind Talker</title>
</svelte:head>

<main class="md:m-4 m-1">
    <Link path="">
        <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
    </Link>
    {#if site.group !== undefined}
        <Link path={site.group.path}>
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">{site.group.name}</h1>
        </Link>
    {/if}

    <TimeControls bind:date bind:minutesToShow />
    <WindTalkerListing {site} {date} {minutesToShow} />
</main>

<style>
</style>

