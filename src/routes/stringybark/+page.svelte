<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { stringybark as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
