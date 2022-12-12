import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dtsPlugin from 'vite-plugin-dts';

const format = process.env.FORMAT === 'umd' ? 'umd' : 'es';

export default defineConfig({
	plugins: [
		cssInjectedByJsPlugin(),
		...(format === 'es' ? [dtsPlugin()] : [])
	],
	build: {
		sourcemap: true,
		minify: false,
		emptyOutDir: false,
		lib: {
			entry: `./src/index${format === 'umd' ? '-umd' : ''}.ts`,
			name: 'L.FreieTonne',
			fileName: (format) => `L.FreieTonne.${format === 'umd' ? 'js' : 'mjs'}`,
			formats: [format]
		},
		rollupOptions: {
			output: {
				globals: {
					'leaflet': 'L'
				}
			},
			external: ['leaflet']
		}
	},
	resolve: {
		alias: {
			'leaflet-freie-tonne': './src/L.FreieTonne.ts'
		}
	}
});
