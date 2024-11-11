import { goto } from '$app/navigation'

// Set the search parameters, replacing an empty equals with nothing, e.g. `?compact=` becomes simply `?compact`
export function setSearchParams(searchParams: URLSearchParams): void {
    goto(`?${searchParams.toString().replace(/=(?=&|$)/gm, '')}`);
}

export function setSearchParamToggle(searchParams: URLSearchParams, name: string, value: boolean) {
    setSearchParam(searchParams, name, value ? '' : undefined)
}

export function setSearchParam(searchParams: URLSearchParams, name: string, value: string | undefined) {
    if (value === undefined) {
        if (searchParams.has(name)) searchParams.delete(name)
    } else {
        const current = searchParams.get(name)
        if (current !== value) searchParams.set(name, value)
    }
}
