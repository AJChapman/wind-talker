import debounce from 'lodash.debounce'

import { settings, clampMinutesToShow } from './settings'
import { minutesIn24Hours } from './date'
import { endOfDate, formatISODate } from './date'
import { setSearchParam,  setSearchParams, setSearchParamToggle } from './search-params'

export interface State {
    date: Date | null
    minutesToShow: number
    compact: boolean
}

export function getStateFromSearchParams(searchParams: URLSearchParams): State {
    const date = getDateFromURLSearchParams(searchParams)
    let minutesToShow = clampMinutesToShow(getMinutesToShowFromURLSearchParams(searchParams))
    if (date !== null) {
        // If showing a particular date then show 24 hours
        minutesToShow = minutesIn24Hours
    }

    const compact = getCompactFromURLSearchParams(searchParams)
    return { date: date
           , minutesToShow: minutesToShow
           , compact: compact
           }
}

function getDateFromURLSearchParams(searchParams: URLSearchParams): Date | null {
    const d = searchParams.get('date')
    if (d === undefined || d === null) return null
    const dateMs = Date.parse(d)
    if (isNaN(dateMs)) return null
    return endOfDate(new Date(dateMs))
}

function getMinutesToShowFromURLSearchParams(searchParams: URLSearchParams): number {
    const m = searchParams.get('minutesToShow')
    if (m === undefined || m === null) return settings.minutesToShowDefault
    return parseInt(m)
}

function getCompactFromURLSearchParams(searchParams: URLSearchParams): boolean {
    return searchParams.has('compact')
}

export const updateSearchParamsFromState = debounce(setSearchParamsFromState, 1000, { leading: false, maxWait: 20000, trailing: true })
function setSearchParamsFromState(searchParams: URLSearchParams, state: State): void {
    const oldSearchString = searchParams.toString()
    if (state.date === null) {
        setSearchParam(searchParams, 'date', undefined)
        setSearchParam(searchParams, 'minutesToShow', state.minutesToShow === settings.minutesToShowDefault ? undefined : state.minutesToShow.toString())
    } else {
        setSearchParam(searchParams, 'date', formatISODate(state.date))
        setSearchParam(searchParams, 'minutesToShow', undefined)
    }
    setSearchParamToggle(searchParams, 'compact', state.compact)
    const newSearchString = searchParams.toString()
    if (newSearchString !== oldSearchString) setSearchParams(searchParams)
}
