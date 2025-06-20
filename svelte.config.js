import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			platformProxy: {
				configPath: undefined,
				environment: undefined,
				persist: false
			},
			fallback: 'plaintext',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
		}),
		csrf: {
			// checkOrigin: process.env.NODE_ENV === 'development' ? false : true,
			checkOrigin: false,
		},
		alias: {
			"@db-drizzle": "./drizzle",
			"@db-drizzle/*": "./drizzle/*"
		}
	},
};

export default config;
