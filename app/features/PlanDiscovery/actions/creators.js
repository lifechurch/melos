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

	collectionAll(params, auth) {
		return dispatch => {
			return dispatch(ActionCreators.configuration()).then((configuration) => {
				return dispatch(ActionCreators.collection(params, auth)).then((data) => {
					// When uiFocus = true, the reducer will populate root collection with items in state
					const itemsParams = Object.assign({}, params, { ids: [params.id], page: 1, uiFocus: true })
					return dispatch(ActionCreators.collectionsItems(itemsParams)).then((collectionItems) => {
						// if we have a collection inside a collection, the reducer is going to populate the collection with it's items based on the flag
						var ids = collectionItems.collections[0].items.map((item) => {
							if (item.type === 'collection') {
								return item.id
							}
						})
						if (ids.length > 0) return dispatch(ActionCreators.collectionsItems({ ids: ids, collectInception: true })).then(() => {})
					})
				})
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

	collection(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'collections_view',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('collectionRequest'), type('collectionSuccess'), type('collectionFailure') ]
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