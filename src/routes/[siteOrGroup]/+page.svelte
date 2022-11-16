<script lang="ts">
    import Group from '$lib/Group.svelte'
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { siteByPath, groupByPath } from '$lib/freeflightwx-sites'

    import type { PageData } from './$types'
    export let data: PageData

    $: site = siteByPath(data.siteOrGroup)
    $: group = groupByPath(data.siteOrGroup)
</script>

{#if group !== undefined}
    <Group {group} />
{/if}
{#if site !== undefined}
    <WindTalkerPage {site} />
{/if}

