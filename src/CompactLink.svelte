<script lang="ts">
    import { compact } from "$lib/state"
    import Toggle from '$lib/Toggle.svelte'
</script>

{#if !$compact}
    <Toggle label="compact" bind:state={$compact} />
{/if}
