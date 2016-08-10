import type from './constants'

const ActionCreators = {

	discoverAll(params, auth) {
		return dispatch => {
			return dispatch(ActionCreators.configuration()).then((configuration) => {
				return dispatch(ActionCreators.discover(params, auth)).then((data) => {
					var carousels = [];	// for all carousels
					var ids = [];				// for collections carousels
					var recdIds = [];		// for recommendation carousels
					var savedId = null;	// for saved plans carousel
					data.items.forEach((item, index) => {
						if (item.type === 'collection') {
							ids.push(item.id);
						} else if (item.type === 'recommended') {
							recdIds.push({"id": item.id, "index": index});
						} else if (item.type === 'saved') {
							savedId = {"id": item.id, "index": index};
						}
					})
					// get all the regular carousels items
					return dispatch(ActionCreators.collectionsItems({ ids })).then((carouselList) => {
						// if we have recommendations, let's get recommended
						if (recdIds.length > 0) {
							// insert the recommendations into the carousels list in the correct order received from the api
							recdIds.forEach((item) => {
								dispatch(ActionCreators.recommendations({"language_tag": params["language_tag"], "id": item["id"]})).then((recCarousel) => {
									carousels.splice(item["index"], 0, recCarousel);
								})
							})
						}
						// if we have saved plans, let's get 'em
						if (savedId != null) {
							// insert saved plans into the carousels list in the correct order recieved from the api
							dispatch(ActionCreators.savedItems(auth)).then((savedCarousel) => {
								carousels.splice(savedId["index"], 0, savedCarousel);
							})
						}
					})

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

	recommendations(params) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'recommendations',
				version: '3.1',
				auth: false,
				params: params,
				http_method: 'get',
				types: [ type('recommendationsItemsRequest'), type('recommendationsItemsSuccess'), type('recommendationsItemsFailure') ]
			}
		}
	},

	savedItems(auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'queue_items',
				version: '3.1',
				auth: auth,
				params: {},
				http_method: 'get',
				types: [ type('savedItemsRequest'), type('savedItemsSuccess'), type('savedItemsFailure') ]
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