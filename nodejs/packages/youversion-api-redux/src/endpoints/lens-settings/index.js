import apiEndpoint from '../../generators/apiEndpoint'

const endpoint = 'lens'

export const unsubscribeStatus = (state) => {
	const unsubscribe = state.lensSettings.unsubscribe

	if (typeof unsubscribe !== 'object') {
		return 'other'
	}

	if (unsubscribe.loading === true) {
		return 'loading'
	}

	if (Array.isArray(unsubscribe.data.errors) && unsubscribe.data.errors.length > 0) {
		return 'error'
	}

	if (typeof unsubscribe.data.notifications === 'object') {
		return 'success'
	}

	return state
}

export const unsubscribeErrors = (state) => {
	const unsubscribe = state.lensSettings.unsubscribe

	if (typeof unsubscribe !== 'object' || !Array.isArray(unsubscribe.errors)) {
		return []
	}

	return unsubscribe.errors
}


const methods = {
	unsubscribe: {
		url: '/4.0/settings%3Aunsubscribe_all',
	}
}

const lensSettingsEndpoint = apiEndpoint(endpoint, methods)

export default lensSettingsEndpoint
