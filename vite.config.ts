import { builtinModules } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'


import packageJson from './package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getPackageName = () => packageJson.name

function getPackageNameCamelCase() {
  try {
    return getPackageName().replace(/-./g, char => char[1]!.toUpperCase())
  }
  catch (err) {
    throw new Error('Name property in package.json is missing.')
  }
}

export default defineConfig({
  base: './',
  esbuild: {
    define: {
      'process.env': 'import.meta.env',
    },
    drop: [
      /* 'console' */
      'debugger',
    ],
    keepNames: true,
    treeShaking: true,
    color: true,
  },
  build: {
    target: 'esnext',
    outDir: './dist',
    minify: true,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: getPackageNameCamelCase(),
      formats: ['cjs'],
      fileName: () => 'main.cjs',
    },
    rollupOptions: {
      external: [
        /node_modules/,
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
      ],
    },
  },

})
