<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import { springHill, lakeGeorge, lanyon } from '$lib/freeflightwx-sites'
    import TimeControls from '$lib/TimeControls.svelte'

    let minutesToShow: number = 60
</script>

<svelte:head>
    <title>FreeFlight Wx ACTHPA</title>
</svelte:head>

<main class="md:m-4 m-1">
    <Link path="">
        <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
    </Link>

    <TimeControls bind:minutesToShow />
    <WindTalkerListing site={springHill} {minutesToShow} />
    <WindTalkerListing site={lakeGeorge} {minutesToShow} />
    <WindTalkerListing site={lanyon} {minutesToShow} />
</main>

<style>
</style>
