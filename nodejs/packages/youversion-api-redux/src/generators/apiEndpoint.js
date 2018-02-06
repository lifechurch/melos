import reduxApi from 'redux-api'
import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import { HttpError } from '../middleware/Error'
import defaultDataTransformer from '../dataTransformers/default'


const constantHeaders = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'X-YouVersion-Client': 'youversion',
	'X-YouVersion-App-Platform': 'web',
	'X-YouVersion-App-Version': '4',
	Referer: 'web.youversionapi',
}
const env = ((typeof window !== 'undefined' && window && window.__ENV__)
	|| (process && process.env && process.env.NODE_ENV))
const apiEnv = (env !== 'production')
	? 'youversionapistaging'
	: 'youversionapi'


// options to apply to reduxApi
const defaultOptions = {
	rootUrl: (endpoint) => { return `https://${endpoint}.${apiEnv}.com` },
	addOptions: (url, params, getState) => {
		let headers = constantHeaders

		if (getState()) {
			// merge in auth token into headers and disable caching
			if (params && 'auth' in params && params.auth) {
				const oauth = getState().auth.oauth
				headers = Immutable.fromJS(headers).merge({
					Authorization: `${oauth.token_type} ${oauth.access_token}`
				}).toJS()

				// don't cache authed gets
				if (params.method === 'GET') {
					// rudimentary cache-control for now
					headers = Immutable.fromJS(headers).merge({
						'Cache-Control': 'no-cache'
					}).toJS()
				}
			}

			// set accept-language
			headers = Immutable.fromJS(headers).merge({
				'Accept-Language': getState().serverLanguageTag
			}).toJS()
		}

		// for pure requests, we may pass headers in params because getState isn't
		// available
		if (params && 'headers' in params) {
			headers = Immutable.fromJS(headers).merge(params.headers).toJS()
		}

		// stringify the body on POSTs etc here so we don't have to do it
		// every time we actually call the rest action
		// the browser takes care of the content-length
		if (params && 'body' in params) {
			params.body = JSON.stringify(params.body)
		}

		return { headers }
	},
	customFetch: (isoFetch) => {
		return (url, options) => {
			return isoFetch(url, options)
				.then((resp) => {
					if (resp.status >= 200 && resp.status < 300) {
						if (resp.status === 204) {
							return { data: null }
						} else {
							return resp.json()
						}
					} else {
						return resp.json()
							.then((json) => {
								throw new HttpError(resp, json)
							}, () => {
								throw new HttpError(resp)
							})
					}
				})
				.catch((err) => { return Promise.resolve({ data: { error: err } }) })
		}
	},
}

/**
 * this is a wrapper method to add functionality/modularity to the restful reduxApi
 * library for creating api/action/reducer endpoints
 *
 * the main advantage to this function is to simplify each endpoint create by placing
 * all logic here that we want to apply to every endpoint
 * (certain method params, headers, etc.)
 *
 * @param {string} endpoint		name of api endpoint
 * @param {object} apiMethods [object containing method objects]
 *                           i.e.:
 *
 * 													plansEndpoint = apiEndpoint('plans', {
 *                           		subscription: {
 *                           			url: '4.0/subscriptions/:id',
 *                           	  },
 * 													})
 *
 * 													usage:
 *              						plansEndpoint.actions.subscription.get({ id: 1 })
 *              						NOTE: we merge in crud: true into each method in the
 *              						wrapper so that we can do the above .get() etc.. automatically
 *
 *
 * @return {object} reduxApi [object containing actions and reducers for the generated
 *                           endpoint methods]
 */
export default function apiEndpoint(
	endpoint,
	apiMethods,
	customOptions = {
		rootUrl: null,
		addOptions: null,
		methodOptions: null,
	}
) {

	// let's merge some stuff in with the passed apiMethods
	// that we want to apply to every endpoint/method
	const finalAPI = {}
	Object.keys(apiMethods).forEach((method) => {
		finalAPI[method] = {
			...apiMethods[method],
			crud: true,
			...customOptions.methodOptions,
		}
		if ('transformer' in apiMethods[method]) {
			// if transformer value is a bool === true then we'll
			// use the defaultDataTransformer
			// otherwise, it's a function to actually be used as the transformer
			if (
				apiMethods[method].transformer &&
				typeof apiMethods[method].transformer === 'boolean'
			) {
				finalAPI[method].transformer = defaultDataTransformer
			}
		}
	})

	/**
	 * reduxApi takes and object of endpoint methods and creates actions, reducers,
	 * and http calls
	 * each method is an object itself, the most basic form containing just the url: value.
	 * optionally other values are available such as custom crud method implementations
	 *
	 * the prefix is a unique name for reducer scoping, in our case it will be the
	 * endpoint name. NOTE: this naming is important, as this library uses the prefix
	 * to determine where in state this data is for prevData in transformers
	 *
	 * .use() applies options to each call, such as the fetch implementation to use,
	 * the api root, and headers to apply
	 *
	 * see https://github.com/lexich/redux-api
	 *
	 */
	const rootUrl = customOptions.rootUrl || defaultOptions.rootUrl(endpoint)
	const addOptions = customOptions.addOptions || defaultOptions.addOptions
	return reduxApi(finalAPI, { prefix: endpoint })
		.use('rootUrl', rootUrl)
		.use('fetch', defaultOptions.customFetch(fetch))
		.use('options', addOptions)
		.use('server', true)
}
