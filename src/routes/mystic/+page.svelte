<script lang="ts">
    import WindTalkerPage from '$lib/WindTalkerPage.svelte'
    import { mystic as site } from '$lib/freeflightwx-sites'
</script>

<WindTalkerPage {site} />
