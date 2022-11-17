import { goto } from '$app/navigation'

// Set the search parameters, replacing an empty equals with nothing, e.g. `?compact=` becomes simply `?compact`
export function setSearchParams(searchParams: URLSearchParams): void {
    goto(`?${searchParams.toString().replace(/=(?=&|$)/gm, '')}`);
}
