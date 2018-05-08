const includePaths = require('rollup-plugin-includepaths');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const babel = require('rollup-plugin-babel');
const filesize = require('rollup-plugin-filesize');
const vue = require('rollup-plugin-vue');
const uglify = require('rollup-plugin-uglify');
const postcss = require('rollup-plugin-postcss');
const sprites = require('rollup-plugin-sprite');
const json = require('rollup-plugin-json');
const postcssAssets = require('postcss-assets');
const camelcase = require('camelcase');
const pkg = require('../package.json');
const params = require('./params');
const spritesConfig = require('./rollup.config.sprites');

//Sprites apply only once, is not necessary to apply to UMD and ES.
//We use only in UMD mode.

//Banner
const banner =
	'/*!\n' +
	' * ' + pkg.name + ' v.' + pkg.version + '\n' +
	' * ' + new Date().getFullYear() + ' THRON\n' +
	' */';

//Configuration:
const BUILD_FOR_PRODUCTION = process.env.BUILD === 'production';
const BASE_URL = BUILD_FOR_PRODUCTION ? params.prod.baseUrl : params.dev.baseUrl;
const BASE_PATH = 'src/static';

//Export UMD Config: browser-friendly UMD build
const UMD_OUTPUT = {
	input: 'src/index.js',
	output: {
		banner,
		name: 'uxComponents',
		file: pkg.browser,
		format: 'umd'
	},
	plugins: [
		includePaths({
			paths: ['src']
		}),
		vue({css: true}),
		json({
			exclude: 'node_modules'
		}),
		sprites(spritesConfig),
		eslint(), //see eslinrc.js
		postcss({
			inject: false,
			plugins: [postcssAssets({
				basePath: BASE_PATH,
				baseUrl: BASE_URL,
				loadPaths: [BASE_PATH]
			})]
		}), //postcss with plugins
		babel({ include: "src/**" }), // see .babelrc
		resolve(), // so Rollup can find node_modules
		commonjs(), // so Rollup can convert `ms` to an ES module
		BUILD_FOR_PRODUCTION && uglify({output: {comments: 'all'}}),
		BUILD_FOR_PRODUCTION && filesize() // show bundle size in console output
	]
};

//Export ES config
const ES_OUTPUT = {
	input: 'src/index.js',
	external: Object.keys(pkg.dependencies),
	output: [
		{banner, file: pkg.main, format: 'cjs'},
		{banner, file: pkg.module, format: 'es'}
	],
	plugins: [
		includePaths({
			paths: ['src']
		}),
		vue({css: true}),
		json({
			exclude: 'node_modules'
		}),
		eslint(),
		postcss({
			inject: false,
			plugins: [postcssAssets({
				basePath: BASE_PATH,
				baseUrl: BASE_URL,
				loadPaths: [BASE_PATH]
			})]
		}),
		babel({ include: "src/**" }), // see .babelrc
		BUILD_FOR_PRODUCTION && filesize() // show bundle size in console output
	]
};

module.exports = [ES_OUTPUT, UMD_OUTPUT];
