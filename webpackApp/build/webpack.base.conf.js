'use strict';
const utils = require('./utils/utils');
const path = require('path');
const config = require('./config');
const webpackRequireHttp = require('webpack-require-http');

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		'thron-models': './src/index.js'
	},
	output: {
		library: 'THRONModels',
		libraryTarget: 'umd',
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': resolve('src')
		},
		modules: ['src/js/', 'src', 'node_modules'],
        mainFields: ['module', 'browser', 'main'],
	},
	externals: [webpackRequireHttp],
	module: {
		rules: [
			...(config.dev.useEslint
				? [
						{
							test: /\.(js)$/,
							loader: 'eslint-loader',
							enforce: 'pre',
							include: [resolve('src')],
							options: {
								formatter: require('eslint-friendly-formatter'),
								emitWarning: !config.dev.showEslintErrorsInOverlay
							}
						}
				  ]
				: []),
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			}
		]
	}
};
