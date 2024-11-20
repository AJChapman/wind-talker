import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from "mdsvex"

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md', '.svx']
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte", ".md", ".svx"],
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        //preprocess({ postcss: true }),
        vitePreprocess(),
        mdsvex(mdsvexOptions)
    ],

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
                , '/sqld'
                , '/nqld'
                , '/nsw'

                // Legacy paths:
                , '/acthpa/springhill'
                , '/acthpa/lakegeorge'
                , '/acthpa/lanyon'

                // Sites (should match `allSites` from freeflightwx-sites)
                , '/buckland'
                , '/corryong'
                , '/crackneck'
                , '/emu'
                , '/gundowring'
                , '/killarney'
                , '/lanyon'
                , '/mama'
                , '/mtinkerman'
                , '/porepunkah'
                , '/singlehill'
                , '/softys'
                , '/springhill'
                , '/stanwell'
                , '/stringybark'
                , '/tunk4'
                , '/wilsons'
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
                , '/kuratake'
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
