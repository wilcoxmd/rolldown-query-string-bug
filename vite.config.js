import { defineConfig } from 'vite';

// Minimal plugin that transforms SVG imports with ?component query into JS modules
// (simulates what vite-plugin-svgr does with ?react)
function svgComponentPlugin() {
  return {
    name: 'svg-component',
    resolveId(source, importer) {
      if (source.endsWith('.svg?component')) {
        return source; // keep the query string in the module ID
      }
    },
    load(id) {
      if (id.endsWith('.svg?component')) {
        return {
          code: `export default function SvgIcon() { return '<svg></svg>'; }`,
          moduleType: 'js',
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [svgComponentPlugin()],
  build: {
    lib: {
      entry: { index: './src/index.js' },
      formats: ['es'],
      fileName: (format, entryName) => {
        console.log('[fileName callback]', JSON.stringify({ format, entryName }));
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
