import { goto } from '$app/navigation'
import { browser } from '$app/environment'
import { page } from '$app/stores'
import { get, writable, type Updater, type Writable } from 'svelte/store'

/* Adapted from sveltekit-search-params */

function noop<T>(_value: T) {}

export type Codec<T = any> = {
  encode: (value: T) => string | undefined // undefined means don't include this search parameter in order to encode this value
  decode: (value: string) => T | undefined
}

export type StoreOptions = {
  debounceHistory?: number
  pushHistory?: boolean
}

type SetTimeout = ReturnType<typeof setTimeout>

export function objectCodec<T extends object>(): Codec<T> {
  return {
    encode: (value: T) => JSON.stringify(value),
    decode: (value: string): T | undefined => {
      try {
        return JSON.parse(value)
      } catch (e) {
        return undefined
      }
    }
  }
}

export function arrayCodec<T = any>(): Codec<T[]> {
  return {
    encode: (value: T[]) => JSON.stringify(value),
    decode: (value: string): T[] | undefined => {
      try {
        return JSON.parse(value)
      } catch (e) {
        return undefined
      }
    }
  }
}

export function numberCodec(): Codec<number> {
  return {
    encode: (value: number) => value.toString(),
    decode: (value: string) => {
      const n = parseFloat(value)
      return isNaN(n) ? undefined : n
    }
  }
}

// The presence of this parameter's name in the URL means 'true', its absense means false
export function flagCodec(): Codec<boolean> {
  return {
    encode: (value: boolean) => (value ? '' : undefined),
    decode: (_value: string) => true // 'decode' would not be called for an absent parameter
  }
}

export function booleanCodec(): Codec<boolean> {
  return {
    encode: (value: boolean) => value + '', // 'true' or 'false'
    decode: (value: string) => value !== 'false'
  }
}

export function stringCodec(): Codec<string> {
  return {
    encode: (value: string) => value,
    decode: (value: string) => value
  }
}

// Each separate queryParam affects a global object: the URL search parameters.
// So we keep a global set of updates to search parameter values, where a value
// of 'undefined' means delete that parameter if present.
const searchParamValueUpdates = new Map<string, string | undefined>()

let searchParamUpdateTimeout: SetTimeout

export function queryParam<T>(
  name: string,
  defaultValue: T,
  { encode, decode }: Codec<T>,
  { debounceHistory = 0, pushHistory = true }: StoreOptions = {}
): Writable<T> {
  // This is the Svelte store that we use to store the canonical value
  const store = writable<T>()
  const { set: setStore, subscribe: subscribeStore, update: updateStore } = store
  setStore(defaultValue)

  // We also want to set the search parameter of the browser's URL, but maybe this isn't always available?
  // So we keep 'setRef' and change its 'set' key when we have a valid setter.
  const setRef: { set: (value: T) => void } = { set: noop }
  const setSearchParam = (value: T) => setRef.set(value)

  const scheduleSearchParamUpdates = (query: URLSearchParams, hash: string) => {
    clearTimeout(searchParamUpdateTimeout)
    const oldQueryString = query.toString()
    searchParamUpdateTimeout = setTimeout(async () => {
      // Run the updates
      searchParamValueUpdates.forEach((value, key) => {
        if (value === undefined) query.delete(key)
        else query.set(key, value)
      })

      // If the query string would now be changed then change it
      const newQueryString = query.toString()
      if (newQueryString !== oldQueryString) {
        // Replace e.g. 'compact=' with 'compact'
        const queryString = `?${newQueryString.replace(/=(?=&|$)/gm, '')}${hash}`

        // Change the URL
        // Push a new history item (if 'pushHistory')
        await goto(queryString, { keepFocus: true, noScroll: true, replaceState: !pushHistory })
        searchParamValueUpdates.clear()
      }
    }, debounceHistory) // If this is 0 then this runs more-or-less straight away
  }

  // Subscribe to the page to receive changes to the URL's search parameters
  const unsubPage = page.subscribe(($page) => {
    if (browser && $page !== undefined && $page.url !== undefined && $page.url.searchParams !== undefined) {
      // Create our setter, to set the value of the search param
      setRef.set = (value: T) => {
        // Update the value update for this search parameter.
        // We delete a search parameter if its current value is its default, to avoid cluttering the URL unnecessarily.
        searchParamValueUpdates.set(name, value === defaultValue ? undefined : encode(value))
        scheduleSearchParamUpdates(new URLSearchParams($page.url.searchParams), $page.url.hash)
      }

      // Get the current value of the search parameter and attempt to decode it, using the
      // default value if it's missing or decoding fails.
      const actualParam: string | null = $page.url.searchParams.get(name)
      const actualValue: T | undefined = actualParam === null ? defaultValue : decode(actualParam)
      const correctValue: T = actualValue ?? defaultValue

      // Set the value so the store always has a valid value
      setStore(correctValue)

      // Correct the search parameter in the URL if necessary.
      // This could happen if a user puts in a garbage value in the address.
      if (actualValue !== correctValue) setSearchParam(correctValue)
    }
  })

  return {
    set: (value) => {
      setStore(value)
      setSearchParam(value)
    },
    subscribe: (...props: Parameters<typeof subscribeStore>) => {
      const unsubStore = subscribeStore(...props)
      return () => {
        unsubStore()
        unsubPage()
      }
    },
    update: (updater: Updater<T>) => {
      updateStore(updater)
      setSearchParam(get(store))
    }
  }
}
