import type from './constants'

const ActionCreators = {

	discoverAll(params, auth) {
		return dispatch => {
			return dispatch(ActionCreators.configuration()).then((configuration) => {
				return dispatch(ActionCreators.discover(params, auth)).then((data) => {
					const ids = data.items.map((item) => {
						if (item.type === 'collection') {
							return item.id
						}
					})
					return dispatch(ActionCreators.collectionsItems({ ids }))
				}, (error) => {

				})
			}, (error) => {

			})
		}
	},

	discover(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'discover',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('discoverRequest'), type('discoverSuccess'), type('discoverFailure') ]
			}
		}
	},

	collectionsItems(params) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'collections_items',
				version: '3.1',
				auth: false,
				params: params,
				http_method: 'get',
				types: [ type('collectionsItemsRequest'), type('collectionsItemsSuccess'), type('collectionsItemsFailure') ]
			}
		}
	},

	configuration() {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'configuration',
				version: '3.1',
				auth: false,
				params: {},
				http_method: 'get',
				types: [ type('configurationRequest'), type('configurationSuccess'), type('configurationFailure') ]
			}
		}
	}

}

export default ActionCreators