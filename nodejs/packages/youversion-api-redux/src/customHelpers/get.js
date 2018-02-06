import Immutable from 'immutable'

/**
 * this get helper uses the request action to bypass the rest-api-redux middleware
 * actions which prevent concurrent requests to the same api noun
 * @param  {[string]} actionName [description]
 * @param  {[object]} pathvars   [description]
 * @param  {[object]} params     [description]
 * @return {[promise]}           [description]
 */
const customGet = ({
	actionName,
	pathvars,
	params = {},
	auth,
	serverLanguageTag,
	dispatch,
	actions,
}) => {
	// setup headers that aren't applied by the rest endpoint options function
	// because this isn't a crud method
	let headers = {}
	if (auth && auth.isLoggedIn) {
		headers = Immutable
			.fromJS(headers)
			.merge({ Authorization: `${auth.oauth.token_type} ${auth.oauth.access_token}` })
			.toJS()
	}
	headers = Immutable
		.fromJS(headers)
		.merge({ 'Accept-Language': serverLanguageTag || auth.userData.language_tag })
		.toJS()

	// send headers to options function in params
	const newParams = Immutable
		.fromJS(params)
		.merge({ headers })
		.toJS()
	// use the pure xhr request and then fire the action for the reducer when
	// the response comes back
	return new Promise((resolve) => {
		actions[actionName].request(pathvars, newParams)
			.then((data) => {
				dispatch({
					type: `custom__${actionName}`,
					data,
					request: { pathvars, params: newParams }
				})
				resolve(data)
			})
			.catch((err) => { resolve(err) })
	})
}

export default customGet
