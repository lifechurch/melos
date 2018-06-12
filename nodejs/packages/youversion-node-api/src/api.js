import Promise from 'bluebird'
import https from 'https'
import querystring from 'qs'
import { fetchToken } from '@youversion/token-storage'
import util from 'util'
import Memcached from 'memcached'
import hash from 'object-hash'

import { decodeToken, decryptToken } from './tokenAuth/token'

// cache constants
const DEFAULT_CACHE_LIFETIME = process.env.DEFAULT_CACHE_LIFETIME || 604800 // 7 Days
const OVERRIDE_CACHE_LIFETIME = process.env.OVERRIDE_CACHE_LIFETIME || null

// HTTP timeout in milliseconds : must be a number!
let HTTP_TIMEOUT = 10000
if (process.env.HTTP_TIMEOUT && !isNaN(parseInt(process.env.HTTP_TIMEOUT, 10))) {
	HTTP_TIMEOUT = parseInt(process.env.HTTP_TIMEOUT, 10)
}

const MEMCACHE_SERVERS = (typeof process.env.MEMCACHE_SERVERS === 'string')
	? process.env.MEMCACHE_SERVERS.split(',')
	: [ '127.0.0.1:11211' ]

const memcached = new Memcached(MEMCACHE_SERVERS, {
	retries: 1,
	timeout: 1000,
	retry: 30000,
	factor: 1,
	failures: 3,
	poolSize: 25
});

function IsCacheable(method, auth, query) {
	return method.toUpperCase() === 'GET' &&
		!('token' in query) &&
		(
			typeof auth === 'undefined' ||
			auth === null ||
			auth === false
		)
}

function sortQueryParams(a, b) {
	if (a < b) {
		return -1
	}

	if (a > b) {
		return 1
	}

	return 0
}

function CacheKey(section, version, noun, query) {
	const hashConf = {
		unorderedArrays: true,
		unorderedSets: true
	}
	return `${version}_${section}_${noun}_${hash(query, hashConf)}`
}

function IsCacheValid(response) {
	return response !== false &&
		response !== null &&
		typeof response !== 'undefined'
}

function IsApiValid(response) {
	return typeof response === 'object' &&
		!('errors' in response)
}

function getCacheExpirationFromHeaders(headers) {
	const cacheControl = headers['cache-control'] || headers['Cache-Control']
	const yvCacheExpires = headers['X-YouVersion-Cache-Expires']

	if (typeof cacheControl !== 'undefined') {
		if (cacheControl.trim().toLowerCase() !== 'no-cache') {
			let lifetime
			cacheControl.split(',').forEach((value) => {
				let maxAge
				if (value.indexOf('max-age') > -1 || value.indexOf('Max-Age') > -1) {
					maxAge = value.trim().split('=')
					if (maxAge.length > 1) {
						lifetime = parseInt(maxAge[1], 10)
					}
				}
			})
			if (typeof lifetime !== 'undefined' && !Number.isNaN(lifetime)) {
				return lifetime
			}
		}
	}

	if (typeof yvCacheExpires !== 'undefined') {
		const cacheExpires = parseInt(yvCacheExpires, 10)
		if (!Number.isNaN(cacheExpires)) {
			return cacheExpires
		}
	}

	return null
}

function apiReqAndWriteCache(apiReq, cacheKey) {
	return new Promise((resolve, reject) => {
		apiReq().then((apiResponse) => {
			resolve(apiResponse)
			if (IsApiValid(apiResponse)) {
				memcached.set(cacheKey, apiResponse, apiResponse.cacheLifetime, () => {
					// TO-DO: Report this to Sentry
				})
			}
		}, (apiError) => {
			reject(apiError)
		})
	})
}

function httpReq(section, noun, query, auth, _extension, _method, _version, _environment, _contentType = null) {
	return new Promise((resolve, reject) => {
		const method = _method || 'GET'
		// for oauth, we don't want a version or extension in the url
		const extension = _extension === false
			? null
			: _extension || 'json'
		const version = _version === false
			? null
			: _version || '3.1'
		const environment = _environment || 'production'
		const envDomain = (environment.toLowerCase() !== 'production') ? 'youversionapistaging.com' : 'youversionapi.com';

		const options = {
			hostname: `${section}.${envDomain}`,
			path: `${version ? `/${version}` : ''}/${noun}${extension ? `.${extension}` : ''}${method === 'GET' ? `?${querystring.stringify(query, { sort: sortQueryParams, arrayFormat: 'brackets' })}` : ''}`,
			method,
			timeout: HTTP_TIMEOUT,
			headers: {
				Referer: `https://web.${envDomain}`,
				'User-Agent': 'Web App: Production',
				'X-YouVersion-Client': 'youversion',
				'X-YouVersion-App-Platform': 'web',
				'X-YouVersion-App-Version': '2',
				Accept: '*/*',
			}
		};

		let postbody = null
		if (method === 'POST') {
			// for oauth we don't want quotes
			postbody = extension
				? JSON.stringify(query)
				: query;
			// headers
			options.headers['Content-Type'] = _contentType || 'application/json';
			options.headers['Content-Length'] = Buffer.byteLength(postbody, 'utf8');
		}

		options.port = 443;

		if (auth === true) {
			const token = decodeToken(fetchToken());
			const sessionData = decryptToken(token.token);
			if (typeof sessionData === 'object') {
				if (typeof sessionData.email === 'string' && typeof sessionData.password === 'string') {
					options.auth = `${sessionData.email}:${sessionData.password}`;
				} else if (typeof sessionData.tp_token === 'string') {
					options.headers.Authorization = sessionData.tp_token;
				}
			}
		} else if (typeof auth === 'object') {
			if (typeof auth.username === 'string' && typeof auth.password === 'string') {
				options.auth = `${auth.username}:${auth.password}`;
			} else if (typeof auth.tp_token === 'string') {
				options.headers.Authorization = auth.tp_token;
			}
		}

		const req = https.request(options);

		req.setTimeout(HTTP_TIMEOUT);

		if (method === 'POST') {
			req.write(postbody);
		}

		req.on('response', (response) => {
			const lifetime = OVERRIDE_CACHE_LIFETIME || getCacheExpirationFromHeaders(response.headers) || DEFAULT_CACHE_LIFETIME
			let body = '';

			response.on('data', (chunk) => {
				body += chunk;
			});

			response.on('end', () => {
				try {
					if (extension === 'json' || extension === null) {
						// oauth doesn't have response in body
						const data = extension === null
							? JSON.parse(body) || {}
							: JSON.parse(body).response.data || {};
						if (util.isArray(data)) {
							const dataAsObj = {};
							dataAsObj[noun] = data;
							dataAsObj.cacheLifetime = lifetime
							resolve(dataAsObj);
						} else {
							data.cacheLifetime = lifetime
							resolve(data);
						}
					} else if (extension === 'po') {
						resolve(body);
					}
				} catch (ex) {
					reject(ex);
				}
			});
		});

		req.on('timeout', () => {
			req.abort();
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.end();
	})
}

export function api(section, noun, query, auth, extension, method, version, environment, contentType) {
	return new Promise((resolve) => {
		const apiReq = httpReq.bind(
			this,
			section,
			noun,
			query,
			auth,
			extension,
			method,
			version,
			environment,
			contentType
		)

		if (IsCacheable(method, auth, query)) {
			const cacheKey = CacheKey(section, version, noun, query)
			memcached.get(cacheKey, (cachedError, cachedResponse) => {
				if (cachedError) {
					resolve(apiReqAndWriteCache(apiReq, cacheKey))
				} else if (IsCacheValid(cachedResponse)) {
					resolve(cachedResponse)
				} else {
					resolve(apiReqAndWriteCache(apiReq, cacheKey))
				}
			})
		} else {
			resolve(apiReq())
		}
	});
}
