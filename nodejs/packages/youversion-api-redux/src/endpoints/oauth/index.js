import Immutable from 'immutable'
import moment from 'moment'
import cookie from 'react-cookie'
import apiEndpoint from '../../generators/apiEndpoint'



// SELECTORS -------------------------------------------------------------------


// RESTFUL API ENDPOINT --------------------------------------------------------
const apiHost = (typeof window !== 'undefined' && window && window.YV_API_HOST)
const apiPort = (typeof window !== 'undefined' && window && window.YV_API_PORT)
const protocol = (typeof window !== 'undefined' && window && window.location.protocol)
const serverUrl = `${protocol}//${apiHost}${apiPort ? `:${apiPort}` : ''}`
// https://nodejs.bible.com -> https://auth.youversionapi.com
const endpoint = 'auth'

const oauthDataResponse = (data) => {
	return Immutable
		.fromJS(data)
		.merge(
			!('error' in data)
				? { valid_until: moment().add(data.expires_in, 'seconds').unix() }
				: null
		)
		.toJS()
}
const methods = {
	refresh: {
		url: '/oauth/refresh',
		transformer: (data, prevData) => {
			if (data) {
				// overwrite oauth data with refresh response
				return oauthDataResponse(data)
			}
			return prevData
		},
		// write cookie used for the feature server check
		postfetch: [
			({ data }) => {
				if (data && !('error' in data)) {
					cookie.save('OAUTH', data, { path: '/' })
				}
			}
		]
	},
}
const customOptions = {
	rootUrl: serverUrl,
}

const oauthEndpoint = apiEndpoint(endpoint, methods, customOptions)

export default oauthEndpoint
