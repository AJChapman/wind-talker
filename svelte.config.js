import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess({
        postcss: true
    }),

    kit: {
        adapter: adapter({ }),
        files: { lib: 'src' },
        prerender: {
            crawl: true,
            entries:
                [ "*" // Dynamic paths (do we have any?)
                , '/' // home page

                // Groups:
                , '/acthpa'
                , '/nevic'
                , '/svic'

                // Legacy paths:
                , '/acthpa/springhill'
                , '/acthpa/lakegeorge'
                , '/acthpa/lanyon'

                // Sites (should match `allSites` from freeflightwx-sites)
                , '/springhill'
                , '/lakegeorge'
                , '/lanyon'
                , '/mystic'
                , '/gundowring'
                , '/mtemu'
                , '/buckland'
                , '/porepunkah'
                , '/corryong'
                , '/flowerdale'
                , '/mtbroughton'
                , '/pops'
                , '/tunk'
                , '/kurutake'
                , '/eclipselx'
                , '/eclipselx2'
                , '/eclipselx3'
                , '/hooleydooley'
                , '/lakestclaire'
                , '/softys'
                , '/stringybark'
                , '/temp'
                , '/test'
                , '/winton'
                , '/woodstock'
                ]
        },
        paths: { base: '/new' }
    }
}

export default config
