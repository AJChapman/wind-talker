<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { kurutake as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
