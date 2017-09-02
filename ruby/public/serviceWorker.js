const cacheName = 'youversion-bible-v2'

self.addEventListener('install', function() {
	console.log('[ServiceWorker] Install')
	// what kind of assets do we want to cache here?
})

self.addEventListener('activate', function() {
	console.log('[ServiceWorker] Activate')
})

self.addEventListener('fetch', function(e) {
	const request = e.request
	const headers = request.headers
	// determine what's cacheable
	// api call from youversion
	// no authorization in header or does but is not going to send auth to server
	// get request
	const isCacheable = headers.has('X-YouVersion-Client')
		&& (!(headers.has('authorization')) || headers.has('X-ServiceWorker-Cacheable'))
		&& request.method === 'GET'
	// determine what's volatile
	// let's cache and fetch authed calls
	const isVolatile = headers.has('X-YouVersion-Client')
		&& request.method === 'GET'

	if (isCacheable) {
		return e.respondWith(
			caches.match(request.url).then(function(cacheResponse) {
				// Found it in the cache
				if (cacheResponse) {
					console.log('[ServiceWorker] Found it in Cache')
					return cacheResponse
				// Not in the cache
				} else {
					console.log('[ServiceWorker] Not in Cache')
					return fetch(request).then(function(fetchResponse) {
						console.log('[ServiceWorker] Fetched from API', fetchResponse)
						// don't cache errors
						if (!(fetchResponse && fetchResponse.status === 200)) {
							console.log('[ServiceWorker] Fetch error, no cache')
							return fetchResponse
						}
						return caches.open(cacheName).then(function(cache) {
							cache.put(request.url, fetchResponse.clone())
							console.log('[ServiceWorker] Fetched and Cached Data', request.url)
							return fetchResponse
						})
					})
				}
			})
		)
	}

	// return quickly with possibly stale data and then refresh with new data
	// when fetch returns
	if (isVolatile) {

	}

	// Bypass cache and continue with HTTP request
	return e.respondWith(
		fetch(request).catch((err) => {
			console.log('fetch failed: do offline stuff?', err)
			return err
		})
	)
})
