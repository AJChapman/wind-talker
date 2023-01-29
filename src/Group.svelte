<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import type { Site, SiteGroup } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { groupSites } from '$lib/freeflightwx-sites'
    import { settings } from '$lib/settings'
    import type { State } from '$lib/state'
    import { getStateFromSearchParams, updateSearchParamsFromState } from '$lib/state'

    export let group: SiteGroup
    export let searchParams: URLSearchParams

    $: sites = groupSites(group)

    let state: State = getStateFromSearchParams(searchParams)
    $: updateSearchParamsFromState(searchParams, state)
</script>

<svelte:head>
    <title>{group.name} Wind Talkers</title>
</svelte:head>

<main class="md:m-4 m-1">
    {#if !state.compact}
        <Link path="">
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
        </Link>
    {/if}

    <TimeControls bind:state />
    {#each sites as site}
        <WindTalkerListing {site} {state} />
    {/each}
    <CompactLink bind:compact={state.compact} />
</main>
