import Immutable from 'immutable'
import typeGenerator from './type'

function actionObject(endpoint, method, version, methodDefinitions = {}) {
	const { [`${endpoint}TypeName`]: typeName } = typeGenerator({ endpoint })
	const defaultAction = {
		endpoint,
		method,
		version,
		http_method: 'get',
		types: [
			typeName(method, 'request'),
			typeName(method, 'success'),
			typeName(method, 'failure')
		],
	}

	if (method in methodDefinitions) {
		return Immutable
      .fromJS(defaultAction)
      .mergeDeep(methodDefinitions[method])
      .toJS()
	} else {
		return defaultAction
	}
}

export default function actionGenerator({ endpoint, version, methodDefinitions, prefetch = null, customTypes }) {
	return function action({ method, params = {}, extras = {}, auth = false }) {
		const api_call = actionObject(endpoint, method, version, methodDefinitions)
		api_call.params = params
		api_call.auth = auth
		return {
			params,
			extras,
			api_call,
			prefetch,
			customTypes
		}
	}
}
