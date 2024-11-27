<script lang="ts">
    import { compact, table } from '$lib/state'
    import Toggle from '$lib/Toggle.svelte'
</script>

{#if !$compact}
    <Toggle label="table" bind:state={$table} />
{/if}

