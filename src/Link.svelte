<script lang="ts">
    import { base } from '$app/paths'
    import { page } from '$app/stores'
    import { tidyQueryString } from '$lib/search-params'

    export let path: string
    export let classes: string = ''

    $: searchParams = tidyQueryString($page.url.search);
</script>

<a class={classes} href="{base}/{path}/{searchParams}"><slot /></a>
