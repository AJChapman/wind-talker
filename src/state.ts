import { settings, clampMinutesToShow } from './settings'
import { endOfDate, formatISODate } from './date'
import { queryParam, flagCodec } from './search-params'
import type { Writable } from 'svelte/store'

export const date: Writable<Date | null> = queryParam('date', null, {
  encode: (d: Date | null) => (d === null ? undefined : formatISODate(d)),
  decode: (s: string): Date | undefined => {
    const dateMs = Date.parse(s)
    if (isNaN(dateMs)) return undefined
    return endOfDate(new Date(dateMs))
  }
})

export const minutesToShow: Writable<number> = queryParam(
  'minutesToShow',
  settings.minutesToShowDefault,
  {
    encode: (n: number) => n.toString(),
    decode: (s: string): number | undefined => {
      const n = parseFloat(s)
      return isNaN(n) ? undefined : clampMinutesToShow(n)
    }
  },
  { debounceHistory: 1500 }
)

export const compact: Writable<boolean> = queryParam('compact', false, flagCodec())

export const table: Writable<boolean> = queryParam('table', false, flagCodec())

export const showHelp: Writable<boolean> = queryParam('help', false, flagCodec())
