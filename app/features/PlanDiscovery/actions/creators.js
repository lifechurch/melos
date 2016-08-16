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
							// insert saved plans into the carousels list in the correct order received from the api
							dispatch(ActionCreators.savedItems(params, auth)).then((savedCarousel) => {
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
						var ids = []
						collectionItems.collections[0].items.map((item) => {
							if (item.type === 'collection') {
								ids.push(item.id)
							}
						})
						if (ids.length > 0) return dispatch(ActionCreators.collectionsItems({ ids: ids, collectInception: true })).then(() => {})
					})
				})
			})
		}
	},

	readingplanInfo(params, auth) {
		return dispatch => {
			return dispatch(ActionCreators.configuration()).then((configuration) => {
				return dispatch(ActionCreators.readingplanView(params, auth)).then((readingplan) => {
					return dispatch(ActionCreators.readingplanStats(params, auth)).then((stats) => {
						// tell the reducer to populate the recommendations in state.collection.plans.related
						const planParams = Object.assign({}, params, { readingplanInfo: true })
						return dispatch(ActionCreators.recommendations(planParams)).then((recd) => {
							// now check if requested reading plan view is a saved plan for the user
							const savedplanParams = Object.assign({}, params, { readingplanInfo: false, savedplanCheck: true, planId: readingplan.id })
							console.log(savedplanParams)
							return dispatch(ActionCreators.savedItems(savedplanParams, auth)).then((saved) => {})
						})
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

	savedItems(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'queue_items',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('savedItemsRequest'), type('savedItemsSuccess'), type('savedItemsFailure') ]
			}
		}
	},

	readingplanView(params, auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'view',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('planInfoRequest'), type('planInfoSuccess'), type('planInfoFailure') ]
			}
		}
	},

	readingplanStats(params, auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'stats',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('planStatsRequest'), type('planStatsSuccess'), type('planStatsFailure') ]
			}
		}
	},

	readingplanSubscribeUser(params, auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'subscribe_user',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('planSubscribeRequest'), type('planSubscribeSuccess'), type('planSubscribeFailure') ]
			}
		}
	},

	readingplanSaveforlater(params, auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'add_to_queue',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('planSaveforlaterRequest'), type('planSaveforlaterSuccess'), type('planSaveforlaterFailure') ]
			}
		}
	},

	readingplanRemoveSave(params, auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'remove_from_queue',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('planRemoveSaveRequest'), type('planRemoveSaveSuccess'), type('planRemoveSaveFailure') ]
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