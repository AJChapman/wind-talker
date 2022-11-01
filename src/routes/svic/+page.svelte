<script lang="ts">
    import Group from '$lib/Group.svelte'
    import { svic as group, svicSites as sites } from '$lib/freeflightwx-sites'
</script>

<Group {group} {sites} />
