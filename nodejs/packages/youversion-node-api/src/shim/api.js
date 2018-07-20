import base64 from 'base-64'
import 'isomorphic-fetch'

const querystring = require('qs');
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

		if (auth) {
			path += '/api_auth';
		} else {
			path += '/api';
		}

		path = [path, section, noun, version].join('/');

		if (query && method.toUpperCase() === 'GET') {
			path += `?${querystring.stringify(query)}`;
		}

		const fetchUrl = [
			secure ? 'https://' : 'http://',
			(typeof YV_API_HOST !== 'undefined') ? YV_API_HOST : window.location.host.split(':')[0],
			(typeof YV_API_PORT !== 'undefined') ? `:${YV_API_PORT}` : typeof window.location.host.split(':')[1] !== 'undefined' ? `:${window.location.host.split(':')[1]}` : '',
			path
		].join('')

		const options = {
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
			options.headers.authorization = `Basic ${base64.encode(`${auth.username}:${auth.password}`)}`
		} else if (typeof auth === 'object' && typeof auth.token === 'string') {
			options.headers.authorization = auth.token
		} else {
			const token = fetchToken();
			if (typeof token === 'string' && token.length > 0 && token !== 'undefined') {
				options.headers.authorization = `Bearer ${token}`
			}
		}

		if (method === 'POST') {
			options.body = JSON.stringify(query);
			options.headers['Content-Type'] = 'application/json';
		}

		fetch(fetchUrl, options).then((response) => {
			try {
				if (response.ok && response.status < 400) {
					if (extension === 'json') {
						response.json().then((jsonBody) => {
							if (Array.isArray(jsonBody)) {
								const dataAsObj = {};
								dataAsObj[noun] = jsonBody;
								resolve(dataAsObj);
							} else {
								resolve(jsonBody);
							}
						})
					} else if (extension === 'po') {
						response.text().then((textBody) => {
							resolve(textBody);
						})
					}
				} else {
					reject({ status: response.status, message: response.statusMessage });
				}
			} catch (ex) {
				reject(ex);
			}
		}).catch((error) => {
			reject(error);
		});
	});
}

module.exports = {
	api
};
