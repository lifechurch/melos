// https://github.com/bjyoungblood/es6-error
export default class ExtendableError extends Error {
	constructor(message = '') {
		super(message)

    // extending Error is weird and does not propagate `message`
		Object.defineProperty(this, 'message', {
			configurable: true,
			enumerable: false,
			value: message,
			writable: true,
		})

		Object.defineProperty(this, 'name', {
			configurable: true,
			enumerable: false,
			value: this.constructor.name,
			writable: true,
		})

		if (Error.hasOwnProperty('captureStackTrace')) {
			Error.captureStackTrace(this, this.constructor)
			return
		}

		Object.defineProperty(this, 'stack', {
			configurable: true,
			enumerable: false,
			value: (new Error(message)).stack,
			writable: true,
		})

	}
}

export class HttpError extends ExtendableError {
	constructor(response, json = null) {
		super(response.statusText)

		this.name = 'HttpError'
		this.api_response = json ? json.message : null
		this.status = response.status
		this.ok = response.ok
		this.url = response.url
	}
}
