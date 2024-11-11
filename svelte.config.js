import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess'

export default {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: sveltePreprocess({
        postcss: true
    }),

    kit: {
        adapter: adapter(),
        files: { lib: 'src' }
    }
}
