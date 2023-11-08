<script lang="ts">
    import type { Site, SiteGroup } from '$lib/site'
    import Link from '$lib/Link.svelte'

    export let group: SiteGroup | string
    export let sites: Array<Site>
</script>

{#if typeof group === 'string'}
    <h3 class="font-sans font-medium text-2xl mt-4">{group} Sites</h3>
{:else}
    <Link path="{group.path}">
        <h1 class="font-sans font-medium text-[#337ab7] text-2xl hover:underline mt-4">{group.name} Sites</h1>
    </Link>
{/if}
{#each sites as site}
    <Link path="{site.path}">
        <p class="font-sans text-[#337ab7] text-md my-2 hover:underline">{site.name}</p>
    </Link>
{/each}
