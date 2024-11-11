<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { mtemu as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
