<script lang="ts">
    import { base } from '$app/paths'

    export let path: string
    export let classes: string = ''
</script>

<a class={classes} href="{base}/{path}"><slot /></a>
