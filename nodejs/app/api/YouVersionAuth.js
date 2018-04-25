// import Promise from 'bluebird'
import https from 'https'
import { fetchToken } from '@youversion/token-storage'

function handleRequest(path, method, postBody) {
	return new Promise((resolve, reject) => {
		const headers = {
			'Content-Type': 'application/json'
		}

		if (method === 'POST') {
			headers['Content-Length'] = Buffer.byteLength(postBody, 'utf8')
		}

		const token = fetchToken()
		if (typeof token === 'string' && token.length > 0) {
			headers.authorization = `Bearer ${token}`
		}

		const req = https.request({
			path,
			method,
			headers
		})

		if (method === 'POST') {
			req.write(postBody)
		}

		req.on('response', (response) => {
			let body = ''

			response.on('data', (chunk) => {
				body += chunk
			})

			response.on('end', () => {
				try {
					if (response.statusCode < 400) {
						if (body.length === 0) {
							resolve({ status: response.statusCode, message: response.statusMessage })
						} else {
							resolve(JSON.parse(body))
						}
					} else {
						reject(new Error(response.statusMessage))
					}

				} catch (ex) {
					reject(ex)
				}
			})
		})

		req.on('error', (e) => {
			reject(e)
		})

		req.end()

		return req
	})
}

export default {
	authenticate(user, password) {
		const postBody = JSON.stringify({
			user,
			password
		})

		return handleRequest('/authenticate/login', 'POST', postBody)
	},

	checkToken() {
		return handleRequest('/authenticate/checkToken', 'GET')
	}
}