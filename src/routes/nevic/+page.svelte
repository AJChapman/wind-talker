<script lang="ts">
    import Group from '$lib/Group.svelte'
    import { nevic as group, nevicSites as sites } from '$lib/freeflightwx-sites'
</script>

<Group {group} {sites} />
