import type { PageLoad } from './$types'

export const load: PageLoad = ({ params, url }) => {
    return {
      siteOrGroup: params.siteOrGroup,
      url: url,
    };
}

export const prerender = true

