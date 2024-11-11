<script lang="ts">
    export let compact: boolean
</script>

{#if !compact}
    <label for="compact" class="font-sans text-xs text-[#337ab7] hover:underline absolute top-4 right-4">compact</label>
    <input id="compact" class="hidden" type="checkbox" bind:checked={compact} />
{/if}
