<script lang="ts">
    import WindTalkerListing from './WindTalkerListing.svelte'
    import { springHill, lakeGeorge, lanyon } from './freeflightwx-sites'
    import TimeControls from './TimeControls.svelte'

    let minutesToShow: number = 60
</script>

<main class="md:m-4 m-1">
    <a href="{import.meta.env.BASE_URL}">
        <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
    </a>

    <TimeControls bind:minutesToShow />
    <WindTalkerListing site={springHill} {minutesToShow} />
        <!--
    <WindTalkerListing site={lakeGeorge} {minutesToShow} />
    <WindTalkerListing site={lanyon} {minutesToShow} />
        -->
</main>

<style>
</style>
