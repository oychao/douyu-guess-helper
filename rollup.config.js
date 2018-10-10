import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'bin/bundle.js',
      name: 'douyuGuessHelper',
      format: 'iife',
      globals: {
        '@tensorflow/tfjs': 'tf'
      }
    }
  ],
  plugins: [
    typescript()
  ],
  external: ['fs', 'path', 'jsonfile', '@tensorflow/tfjs']
};
