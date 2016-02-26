import { getClient } from '@youversion/js-api'
import ActionCreators from '../features/Auth/actions/creators'
import { routeActions } from 'react-router-redux'

const endpoints = [ 'events', 'search', 'users', 'bible' ]
const versions = [ '3.2', '3.1' ]
const envs = [ 'staging', 'production' ]
const http_methods = [ 'get', 'post' ]

function getRequestAction(type, action) {
	const finalAction = Object.assign({}, action, { ...action, type })
	delete finalAction.api_call
	return finalAction
}

function getFailureAction(type, action, api_errors) {
	if (!Array.isArray(api_errors)) {
		api_errors = [ api_errors ]
	}
	const finalAction = Object.assign({}, action, { api_errors, type })
	delete finalAction.api_call
	return finalAction
}

function getSuccessAction(type, action, response) {
	const finalAction = Object.assign({}, action, { response, type })
	delete finalAction.api_call
	return finalAction
}

export default store => next => action => {
	const api_call = action['api_call']

	if (typeof api_call === 'undefined') {
		return next(action)
	}

	const endpoint = api_call.endpoint
	if (typeof endpoint !== 'string' || endpoints.indexOf(endpoint) == -1) {
		throw new Error('Invalid API Endpoint [' + endpoint + ']')
	}

	const method = api_call.method
	if (typeof method !== 'string') {
		throw new Error('API method must be string')
	}

	const version = api_call.version
	if (typeof version !== 'string' || versions.indexOf(version) == -1) {
		throw new Error('Invalid API Version [' + version + ']')
	}

	let env = api_call.env
	if (typeof env !== 'string' || envs.indexOf(env) == -1) {
		env = envs[0]
	}

	const params = api_call.params
	if (typeof params !== 'object') {
		throw new Error('Invalid API params')
	}

	const http_method = api_call.http_method
	if (typeof http_method !== 'string' || http_methods.indexOf(http_method) == -1) {
		throw new Error('Invalid API HTTP Method')
	}

	const types = api_call.types
	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('Invalid API types')
	}
	const [ requestType, successType, failureType ] = types

	next(getRequestAction(requestType, action))

	const client = getClient(endpoint)
		.call(method)
		.setVersion(version)
		.params(params)

	const auth = api_call.auth
	if (auth === true) {
		client.auth()
	}

	const apiPromise = client[http_method]();
	apiPromise.then((response) => {
		const errors = response.errors
		if (Array.isArray(errors) && errors.length > 0) {
			next(getFailureAction(failureType, action, errors))
		} else {
			next(getSuccessAction(successType, action, response))
		}
		return response
	}, (error) => {
		if (error.status === 401) {
			next(ActionCreators.authenticationFailed())
			next(routeActions.push('/login'))
		} else {
			next(getFailureAction(failureType, action, [ error ]))
		}
		return error
	})

	return apiPromise
}