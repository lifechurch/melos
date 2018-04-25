import YouVersionAuth from '../api/YouVersionAuth'

const methods = [ 'authenticate', 'checkToken' ]

function getRequestAction(type, action) {
	const finalAction = Object.assign({}, action, { type })
	delete finalAction.api_auth
	return finalAction
}

function getFailureAction(type, action, errors) {
	const finalAction = Object.assign({}, action, { errors, type })
	delete finalAction.api_auth
	return finalAction
}

function getSuccessAction(type, action, response) {
	const finalAction = Object.assign({}, action, { response, type })
	delete finalAction.api_auth
	return finalAction
}

export default store => {
	return next => {
		return action => {
			const api_auth = action.api_auth

			if (typeof api_auth === 'undefined') {
				return next(action)
			}

			const { params } = api_auth
			if (!Array.isArray(params)) {
				throw new Error('Invalid Auth API params')
			}

			const method = api_auth.method
			if (typeof method !== 'string' || methods.indexOf(method) === -1) {
				throw new Error(`Invalid Auth API method: ${method}`)
			}
			const api_method = YouVersionAuth[method]

			const types = api_auth.types
			if (!Array.isArray(types) || types.length !== 3) {
				throw new Error('Invalid Auth API types')
			}
			const [ requestType, successType, failureType ] = types

			next(getRequestAction(requestType, action))

			return api_method.apply(this, params).then((response) => {
				if (typeof window !== 'undefined' && typeof window.__GA__ !== 'undefined') {
					window.__GA__.event({
						category: 'Auth',
						action: `Auth/${method}`
					})
				}
				next(getSuccessAction(successType, action, response))
				return response
			}, (error) => {
				next(getFailureAction(failureType, action, [ error ]))
				return error
			})
		}
	}
}