import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

export default {
  entry: 'assets/js/src/about.js',    //需要打包的文件
  dest: 'assets/js/dist/about.js',  //打包后的文件
  format: 'cjs',       // iife, cjs, es
  useStrict: true,
  sourceMap: false,  //inline，线上环境设置为false
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    babel({
      presets: [ "es2015-rollup",'stage-2', 'react'],
      //plugins: [["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": "true" }]],
      babelrc: false, // 不采用babelrc配置，否则上面的presets设置无效
      compact: true, // 事实上，只要不为auto就不会警告
      exclude: 'node_modules/**'
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports : {
        'node_modules/react/react.js' : ['Component','Children','createElement','PropTypes'],
        'node_modules/react-dom/index.js' : ['ReactDOM'],
        'node_modules/antd/lib/index.js' : [
          'Table',
          //'Form', 'Calendar', 'Card', 'Input', 'Select', 'Checkbox', 'DatePicker','Col', 'Radio', 'Button', 'Modal', 'message', 'Icon'
        ]
      }
    }),
    globals(),
    builtins(),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
