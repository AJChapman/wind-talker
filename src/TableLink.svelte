<script lang="ts">
    import { compact, table } from "$lib/state"
</script>

{#if !$compact}
    <label for="table" class="text-[#337ab7] hover:underline">{#if $table}graph{:else}table{/if}</label>
{/if}
    <input id="table" class="hidden" type="checkbox" bind:checked={$table} />

