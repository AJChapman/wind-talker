<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { siteByPath, groupByPath, groupSites } from '$lib/freeflightwx-sites'

    import type { PageData } from './$types'
    export let data: PageData

    $: group = groupByPath(data.group)
    $: site = (group === undefined) ? undefined : siteByPath(data.site, groupSites(group))
</script>

{#if site !== undefined}
    <WindTalkerPage {site} />
{/if}


