<script lang="ts">
    import WindTalkerListing from '$lib/WindTalkerListing.svelte'
    import Link from '$lib/Link.svelte'
    import CompactLink from '$lib/CompactLink.svelte'
    import type { Site } from '$lib/site'
    import TimeControls from '$lib/TimeControls.svelte'
    import type { State } from '$lib/state'
    import { getStateFromSearchParams, updateSearchParamsFromState } from '$lib/state'

    import { ssp, queryParam } from 'sveltekit-search-params'

    export let site: Site
    export let searchParams: URLSearchParams

    let state: State = getStateFromSearchParams(searchParams)
    // $: updateSearchParamsFromState(searchParams, state)

    const compact = queryParam('compact', {
        encode: (value: boolean) => value ? t : undefined,
        decode: (stringValue: string | null) => stringValue !== null && stringValue !== "false",
        defaultValue: false
    })
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

    <TimeControls bind:state />
    <WindTalkerListing {site} {state} />
    <CompactLink bind:compact={$compact} />
</main>

<style>
</style>

