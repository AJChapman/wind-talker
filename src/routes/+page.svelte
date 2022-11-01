<script lang="ts">
    import Link from '$lib/Link.svelte'
    import { acthpa, acthpaSites, nevic, nevicSites, svic, svicSites, pops, tunk, kurutake } from '$lib/freeflightwx-sites'
    import GroupListing from '$lib/GroupListing.svelte'
</script>

<main class="md:m-4 m-1 flex items-center justify-center">
    <div class="max-w-xl">
        <h1 class="font-sans text-4xl">FreeFlightWx</h1>
        <p class="font-sans my-2">FreeFlightWx Weather Stations provide real time weather information for many flying sites. Please contact me through <a class="text-[#337ab7] hover:underline" href="http://blueflyvario.com/contact">blueflyvario.com</a> for more information.</p>
        <GroupListing group={acthpa} sites={acthpaSites} />
        <GroupListing group={nevic} sites={nevicSites} />
        <GroupListing group={svic} sites={svicSites} />
        <GroupListing group={"Other"} sites={[pops, tunk, kurutake]} />
    </div>
</main>

<style>
</style>
