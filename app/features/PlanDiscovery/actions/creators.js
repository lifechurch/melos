import type from './constants'

const ActionCreators = {

	discoverAll(params, auth) {
		return dispatch => {
			return Promise.all([
				dispatch(ActionCreators.configuration()),
				new Promise((resolve, reject) => {
					dispatch(ActionCreators.discover(params, auth)).then((data) => {
						var collectionIds = [];			// for collections carousels
						var recommendationIds = [];	// for recommendation carousels
						var hasSaved = false;				// for saved plans carousel

						data.items.forEach((item, index) => {
							if (item.type === 'collection') {
								collectionIds.push(item.id);
							} else if (item.type === 'recommended') {
								recommendationIds.push(item.id);
							} else if (item.type === 'saved') {
								hasSaved = true
							}
						})

						var promises = []

						// get all the regular carousels items
						promises.push(dispatch(ActionCreators.collectionsItems({ ids: collectionIds })))

						// if we have saved plans, let's get 'em
						if (hasSaved === true) {
							promises.push(dispatch(ActionCreators.savedItems({ id: 'saved'}, auth)))
						}

						// if we have recommendations, let's get recommended
						if (recommendationIds.length > 0) {
							promises.concat(recommendationIds.map((id) => {
								return dispatch(ActionCreators.recommendations({ language_tag: params.language_tag, id }))
							}))
						}

						Promise.all(promises).then(resolve, reject)
					})
				})
			])
		}
	},

	collectionAll(params) {
		return dispatch => {
			return Promise.all([
				dispatch(ActionCreators.configuration()),
				dispatch(ActionCreators.collection(params)),
				new Promise((resolve, reject) => {
					// When uiFocus = true, the reducer will populate root collection with items in state
					const itemsParams = Object.assign({}, params, { ids: [params.id], page: 1, uiFocus: true })

					dispatch(ActionCreators.collectionsItems(itemsParams)).then((collectionItems) => {

						// if we have a collection inside a collection, the reducer is going to populate the collection with it's items based on the flag
						var ids = []

						collectionItems.collections[0].items.map((item) => {
							if (item.type === 'collection') {
								ids.push(item.id)
							}
						})

						if (ids.length > 0) {
							resolve(dispatch(ActionCreators.collectionsItems({ ids: ids, collectInception: true })))
						} else {
							resolve()
						}

					}, reject)
				})
			])
		}
	},

	dynamicCollection(params, auth) {
		return dispatch => {
			if (params.context == 'saved') {
				const saveParams = Object.assign({}, params, { dynamicCollection: true })
				return Promise.all([
					dispatch(ActionCreators.configuration()),
					dispatch(ActionCreators.savedItems(saveParams, auth))
				])

			} else if (params.context == 'recommendation' && params.id) {
				const recommendedParams = Object.assign({}, params, { dynamicCollection: true })
				return Promise.all([
					dispatch(ActionCreators.configuration()),
					dispatch(ActionCreators.recommendations(recommendedParams))
				])
			}

		}
	},

	readingplanInfo(params, auth) {
		return dispatch => {
			// tell the reducer to populate the recommendations in state.collection.plans.related
			const planParams = Object.assign({}, params, { readingplanInfo: true })
			// now check if requested reading plan view is a saved plan for the user
			const savedplanParams = Object.assign({}, params, { savedplanCheck: true })

			return Promise.all([
				dispatch(ActionCreators.configuration()),
				dispatch(ActionCreators.readingplanView(params, auth)),
				dispatch(ActionCreators.recommendations(planParams)),
				dispatch(ActionCreators.readingplanStats(params, auth)),
				dispatch(ActionCreators.savedItems(savedplanParams, auth))
			])
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
			params,
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
			params,
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
			params,
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

	userSubscriptions(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'items',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('userSubscriptionsRequest'), type('userSubscriptionsSuccess'), type('userSubscriptionsFailure') ]
			}
		}
	},

	readingplanSaveforlater(params, auth) {
		return {
			params,
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
			params,
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