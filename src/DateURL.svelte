<script lang="ts">
    import { setSearchParams } from './search-params'
    import { endOfDate, formatISODate } from './date'

    export let searchParams: URLSearchParams
    export let date: Date | null

    $: date = getSearchParamsDate(searchParams)

    function getSearchParamsDate(searchParams: URLSearchParams): Date | null {
        const d = searchParams.get('date')
        if (d === undefined || d === null) return null
        const dateMs = Date.parse(d)
        if (isNaN(dateMs)) return null
        return endOfDate(new Date(dateMs))
    }

    $: {
        if (date === null) {
            if (searchParams.has('date')) {
                searchParams.delete('date')
                setSearchParams(searchParams)
            }
        } else {
            const searchParamsDate = getSearchParamsDate(searchParams)
            if (searchParamsDate === null || searchParamsDate.getTime() !== date.getTime()) {
                searchParams.set('date', formatISODate(date))
                setSearchParams(searchParams)
            }
        }
    }
</script>
