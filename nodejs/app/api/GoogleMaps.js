// var Promise = require('bluebird');
const	https = require('https');
const querystring = require('querystring');

const key = 'AIzaSyBMA0n8NXq9Z-84At4-cIOAseleESrfRGE'

export default {
	getTimezone(lat, lng) {
		return new Promise((resolve, reject) => {
			const query = querystring.stringify({
				location: [lat, lng].join(','),
				timestamp: Math.floor(new Date().getTime() / 1000),
				key
			})

			const options = {
				hostname: 'maps.googleapis.com',
				port: 443,
				path: `/maps/api/timezone/json?${query}`,
				method: 'GET'
			}

			const req = https.request(options)

			req.on('response', (response) => {
				let body = '';

				response.on('data', (chunk) => {
					body += chunk;
				});

				response.on('end', () => {
					try {
						resolve(JSON.parse(body));
					} catch (ex) {
						reject(ex);
					}
				});
			});

			req.on('error', (e) => {
				reject(e);
			});

			req.end();

			return req
		})
	},

	getPlace(placeId) {
		return new Promise((resolve, reject) => {
			const request = { placeId }
			const service = new google.maps.places.PlacesService(document.createElement('DIV'))
			service.getDetails(request, (place, status) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					resolve(place)
				} else {
					reject()
				}
			})
		})
	}
}