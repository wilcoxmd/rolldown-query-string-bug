import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr()],
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
      external: ['react', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
