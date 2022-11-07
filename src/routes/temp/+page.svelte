<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { temp as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
