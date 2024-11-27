<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import TopRight from '$lib/TopRight.svelte'
    import TableLink from '$lib/TableLink.svelte'
    import HelpLink from '$lib/HelpLink.svelte'
    import Help from '$lib/Help.svx'
    import type { SiteGroup } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { groupSites } from '$lib/freeflightwx-sites'
    import { compact } from '$lib/state'

    export let group: SiteGroup

    $: sites = groupSites(group)
</script>

<svelte:head>
    <title>{group.name} Wind Talkers</title>
</svelte:head>

<main class="md:m-4 m-1">
    {#if !$compact}
        <Link path="">
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
        </Link>
    {/if}

    <TimeControls />
    <Help />
    {#each sites as site}
        <WindTalkerListing {site} />
    {/each}
    <TopRight>
        <TableLink /> <CompactLink /> <HelpLink />
    </TopRight>
</main>
