var Promise = require('bluebird');
var	https = require('https');
var querystring = require('querystring');

export default {
	getTimezone(lat, lng) {
		return new Promise(function(resolve, reject) {
			var query = querystring.stringify({ 
				location: [lat,lng].join(','),
				timestamp: Math.floor(new Date().getTime()  / 1000),
				key: 'AIzaSyBMA0n8NXq9Z-84At4-cIOAseleESrfRGE'
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
		})
	} 
}