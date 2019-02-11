import apiEndpoint from '../../generators/apiEndpoint'

const endpoint = 'lens'

const methods = {
	topics: {
		url: '/4.0/settings:unsubscribe_all',
	}
}

const lensSettingsEndpoint = apiEndpoint(endpoint, methods)

export default lensSettingsEndpoint
