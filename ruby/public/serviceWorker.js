const cacheName = 'youversion-bible-v1'

self.addEventListener('install', function() {
	console.log('[ServiceWorker] Install')
	// what kind of assets do we want to cache here?
})

self.addEventListener('activate', function() {
	console.log('[ServiceWorker] Activate')
})

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url)
	const request = e.request
	const headers = request.headers

	// determine what's cacheable
	// no authorization
	// get request
	// http protocol (not chrome-extension:// .etc)
	const whiteListed = /\.youversionapi/.test(request.url)
		|| /\/api\//.test(request.url)
	const isCacheable = !(headers.has('authorization'))
		&& request.method === 'GET'
		&& /^http/.test(request.url)
		&& whiteListed

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

	// Bypass cache and continue with HTTP request
	return e.respondWith(
		fetch(request).catch((err) => {
			console.log('fetch failed: do offline stuff?', err)
			return err
		})
	)
})
