'use strict';

const rollup = require('rollup');
const copydir = require('copy-dir');
const chokidar = require('chokidar');
//Beautiful log:
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const rollupConfig = require('../rollup.config');
const svg = require('./svgSprites');

//Constants:
const BUILD_FOR_PRODUCTION = process.env.BUILD === 'production';

let indexRollup = 'src/vueWrapper/index.js';
let indexFilesNameRollup = 'vue';
if (process.argv[2] === 'vanilla') {
	indexRollup = 'src/vanilla/index.js';
	indexFilesNameRollup = 'vanilla';
}

function updateName(fileName, appendThis) {
	if(appendThis === "vue"){
		return fileName;
	}else {
		return fileName.replace("vue", "vanilla");
	}
	/*if(fileName.indexOf(appendThis) !== -1){
		return fileName;
	}else{
		const split = fileName.split(".");
		split[0] = split[0] + '-' + appendThis;
		return split.join('.');
	}*/
}

function bundleWithRollup(inputOptions, outputOptions) {
	// create a bundle
	const bundlePromise = rollup.rollup(inputOptions);
	// write the bundle to disk
	return bundlePromise.then(bundle => bundle.write(outputOptions));
}

function watchFiles() {
	let chokidarInAction = false;
	let chokidarRequestPending = false;
	const globChokidar = "./src/**/*.scss";
	const globRollup = "src/**/!(*.scss)";

	chokidar.watch(globChokidar)
		.on("change", function (path, args) {
			log('chokidar detected something: ' + path + ' ' + JSON.stringify(args));
			//on bundling end:
			let onBundlingEnd = function () {
				chokidarInAction = false;
				if (chokidarRequestPending) {
					chokidarRequestPending = false;
					bundlingAction();
				}
			};
			//bundling action:
			let bundlingAction = function () {
				if (!chokidarInAction) {
					chokidarInAction = true;
					bundlingCode().finally(onBundlingEnd);
				} else {
					chokidarRequestPending = true;
				}
			};
			//bundle code:
			bundlingAction();
		})
		.on('error', function () {
			log('chokidar error', 2);
		});

	rollupConfig.forEach((config) => {
		//Force ouput as array:
		if (!Array.isArray(config.output)) {
			config.output = [config.output];
		}
		//Change configuration:
		config.input = indexRollup;
		config.output.forEach((output) => {
			output.file = updateName(output.file, indexFilesNameRollup);
		});
		//Add watch:
		config.watch = {};
		config.watch.include = globRollup;
		rollup.watch(config).on('event', function (evt) {
			if (evt.output) {
				let outputs = Array.isArray(evt.output) ? evt.output : [evt.output];
				let paths = "";
				outputs.forEach((output) => {
					paths += path.basename(output) + ' ';
				});
				if (evt.code === 'BUNDLE_END') {
					log(paths + ' updated', 1);
				} else {
					log("Creating " + paths);
				}
			}else{
				if(evt.error){
					log(evt.error, 2);
				}
			}
		});
	});
}

function copyAssets() {
	log('Copy assets');
	const DEST = 'src/static';
	return new Promise((resolve, reject) => {
		if (fs.existsSync(DEST)) {
			copydir(DEST, 'dist', function (err) {
				if (err) {
					console.log(err, 2);
					reject();
				} else {
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
}

function generateSvgSprite() {
	const TO = 'src/static/svgs/';
	const JSON = 'svg-sprite.json';
	log('Convert svg in json format (' + TO + JSON + ')');
	return svg('src/static/svgs/**/*.svg', TO, JSON);
}

function bundlingCode() {
	const promisesRollup = [];
	log('Start bundling library with rollup');
	rollupConfig.forEach((config) => {
		//Force ouput as array:
		if (!Array.isArray(config.output)) {
			config.output = [config.output];
		}
		//Change configuration input:
		config.input = indexRollup;
		config.output.forEach((output) => {
			//Change configuration output:
			output.file = updateName(output.file, indexFilesNameRollup);
			promisesRollup.push(bundleWithRollup(config, output));
		});
	});

	const allPromises = Promise.all(promisesRollup);
	allPromises.then(() => log('Rollup bundled', 1));

	//On all ready:
	return allPromises;
}

function endScript() {
	if (BUILD_FOR_PRODUCTION) {
		process.exit();
	}
}

function log(info, stats) {
	stats = (!stats || 0) ? 'yellow' : (stats === 1 ? 'green' : 'red');
	console.log(chalk[stats](info));
}

//Starts execution here:
const BUNDLE_FUNC = BUILD_FOR_PRODUCTION ? bundlingCode : watchFiles;
if (!BUILD_FOR_PRODUCTION) {
	log('Development mode');
	//Config serve:
	const rollupConfigServe = require('../rollup.config.serve');
	//Apply server only for first configuration:
	rollupConfig[0].plugins.push(rollupConfigServe);
}

generateSvgSprite().then(copyAssets).then(BUNDLE_FUNC).then(endScript);


