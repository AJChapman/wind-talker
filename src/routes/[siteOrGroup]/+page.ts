import type { PageLoad } from './$types'

export const load: PageLoad = ({ params, url }) => {
    return {
        siteOrGroup: params.siteOrGroup,
        searchParams: url.searchParams
    };
}

export const prerender = true

