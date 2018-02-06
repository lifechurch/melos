const hash = require('object-hash');
const api = require('./api').api;

setInterval(() => {
	api('videos', 'view', { id: 269 }, false, 'json', 'GET', '3.1', 'staging').then(
			(response) => {
				console.log('r-outside-response')
			},
			(error) => {
				console.log('e-outside-error')
			}
		);
}, 1000);


/**
 + handle invalid response by not caching
 + handle auth calls properly by not caching
 + determine acceptable method for setting lifetime/expiration
 + if not caching, make http request directly
 + keep http request code DRY
 + turn callbacks into promises
 + Get memcache server from ENV
 + Put version first in cache key
*/
