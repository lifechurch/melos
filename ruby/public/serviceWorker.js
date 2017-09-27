const version = 1
const cacheName = `youversion-v${version}`

function fetchThenCache(request) {
	return fetch(request).then((fetchResponse) => {
		console.log('[ServiceWorker] Fetched from API', fetchResponse)
		// don't cache errors
		if (!(fetchResponse && fetchResponse.status === 200)) {
			console.log('[ServiceWorker] Not 200, no cache')
			return fetchResponse
		}
		return caches.open(cacheName).then((cache) => {
			cache.put(request.url, fetchResponse.clone())
			console.log('[ServiceWorker] Fetched and Cached Data', request.url)
			return fetchResponse
		})
	})
}

async function deleteCacheEntriesMatching(name, matchFunc) {
	const cache = await caches.open(name)
	const cachedRequests = await cache.keys()
	const requestsToDelete = cachedRequests
		.filter((request) => {
			return matchFunc(request.url)
		})
	return Promise.all(
		requestsToDelete.map((request) => {
			return cache.delete(request.url)
		})
	)
}



// SERVICE WORKER METHODS --------------------------------------------

// INSTALL
self.addEventListener('install', () => {
	console.log('[ServiceWorker] Install')
	// what kind of assets do we want to cache here?
})

// ACTIVATE
self.addEventListener('activate', (e) => {
	// remove all caches that don't match the current version
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (cacheName.indexOf(key) === -1) {
					return caches.delete(key)
				}
				return null
			}))
		})
	)
})

// FETCH
self.addEventListener('fetch', (e) => {
	const headers = e.request.headers

	// const isYouversionApi = headers.has('X-YouVersion-Client')
	// const isActionRequest = e.request.method === 'POST'
	// 	|| e.request.method === 'PUT'
	// 	|| e.request.method === 'DELETE'
	//
	// /**
	//  * Invalidating or force updating previous caches:
	//  * 		youversionapi and post, put or delete request
	//  *
	//  * let's delete the corresponding cached responses when we see a request that
	//  * is going to invalidate it i.e.
	//  * delete /subscriptions when we do a PUT on /subscriptions/2461
	//  * or /subscriptions/2461 when we forceUpdate /subscriptions
	//  */
	// const isInvalidating = isYouversionApi
	// 	&& isActionRequest
	// const forceUpdate = headers.has('X-YouVersion-Client')
	// 	&& headers.has('X-ServiceWorker-Force-Update')
	// 	&& e.request.method === 'GET'
	// if (isInvalidating || forceUpdate) {
	// 	return e.respondWith(
	// 		deleteCacheEntriesMatching(
	// 			cacheName,
	// 			(key) => {
	//
	// 				console.log('isDELETE',
	// 					e.request.url,
	// 					key,
	// 					e.request.url.startsWith(key.split('?')[0]),
	// 					key.split('?')[0].startsWith(e.request.url)
	// 				)
	// 				// if we're invalidating a parent collection by putting on a child resource
	// 				// then we want to remove all parents
	// 				// if we're forceupdating a parent collection, then let's remove all children
	// 				return isInvalidating
	// 					? e.request.url.startsWith(key.split('?')[0])
	// 					: key.split('?')[0].startsWith(e.request.url)
	// 			}
	// 		).then(() => {
	// 			return fetchThenCache(e.request)
	// 		})
	// 	)
	// }
	//
	// /**
	//  * Is cacheable:
	//  * 		youversionapi and GET request
	//  *
	//  * return with cached data after fetching to update cache for next request
	//  */
	// const isCacheable = isYouversionApi
	// 	&& e.request.method === 'GET'
	// if (isCacheable) {
	// 	return e.respondWith(
	// 		caches.match(e.request.url).then((cacheResponse) => {
	// 			// first fetch the new data (and also cache it)
	// 			let returnVal = fetchThenCache(e.request)
	// 			// if we have a cached value, then return with that before the fetchResponse
	// 			// returns
	// 			if (cacheResponse) {
	// 				console.log('[ServiceWorker] Found it in Cache')
	// 				returnVal = cacheResponse
	// 			}
	// 			return returnVal
	// 		})
	// 	)
	// }

	// Bypass cache and continue with HTTP e.request
	return e.respondWith(
		fetch(e.request).catch((err) => {
			console.log('fetch failed: do offline stuff?', err)
			return new Response(err)
		})
	)
})


// FIREBASE MESSAGING ----------------------------------------------------------

// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: '201895780642'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const firebaseMessaging = firebase.messaging()
// handle message received while app is in the background
firebaseMessaging.setBackgroundMessageHandler((payload) => {
	const { data } = payload
	console.log('background notification', payload)
	if (data) {
		const notificationPayload = {
			'title': 'YouVersion',
			'body': data.message,
			'click_action': data.url,
			'icon': '/apple-touch-icon.png'
		}

		return self
			.registration
			.showNotification(notificationPayload.title, notificationPayload)
	}
})
