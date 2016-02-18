import Promise from 'bluebird'
import https from 'https'

export default {
	authenticate(user, password) {
		return new Promise(function(resolve, reject) {
			var postBody = JSON.stringify({
				user,
				password
			})

			var req = https.request({
				path: '/authenticate',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(postBody, 'utf8')
				}
			})

			req.write(postBody)

			console.log("POST BODY", postBody)

			req.on("response", function(response) {
				let body = ""

				response.on('data', function(chunk) {
					body += chunk
				})

				response.on("end", function() {
					try {
						resolve(JSON.parse(body))
					} catch(ex) {
						reject(ex)
					}
				})
			})

			req.on('error', function(e) {
				reject(e)
			})

			req.end()

			return req
		})
	}
}