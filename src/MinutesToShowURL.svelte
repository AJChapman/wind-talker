<script lang="ts">
    import { goto } from '$app/navigation'
    import debounce from 'lodash.debounce'

    import { settings, clampMinutesToShow } from './settings'
    import { setSearchParams } from './search-params'
    import { minutesIn24Hours } from './date'

    export let searchParams: URLSearchParams
    export let minutesToShow: number
    export let date: Date | null

    $: urlShouldHaveMinutesToShow = date === null && minutesToShow !== settings.minutesToShowDefault

    $: minutesToShow = getSearchParamsMinutesToShow(date, searchParams)

    function getSearchParamsMinutesToShow(date: Date | null, searchParams: URLSearchParams) {
        if (date !== null) return minutesIn24Hours
        const m = searchParams.get('minutesToShow')
        if (m === undefined || m === null) return settings.minutesToShowDefault
        const i = parseInt(m)
        return clampMinutesToShow(i)
    }

    // Keep the slider responsive by not calling `goto` too often
    const updateMinutesToShow = debounce(setMinutesToShow, 1000, { leading: false, maxWait: 20000, trailing: true })
    function setMinutesToShow(date: Date | null, minutesToShow: number) {
        // Try to call setSearchParams as little as possible, because it adds to browser history
        if (!urlShouldHaveMinutesToShow) {
            if (searchParams.has('minutesToShow')) {
                searchParams.delete('minutesToShow')
                setSearchParams(searchParams)
            }
        } else {
            const searchParamsMinutes = getSearchParamsMinutesToShow(date, searchParams)
            if (searchParamsMinutes !== minutesToShow) {
                searchParams.set('minutesToShow', minutesToShow.toString())
                setSearchParams(searchParams)
            }
        }
    }

    $: updateMinutesToShow(date, minutesToShow)
</script>
