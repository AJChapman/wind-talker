<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import MinutesToShowURL from '$lib/MinutesToShowURL.svelte'
    import CompactURL from '$lib/CompactURL.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import type { Site } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { clampMinutesToShow } from './settings'
    import { settings } from '$lib/settings'

    export let site: Site
    export let date: Date | undefined = undefined
    export let searchParams: URLSearchParams

    let minutesToShow: number
    let compact: boolean
</script>

<svelte:head>
    <title>{site.name} Wind Talker</title>
</svelte:head>

<main class="{compact ? "" : "md:m-4 m-1"}">
    {#if !compact}
        <Link path="">
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
        </Link>
        {#if site.group !== undefined}
            <Link path={site.group.path}>
                <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">{site.group.name}</h1>
            </Link>
        {/if}
    {/if}

    <TimeControls bind:date bind:minutesToShow {compact} />
    <WindTalkerListing {site} {date} {minutesToShow} {compact} />
    <MinutesToShowURL bind:searchParams bind:minutesToShow />
    <CompactURL bind:searchParams bind:compact />
    <CompactLink bind:compact />
</main>

<style>
</style>

