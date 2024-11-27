<script lang="ts">
    import { compact, showHelp } from '$lib/state'
    import Toggle from '$lib/Toggle.svelte'
</script>

{#if !$compact}
    <Toggle label="help" bind:state={$showHelp} />
{/if}

