<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { springhill as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
