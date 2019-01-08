const app = require('../app');
const debug = require('debug')('youversion-events:server');
const http = require('http');
const { createLightship } = require('lightship')
const delay = require('delay');

/**
* Get port from environment and store in Express.
*/
module.exports = function () {
	if (typeof (PhusionPassenger) !== 'undefined') {
		PhusionPassenger.configure({ autoInstall: false });
	}

  /**
	* Normalize a port into a number, string, or false.
	*/
	const normalizePort = (val) => {
		if (typeof (PhusionPassenger) !== 'undefined') {
			return 'passenger'
		} else {
			const port = parseInt(val, 10);

			if (isNaN(port)) {
				// named pipe
				return val;
			}

			if (port >= 0) {
				// port number
				return port;
			}

			return false;
		}
	}


	/**
	* Create HTTP server.
	*/
	const port = normalizePort(process.env.PORT || '3000');
	app.set('port', port);
	const server = http.createServer(app);
	const lightship = createLightship({ port: 8081 })

	/**
	* Event listener for HTTP server "error" event.
	*/
	const onError = (error) => {
		if (error.syscall !== 'listen') {
			throw error;
		}

		const bind = typeof port === 'string'
			? `Pipe ${port}`
			: `Port ${port}`;

			// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(`${bind} requires elevated privileges`);
				lightship.shutdown();
				break;
			case 'EADDRINUSE':
				console.error(`${bind} is already in use`);
				lightship.shutdown();
				break;
			default:
				throw error;
		}
	}

	/**
	* Event listener for HTTP server "listening" event.
	*/
	const onListening = () => {
		lightship.signalReady();
		debug('listening')
		const addr = server.address();
		const bind = typeof addr === 'string'
			? `pipe ${addr}`
			: `port ${addr.port}`;
		debug(`Listening on ${bind}`);
	}

	/**
	* Listen on provided port, on all network interfaces.
	*/
	server.on('error', onError);
	server.on('listening', onListening);
	const httpServer = server.listen(port);

	lightship.registerShutdownHandler(async () => {
    // Allow sufficient time for existing HTTP requests to finish
		console.log('Express server received shutdown signal. Waiting before closing down...');
		await delay(30 * 1000); // 30 seconds
		console.log('Shutting down Express server via registered Lightship handler.');
		httpServer.close();
	});
}
