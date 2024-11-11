<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import MinutesToShowURL from '$lib/MinutesToShowURL.svelte'
    import CompactURL from '$lib/CompactURL.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import type { Site, SiteGroup } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { groupSites } from '$lib/freeflightwx-sites'
    import { settings } from '$lib/settings'

    export let group: SiteGroup
    export let searchParams: URLSearchParams

    $: sites = groupSites(group)

    let date: Date | undefined = undefined
    let minutesToShow: number
    let compact: boolean
</script>

<svelte:head>
    <title>{group.name} Wind Talkers</title>
</svelte:head>

<main class="md:m-4 m-1">
    {#if !compact}
        <Link path="">
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
        </Link>
    {/if}

    <TimeControls bind:date bind:minutesToShow {compact} />
    {#each sites as site}
        <WindTalkerListing {site} {date} {minutesToShow} {compact} />
    {/each}
    <MinutesToShowURL {searchParams} bind:minutesToShow />
    <CompactURL bind:searchParams bind:compact />
    <CompactLink bind:compact />
</main>
