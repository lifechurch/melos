import Immutable from 'immutable'
import moment from 'moment'

import type from './constants'
import BibleActionCreator from '../../Bible/actions/creators'

const ActionCreators = {

	discoverAll(params, auth) {
		return dispatch => {
			return Promise.all([
				dispatch(ActionCreators.configuration()),
				new Promise((resolve, reject) => {
					dispatch(ActionCreators.discover(params, auth)).then((data) => {
						const collectionIds = [];			// for collections carousels
						const recommendationIds = [];	// for recommendation carousels
						const promises = []
						let hasSaved = false;				// for saved plans carousel

						if (data && data.items) {
							data.items.forEach((item) => {
								if (item.type === 'collection') {
									collectionIds.push(item.id);
								} else if (item.type === 'recommended') {
									recommendationIds.push(item.id);
								} else if (item.type === 'saved') {
									hasSaved = true
								}
							})
						}

						// get all the regular carousels items
						promises.push(dispatch(ActionCreators.collectionsItems({ ids: collectionIds })))

						// if we have saved plans, let's get 'em
						if (hasSaved === true) {
							promises.push(dispatch(ActionCreators.savedItems({ id: 'saved' }, auth)))
						}

						// if we have recommendations, let's get recommended
						if (recommendationIds.length > 0) {
							promises.concat(recommendationIds.map((id) => {
								return new Promise((innerResolve) => {
									dispatch(ActionCreators.recommendations({ language_tag: params.language_tag, id })).then(innerResolve, innerResolve)
								})
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
						const ids = []

						collectionItems.collections[0].items.forEach((item) => {
							if (item.type === 'collection') {
								ids.push(item.id)
							}
						})

						if (ids.length > 0) {
							resolve(dispatch(ActionCreators.collectionsItems({ ids, collectInception: true })))
						} else {
							resolve()
						}

					}, reject)
				})
			])
		}
	},

	subscriptionAll(params, auth) {
		return dispatch => {
			const { id, language_tag, user_id, day, version } = params
			const promises = [
				dispatch(ActionCreators.readingplanView({ id, language_tag, user_id }, auth)),
				dispatch(ActionCreators.calendar({ id, language_tag, user_id }, auth))
			]

			return new Promise((resolve) => {
				Promise.all(promises).then((d) => {
					const [ plan, { calendar } ] = d
					let currentDay = day
					if (!day) {
						const calculatedDay = moment().diff(moment(plan.start_dt, 'YYYY-MM-DD'), 'days') + 1
						if (calculatedDay > plan.total_days) {
							currentDay = plan.total_days
						} else {
							currentDay = calculatedDay
						}
					}

					const dayData = calendar[currentDay - 1]

					dispatch(ActionCreators.planReferences({
						references: dayData.references,
						version,
						id,
						currentDay
					})).then(() => {
						resolve(dispatch(ActionCreators.planSelect({ id })))
					})
				})
			})
		}
	},

	planReferences(params) {
		return dispatch => {
			return new Promise((resolve) => {
				const { references, version, id, currentDay } = params
				const innerPromises = []

				references.forEach((ref, i) => {
					const isFullChapter = ref.split('.').length === 2
					if (isFullChapter) {
						innerPromises.push(dispatch(BibleActionCreator.bibleChapter({
							reference: ref,
							id: version,
							format: 'html',
							plan_id: id,
							plan_day: currentDay,
							plan_content: i
						})))
					} else {
						innerPromises.push(dispatch(BibleActionCreator.bibleVerses({
							references: [ref],
							id: version,
							format: 'html',
							plan_id: id,
							plan_day: currentDay,
							plan_content: i
						})))
					}
				})

				if (innerPromises.length > 0) {
					Promise.all(innerPromises).then(() => { resolve() })
				} else {
					resolve()
				}
			})
		}
	},

	planSelect(params) {
		return {
			type: type('planSelect'),
			id: params.id
		}
	},

	recommendedPlansInfo(params) {
		return dispatch => {
			const recommendedParams = Object.assign({}, params, { dynamicCollection: true })
			return Promise.all([
				dispatch(ActionCreators.configuration()),
				dispatch(ActionCreators.recommendations(recommendedParams))
			])
		}
	},

	savedPlanInfo(params, auth) {
		return dispatch => {
			const saveParams = Object.assign({}, params, { dynamicCollection: true })
			return Promise.all([
				dispatch(ActionCreators.configuration()),
				dispatch(ActionCreators.savedItems(saveParams, auth))
			])
		}
	},

	readingplanInfo(params, auth) {
		return dispatch => {
			const p = Immutable.fromJS(params).set('id', parseInt(params.id.toString().split('-')[0], 10)).toJS()
			// tell the reducer to populate the recommendations in state.collection.plans.related
			const planParams = Object.assign({}, p, { readingplanInfo: true })
			// now check if requested reading plan view is a saved plan for the user
			const savedplanParams = Object.assign({}, p, { savedplanCheck: true })

			const promises = [
				dispatch(ActionCreators.configuration()),
				dispatch(ActionCreators.readingplanView(params, auth)),
				new Promise((resolve) => {
					dispatch(ActionCreators.recommendations(planParams)).then(resolve, resolve)
				}),
				dispatch(ActionCreators.readingplanStats(params, auth))
			]

			if (auth) {
				promises.push(dispatch(ActionCreators.savedItems(savedplanParams, auth)))
			}

			return Promise.all(promises)
		}
	},

	discover(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'discover',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('discoverRequest'), type('discoverSuccess'), type('discoverFailure') ]
			}
		}
	},

	references(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'references',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('referencesRequest'), type('referencesSuccess'), type('referencesFailure') ]
			}
		}
	},

	calendar(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'calendar',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('calendarRequest'), type('calendarSuccess'), type('calendarFailure') ]
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
				auth,
				params,
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
				params,
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
				params,
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
				auth,
				params,
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
				auth,
				params,
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
				auth,
				params,
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
				auth,
				params,
				http_method: 'post',
				types: [ type('planSubscribeRequest'), type('planSubscribeSuccess'), type('planSubscribeFailure') ]
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
				auth,
				params,
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
				auth,
				params,
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
	},

	items(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'items',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('itemsRequest'), type('itemsSuccess'), type('itemsFailure') ]
			}
		}
	},

	completed(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'completed',
				version: '3.1',
				auth,
				params,
				http_method: 'get',
				types: [ type('completedRequest'), type('completedSuccess'), type('completedFailure') ]
			}
		}
	}

}

export default ActionCreators