const params = require('./params');
const serve = require('rollup-plugin-serve');

const serveConfig =  {
	// Launch in browser (default: false)
	open: false,

	// Show server address in console (default: true)
	verbose: true,

	// Multiple folders to serve from
	contentBase: ['dist'],

	// Set to true to return index.html instead of 404
	historyApiFallback: false,

	// Options used in setting up server
	host: params.dev.host,
	port: params.dev.port,

	//set headers
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};

module.exports = serve(serveConfig);
