'use strict';
const utils = require('./utils/utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const env = process.env.NODE_ENV === 'testing' ? require('./config/test.env') : require('./config/prod.env');

const webpackConfig = merge(baseWebpackConfig, {
	watch: true,
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
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
		// keep module.id stable when vender modules does not change
		new webpack.HashedModuleIdsPlugin(),
		// enable scope hoisting
		new webpack.optimize.ModuleConcatenationPlugin()
	]
});

module.exports = webpackConfig;
