let config = {
	dev: {
		host: 'localhost',
		port: 10001
	},
	prod: {
		baseUrl: 'https://test.com/assets'
	}
};

config.dev.baseUrl = 'http://' + config.dev.host + ':' + config.dev.port;

module.exports = config;
