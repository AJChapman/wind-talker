import type { PageLoad } from './$types'

export const load: PageLoad = ({ params, url }) => {
    return {
        siteOrGroup: params.siteOrGroup
    };
}

export const prerender = true

