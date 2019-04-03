import apiEndpoint from '../../generators/apiEndpoint'

const endpoint = 'bafk'

export const unsubscribeStatus = (state) => {
	const unsubscribe = state.bafk.unsubscribe

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

	return 'loading'
}

export const unsubscribeAllStatus = (state) => {
	const unsubscribeAll = state.bafk.unsubscribeAll

	if (typeof unsubscribeAll !== 'object') {
		return 'other'
	}

	if (unsubscribeAll.loading === true) {
		return 'loading'
	}

	if (Array.isArray(unsubscribeAll.data.errors) && unsubscribeAll.data.errors.length > 0) {
		return 'error'
	}

	if (typeof unsubscribeAll.data.notifications === 'object') {
		return 'success'
	}

	return 'loading'
}

export const unsubscribeErrors = (state) => {
	const unsubscribe = state.bafk.unsubscribe

	if (typeof unsubscribe !== 'object' || !Array.isArray(unsubscribe.errors)) {
		return []
	}

	return unsubscribe.errors
}

export const unsubscribeAllErrors = (state) => {
	const unsubscribeAll = state.bafk.unsubscribeAll

	if (typeof unsubscribeAll !== 'object' || !Array.isArray(unsubscribeAll.errors)) {
		return []
	}

	return unsubscribeAll.errors
}

const methods = {
	unsubscribe: {
		url: '/4.0/settings%3Aunsubscribe',
	},
	unsubscribeAll: {
		url: '/4.0/settings%3Aunsubscribe_all',
	}
}

const bafkEndpoint = apiEndpoint(endpoint, methods)

export default bafkEndpoint
