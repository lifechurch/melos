// var Promise = require('bluebird'),
const querystring = require('qs');
const	https = require('https');
const http = require('http');
const fetchToken = require('@youversion/token-storage').fetchToken;

function api(section, noun, query, auth, extension, method, version) {
	return new Promise((resolve, reject) => {

		if (!extension) {
			extension = 'json';
		}

		if (!method || ['GET', 'POST'].indexOf(method.toUpperCase()) == -1) {
			method = 'GET';
		}

		if (!version) {
			version = '3.1';
		}

		const secure = window.location.protocol.toUpperCase() === 'https:';
		let path = '';
		let postbody = '';

		if (auth) {
			path += '/api_auth';
		} else {
			path += '/api';
		}

		path = [path, section, noun, version].join('/');

		if (query && method.toUpperCase() === 'GET') {
			path += `?${querystring.stringify(query)}`;
		}

		const options = {
			hostname: (typeof YV_API_HOST !== 'undefined') ? YV_API_HOST : window.location.host.split(':')[0],
			port: (typeof YV_API_PORT !== 'undefined') ? YV_API_PORT : window.location.host.split(':')[1] || null,
			path,
			method,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': 0,
				// add this to client calls so we can check all youversion api
				// calls in the service worker by checking the existence of this header
				'X-YouVersion-Client': 'youversion',
			}
		}
		// we can't rely on authorization header to check for an authed call to the
		// api because we always send auth to the server from the client
		// so we want to let the service worker know wether this call is cacheable
		if (!auth) { options.headers['X-ServiceWorker-Cacheable'] = 'true' }

		if (typeof auth === 'object' && typeof auth.username === 'string' && typeof auth.password === 'string') {
			options.auth = `${auth.username}:${auth.password}`;
		} else if (typeof auth === 'object' && typeof auth.token === 'string') {
			options.headers.authorization = auth.token
		} else {
			const token = fetchToken();
			if (typeof token === 'string' && token.length > 0 && token !== 'undefined') {
				options.headers.authorization = `Bearer ${token}`
			}
		}

		if (method == 'POST') {
			postbody = JSON.stringify(query);
			options.headers['Content-Type'] = 'application/json';
			options.headers['Content-Length'] = Buffer.byteLength(postbody, 'utf8');
		}

		const req = (secure ? https.request(options) : http.request(options));

		if (method.toUpperCase() === 'POST') {
			req.write(postbody);
		}

		req.on('response', (response) => {
			let body = '';

			response.on('data', (chunk) => {
				body += chunk;
			});

			response.on('end', () => {
				try {
					if (response.statusCode < 400) {
						if (extension === 'json') {
							// resolve(JSON.parse(body));
							const data = JSON.parse(body) || {};
							if (Array.isArray(data)) {
								const dataAsObj = {};
								dataAsObj[noun] = data;
								resolve(dataAsObj);
							} else {
								resolve(data);
							}
						} else if (extension == 'po') {
							resolve(body);
						}
					} else {
						reject({ status: response.statusCode, message: response.statusMessage });
					}
				} catch (ex) {
					reject(ex);
				}
			});
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.end();
	});
}

module.exports = {
	api
};
