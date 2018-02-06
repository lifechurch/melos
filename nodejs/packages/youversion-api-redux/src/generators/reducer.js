import Immutable from 'immutable'
import typeGenerator from './type'

function defaultKey({ params, response, method }) {
	if (params && 'id' in params && params.id) {
		return [ method, params.id.toString() ]
	} else if (response && 'id' in response) {
		return [ method, response.id.toString() ]
	} else {
		return [ method ]
	}
}

const defaultActions = {
	request: ({ state, key }) => {
		if (key) {
			// if we're still loading the same action, just return state so we don't
			// overwrite the request
			const isLoading = Immutable.fromJS(state).getIn([...key, 'loading'])
			if (isLoading) return state

			return Immutable
				.fromJS(state)
				.mergeDeepIn(key, {
					loading: true,
				})
				.toJS()
		} else {
			return state
		}
	},
	failure: ({ state, key, api_errors }) => {
		if (key) {
			return Immutable.fromJS(state)
				.mergeDeepIn(key, {
					loading: false,
					errors: api_errors,
				})
				.toJS()
		} else {
			return state
		}
	},
	success: ({ state, response, key }) => {
		if (key) {
			return Immutable.fromJS(state)
				.mergeDeepIn(key, {
					loading: false,
					errors: false,
					response,
				})
				.toJS()
		} else {
			return state
		}
	}
}


/**
 * this function returns a reducer function
 *
 * if methodDefinitions is passed in, it is expecting any one or more of these
 * keys to actually be used: 'key', 'request', 'failure', 'success'
 * each of these are functions, each building data according to their name.
 *
 * if these methods aren't passed in, then the defaults defined in this doc will
 * be used instead
 *
 * @param  {[type]} endpoint               [description]
 * @param  {Object} [methodDefinitions={}] [description]
 * @return {[type]}                        [description]
 */
export default function reducerGenerator(endpoint, methodDefinitions = {}) {
	return function reducer(state = {}, action) {
		const { type: typeName, response, params, api_errors, customTypes } = action
		const { [`${endpoint}TypeLookup`]: typeLookup } = typeGenerator({ endpoint })
		const { endpoint: actionEndpoint, method, action: actionName } = typeLookup(typeName)

		const isCustomType = customTypes && customTypes[method] && customTypes[method].includes(typeName)
		if ((endpoint === actionEndpoint) || isCustomType) {
			const hasCustomReducer = Immutable.fromJS(methodDefinitions).hasIn([ method, actionName ])
			let thisReducer
			if (hasCustomReducer) {
				thisReducer = methodDefinitions[method][actionName]
			} else {
				thisReducer = defaultActions[actionName]
			}

			const hasCustomKey = Immutable.fromJS(methodDefinitions).hasIn([ method, 'key' ])
			let key
			if (hasCustomKey) {
				key = methodDefinitions[method].key({ params, response })
			} else {
				key = defaultKey({ params, response, method })
			}

			return thisReducer({ state, params, response, key, api_errors })

		} else {
			return state
		}
	}
}



export { defaultActions }
