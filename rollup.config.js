import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

const plugins = [
  typescript(), // TypeScriptのコンパイル.
  commonjs(),   // CommonJSを解決.
]

if (process.env.NODE_ENV !== 'production') {
  // 開発時のみ使うプラグイン
} else {
  // 公開用のみ使うプラグイン
  plugins.push(uglify()) // ミニファイ
}

export default {
  input: './src/formValidate/index.ts',
  output: {
    file: './lib/formValidate/formValidate.js',
    format: 'umd',
    extend: true,
    name: "FormValidate",
  },
  plugins: plugins
}
