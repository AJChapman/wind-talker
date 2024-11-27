<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import TopRight from '$lib/TopRight.svelte'
    import TableLink from '$lib/TableLink.svelte'
    import HelpLink from '$lib/HelpLink.svelte'
    import Help from '$lib/Help.svx'
    import type { Site } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import { compact } from '$lib/state'

    export let site: Site
</script>

<svelte:head>
    <title>{site.name} Wind Talker</title>
</svelte:head>

<main class='{$compact ? "" : "md:m-4 m-1"}'>
    {#if !$compact}
        <Link path="">
            <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">FreeFlightWx.com</h1>
        </Link>
        {#if site.group !== undefined}
            <Link path={site.group.path}>
                <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline">{site.group.name}</h1>
            </Link>
        {/if}
    {/if}

    <TimeControls />
    <Help />
    <WindTalkerListing {site} />
    <TopRight>
        <TableLink /> <CompactLink /> <HelpLink />
    </TopRight>
</main>

<style>
</style>

