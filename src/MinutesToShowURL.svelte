<script lang="ts">
    import { goto } from '$app/navigation'
    import debounce from 'lodash.debounce'
    import { setSearchParams } from './search-params'

    import { settings, clampMinutesToShow } from './settings'

    export let searchParams: URLSearchParams
    export let minutesToShow: number

    $: minutesToShow = getSearchParamsMinutesToShow(searchParams)

    function getSearchParamsMinutesToShow(searchParams: URLSearchParams) {
        const m = searchParams.get('minutesToShow')
        if (m === undefined || m === null) return settings.minutesToShowDefault
        const i = parseInt(m)
        return clampMinutesToShow(i)
    }

    // Keep the slider responsive by not calling `goto` too often
    const updateMinutesToShow = debounce(setMinutesToShow, 1000, { leading: false, maxWait: 20000, trailing: true })
    function setMinutesToShow(minutesToShow: number) {
        // Try to call setSearchParams as little as possible, because it adds to browser history
        if (minutesToShow === settings.minutesToShowDefault) {
            if (searchParams.has('minutesToShow')) {
                searchParams.delete('minutesToShow')
                setSearchParams(searchParams)
            }
        } else {
            const searchParamsMinutes = getSearchParamsMinutesToShow(searchParams)
            if (searchParamsMinutes !== minutesToShow) {
                searchParams.set('minutesToShow', minutesToShow.toString())
                setSearchParams(searchParams)
            }
        }
    }

    $: updateMinutesToShow(minutesToShow)
</script>
