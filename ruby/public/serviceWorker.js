const cacheName = 'youversion-bible-v1'

self.addEventListener('install', function() {
	console.log('[ServiceWorker] Install')
})

self.addEventListener('activate', function() {
	console.log('[ServiceWorker] Activate')
})

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url)

	// Is this a Bible API call?
	const apiBible = /^.*\/api\/bible.*$/g
	if (apiBible.test(e.request.url)) {
		console.log('[ServiceWorker] This is a Bible API call')
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
	return e.respondWith(fetch(e.request))
})
