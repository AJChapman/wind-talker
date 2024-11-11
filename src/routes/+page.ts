import type { PageLoad } from './$types'

export const load: PageLoad = ({ params, url }) => {
    return {
        foo: url.searchParams.get('foo')
    };
}
