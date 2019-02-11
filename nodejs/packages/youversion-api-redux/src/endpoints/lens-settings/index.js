import apiEndpoint from '../../generators/apiEndpoint'

const endpoint = 'lens'

const methods = {
	unsubscribe: {
		url: '/4.0/settings%3Aunsubscribe_all',
	}
}

const lensSettingsEndpoint = apiEndpoint(endpoint, methods)

export default lensSettingsEndpoint
