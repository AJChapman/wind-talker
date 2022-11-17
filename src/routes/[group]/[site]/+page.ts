import type { PageLoad } from './$types'

export const load: PageLoad = ({ params, url }) => {
    return {
        group: params.group,
        site: params.site,
        searchParams: url.searchParams
    };
}

export const prerender = true


