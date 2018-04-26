export function handleResponse(response) {
	return new Promise((resolve, reject) => {
		if (response.hasOwnProperty('errors') && response.errors.hasOwnProperty('length') && response.errors.length > 0) {
			reject(response)
		} else {
			resolve(response)
		}
	})
}
