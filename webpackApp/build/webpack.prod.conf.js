'use strict';
const packJson = require('../package.json');
const path = require('path');
const utils = require('./utils/utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const env = process.env.NODE_ENV === 'testing'
	? require('./config/test.env')
	: require('./config/prod.env');

const webpackConfig = merge(baseWebpackConfig, {
	//devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('[name]-min.js'),
		chunkFilename: utils.assetsPath('[name]-min.js')
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env
		}),
		//new MinifyPlugin(),
		// UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
		new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: true,
	        dead_code: true
	      },
	      output: {
	        comments: false
	      },
	      sourceMap: false
		}),
		// keep module.id stable when vender modules does not change
		new webpack.HashedModuleIdsPlugin({deadcode: true}),
		// enable scope hoisting
		//new webpack.optimize.ModuleConcatenationPlugin()
	]
})

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
