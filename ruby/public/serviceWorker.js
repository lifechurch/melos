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
	// http url (not chrome-extension:// .etc)
	const isCacheable = !(headers.has('authorization'))
		&& request.method === 'GET'
		&& request.url.includes('http')

	if (isCacheable) {
		return e.respondWith(
			caches.match(e.request.url).then(function(cacheResponse) {
				// Found it in the cache
				if (cacheResponse) {
					console.log('[ServiceWorker] Found it in Cache')
					return cacheResponse

				// Not in the cache
				} else {
					console.log('[ServiceWorker] Not in Cache')
					return fetch(e.request).then(function(fetchResponse) {
						console.log('[ServiceWorker] Fetched from API')
						return caches.open(cacheName).then(function(cache) {
							cache.put(e.request.url, fetchResponse.clone())
							console.log('[ServiceWorker] Fetched and Cached Data', e.request.url)
							return fetchResponse
						})
					})
				}
			})
		)
	}


	// Bypass cache and continue with HTTP request
	return e.respondWith(
		fetch(e.request).catch((err) => {
			console.log('fetch failed: do offline stuff?', err)
			return e.request
		})
	)
})
