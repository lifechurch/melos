import { getClient } from '../client'

const NODE_ENV = (typeof process.env.NODE_ENV === 'undefined') ? 'staging' : process.env.NODE_ENV
const API_VERSION = (typeof process.env.API_VERSION === 'undefined') ? '3.1' : process.env.API_VERSION

function authenticate(user, password) {
	return getClient('users')
		.call('authenticate')
		.setVersion(API_VERSION)
		.setEnvironment(NODE_ENV)
		.auth(user, password)
		.post()
}

function viewUser(id, user, password) {
	return getClient('users')
		.call('view')
		.setVersion(API_VERSION)
		.setEnvironment(NODE_ENV)
		.params({ id })
		.auth(user, password)
		.get()
}

export default function(user, password) {
	return new Promise((resolve, reject) => {
		authenticate(user, password).then((authResponse) => {
			const { id } = authResponse

			if (typeof id === 'undefined') {
				reject(authResponse)
			} else {
				viewUser(id, user, password).then((viewResponse) => {
					resolve(viewResponse)
				}, (viewError) => {
					reject(viewError)
				})
			}
		}, (authError) => {
			reject(authError)
		})
	})
}