var Promise = require('bluebird');
var	https = require('https');
var querystring = require('querystring');

const key = 'AIzaSyBMA0n8NXq9Z-84At4-cIOAseleESrfRGE'

export default {
	getTimezone(lat, lng) {
		return new Promise(function(resolve, reject) {
			var query = querystring.stringify({
				location: [lat,lng].join(','),
				timestamp: Math.floor(new Date().getTime()  / 1000),
				key
			})

			var options = {
				hostname: 'maps.googleapis.com',
				port: 443,
				path: '/maps/api/timezone/json?' + query ,
				method: 'GET'
			}

			var req = https.request(options)

			req.on("response", function(response) {
				var body = "";

				response.on('data', function(chunk) {
					body += chunk;
				});

				response.on("end", function() {
					try {
						resolve(JSON.parse(body));
					} catch(ex) {
						reject(ex);
					}
				});
			});

			req.on('error', function(e) {
				reject(e);
			});

			req.end();

			return req
		})
	},

	getPlace(placeId) {
		return new Promise(function(resolve, reject) {
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