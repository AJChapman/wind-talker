<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import type { Site, SiteGroup } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { groupSites } from '$lib/freeflightwx-sites'

    export let group: SiteGroup

    $: sites = groupSites(group)

    let date: Date | undefined = undefined
    let minutesToShow: number = 60
</script>

<svelte:head>
    <title>{group.name} Wind Talkers</title>
</svelte:head>

<main class="md:m-4 m-1">
    <Link path="">
        <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
    </Link>

    <TimeControls bind:date bind:minutesToShow />
    {#each sites as site}
        <WindTalkerListing {site} {date} {minutesToShow} />
    {/each}
</main>
