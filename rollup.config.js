function svgComponentPlugin() {
  return {
    name: 'svg-component',
    resolveId(source) {
      if (source.endsWith('.svg?component')) {
        return source;
      }
    },
    load(id) {
      if (id.endsWith('.svg?component')) {
        return `export default function SvgIcon() { return '<svg></svg>'; }`;
      }
    },
  };
}

export default {
  input: { index: './src/index.js' },
  plugins: [svgComponentPlugin()],
  output: {
    dir: 'dist-rollup',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: (chunk) => {
      console.log('[entryFileNames callback]', JSON.stringify({ name: chunk.name }));
      return `${chunk.name}.js`;
    },
  },
};
