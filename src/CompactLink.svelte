<script lang="ts">
    import { compact } from "$lib/state"
</script>

{#if !$compact}
    <label for="compact" class="text-[#337ab7] hover:underline">compact</label>
{/if}
<input id="compact" class="hidden" type="checkbox" bind:checked={$compact} />
