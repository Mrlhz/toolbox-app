import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const banner = '#!/usr/bin/env node'

// https://www.rollupjs.com/guide/big-list-of-options
export default {
  input: './app/index.js',
  output: {
    exports: 'auto',
    file: './dist/index.js',
    format: 'cjs',
    name: 'Toolbox',
    banner,
  },
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),
  ],
}
