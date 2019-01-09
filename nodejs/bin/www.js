const app = require('../app');
const debug = require('debug')('youversion-events:server');
const http = require('http');
const { createLightship } = require('lightship')
const net = require('net');

const LIGHTSHIP_PORT_RANGE = [ 9001, 9099 ]

function getPort() {
	let port = LIGHTSHIP_PORT_RANGE[0]
	return new Promise((resolve, reject) => {
		const server = net.createServer()
		server.on('error', (err) => {
			if (err.code !== 'EADDRINUSE') return reject(port)
			if (port > LIGHTSHIP_PORT_RANGE[1]) {
				throw new Error('Unable to find available port for Lightship on Passenger + Node instance')
			}
			return server.listen(++port)
		})
		server.on('listening', () => { return server.close(() => { return resolve(port) }) })
		server.listen(port)
	})
}

function startLightship() {
	return new Promise((resolve, reject) => {
		getPort().then((port) => {
			console.log(`Starting Lightship for Passenger + Node instance on port ${port}`)
			resolve(createLightship({ port }))
		}, (port) => {
			reject(new Error(`Unable to start Lightship for Passenger + Node instance on port ${port}`))
		})
	})
}

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
	startLightship().then((lightship) => {

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
			console.log('Shutting down Express server via registered Lightship handler.');
			httpServer.close();
		});
	}, (lightshipError) => {
		throw lightshipError
	})
}
