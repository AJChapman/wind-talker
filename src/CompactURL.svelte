<script lang="ts">
    import { setSearchParams } from './search-params'

    export let searchParams: URLSearchParams
    export let compact: boolean

    $: compact = searchParams.has('compact')

    $: {
        if (compact && !searchParams.has('compact')) {
            searchParams.set('compact', '')
            setSearchParams(searchParams)
        }
        if (!compact && searchParams.has('compact')) {
            searchParams.delete('compact')
            setSearchParams(searchParams)
        }
    }
</script>
