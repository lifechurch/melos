import apiEndpoint from '../../generators/apiEndpoint'

// SELECTORS -------------------------------------------------------------------
export const getLocalization = (state) => {
	return state.localization
			&& state.localization.items
			&& 'data' in state.localization.items
			&& state.localization.items.data
			? state.localization.items.data
			: null
}

// RESTFUL API ENDPOINT --------------------------------------------------------
const apiHost = (typeof window !== 'undefined' && window && window.YV_API_HOST)
const apiPort = (typeof window !== 'undefined' && window && window.YV_API_PORT)
const protocol = (typeof window !== 'undefined' && window && window.location.protocol)
const serverUrl = `${protocol}//${apiHost}${apiPort ? `:${apiPort}` : ''}`
// https://nodejs.bible.com -> https://auth.youversionapi.com
const endpoint = 'localization'
const methods = {
	configuration: {
		url: '/localization/configuration',
	},
	items: {
		url: '/localization/items',
	}
}
const customOptions = {
	rootUrl: serverUrl,
}

const localizationEndpoint = apiEndpoint(endpoint, methods, customOptions)

export default localizationEndpoint
