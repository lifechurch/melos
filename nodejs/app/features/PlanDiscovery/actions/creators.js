import Immutable from 'immutable'
import moment from 'moment'
import UsersActionCreator from '@youversion/api-redux/lib/endpoints/users/action'
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
						let hasSaved = false;					// for saved plans carousel

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
							promises.push(
								dispatch(ActionCreators.savedItems({ id: 'saved' }, auth)),
								dispatch(ActionCreators.allQueueItems(auth))
							)
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
				dispatch(ActionCreators.readingplanView({ id, language_tag, user_id }, true)),
				dispatch(ActionCreators.calendar({ id, language_tag, user_id }, true)),
				dispatch(BibleActionCreator.bibleVersion({ id: version })),
				dispatch(ActionCreators.allQueueItems(auth))
			]

			return new Promise((resolve, reject) => {
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
					}, auth))
						.then(() => {
							resolve(
								dispatch(ActionCreators.planSelect({ id }))
							)
						}, (error) => {
							reject(error)
						})
				})
			})
		}
	},

	sampleAll(params, auth) {
		return dispatch => {
			const { id, language_tag, day: currentDay, version } = params
			const promises = [
				dispatch(ActionCreators.readingplanView({ id, language_tag })),
				dispatch(ActionCreators.calendar({ id, language_tag })),
				dispatch(BibleActionCreator.bibleVersion({ id: version })),
				dispatch(ActionCreators.allQueueItems(auth))
			]

			return new Promise((resolve, reject) => {
				Promise.all(promises).then((d) => {
					const [ , { calendar }, ] = d
					const dayData = calendar[currentDay - 1]
					dispatch(ActionCreators.planReferences({
						references: dayData.references,
						version,
						id,
						currentDay
					})).then(() => {
						resolve(dispatch(ActionCreators.planSelect({ id })))
					}, (error) => {
						reject(error)
					})
				})
			})
		}
	},

	planReferences(params, auth) {
		return dispatch => {
			return new Promise((resolve, reject) => {
				const { references, version, id, currentDay } = params
				const innerPromises = []

				references.forEach((ref, i) => {
					const isFullChapter = ref.split('.').length === 2
					// call for verse colors for the chapter
					if (i === 0) {
						innerPromises.push(dispatch(BibleActionCreator.momentsVerseColors(auth, {
							usfm: ref.split('.').slice(0, 2).join('.'),
							version_id: version
						})))
					}
					if (isFullChapter) {
						innerPromises.push(
							new Promise((resolve2, reject2) => {
								dispatch(BibleActionCreator.bibleChapter({
									reference: ref,
									id: version,
								}, {
									plan_id: id,
									plan_day: currentDay,
									plan_content: i
								}))
									.then((d) => {
										if ('errors' in d) {
											reject2(d.errors)
										} else {
											resolve2()
										}
									})
							})
						)
					} else {
						innerPromises.push(
							new Promise((resolve3, reject3) => {
								dispatch(BibleActionCreator.bibleVerses({
									references: [ref],
									id: version,
								}, {
									plan_id: id,
									plan_day: currentDay,
									plan_content: i
								}))
									.then((d) => {
										if ('errors' in d) {
											reject3(d.errors)
										} else {
											resolve3()
										}
									})
							})
						)

						innerPromises.push(dispatch(BibleActionCreator.audioBibleChapter({
							reference: ref.split('.').slice(0, 2).join('.'),
							version_id: version,
						})))
					}
				})

				if (innerPromises.length > 0) {
					Promise.all(innerPromises).then(() => {
						resolve()
					}, (error) => {
						reject(error)
					})
				} else {
					resolve()
				}
			})
		}
	},

	updatePlanDay(params, auth) {
		return dispatch => {
			return new Promise((resolve) => {
				dispatch(ActionCreators.updateCompletion(params, auth)).then(() => {
					resolve(
						dispatch(ActionCreators.planSelect({ id: params.id }))
					)
				})
			})
		}
	},

	resetSubscriptionAll(params, auth) {
		return dispatch => {
			return new Promise((resolve) => {
				dispatch(ActionCreators.resetSubscription({ id: params.id }, auth)).then(() => {
					dispatch(ActionCreators.subscriptionAll(params, auth)).then(() => { resolve() })
				})
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
				dispatch(ActionCreators.savedItems(saveParams, auth)),
				dispatch(ActionCreators.allQueueItems(auth))
			])
		}
	},

	planComplete(params, auth) {
		return dispatch => {
			const {
				getPlanView,
				getRecommendedPlans,
				getSavedPlans,
				id,
				language_tag,
			} = params

			const promises = []

			if (getPlanView) {
				promises.push(
					dispatch(ActionCreators.readingplanView({ id, language_tag }, auth))
				)
			}
			if (getRecommendedPlans) {
				promises.push(
					dispatch(ActionCreators.recommendedPlansInfo({ id, language_tag }))
				)
			}
			if (getSavedPlans) {
				promises.push(
					dispatch(ActionCreators.savedPlanInfo({ id: 'saved', page: 1 }, auth))
				)
			}
			return Promise.all(promises)
		}
	},

	sharedDayComplete(params) {
		return dispatch => {
			const {
				id,
				language_tag,
				user_id,
			} = params
			const planID = parseInt(id, 10)
			return Promise.all([
				dispatch(UsersActionCreator({
					method: 'view',
					params: {
						id: user_id
					}
				})),
				dispatch(ActionCreators.readingplanView({ id: planID, language_tag, user_id }, false))
			])
		}
	},

	readingplanInfo(params, auth) {
		return dispatch => {
			const {
				getPlanView,
				getRecommendedPlans,
				getSavedPlans,
				getStats,
				id,
				language_tag,
				user_id
			} = params

			const p = Immutable.fromJS(params).set('id', parseInt(params.id.toString().split('-')[0], 10)).toJS()
			const promises = []
			const savedplanParams = Object.assign({}, p, { savedplanCheck: true, page: 1 })

			if (!getSavedPlans && !getRecommendedPlans) {
				promises.push(
					dispatch(ActionCreators.configuration())
				)
			}

			if (getPlanView) {
				promises.push(
					dispatch(ActionCreators.readingplanView({ id, language_tag, user_id }, auth))
				)
			}

			if (getRecommendedPlans) {
				const planParams = Object.assign({}, p, { readingplanInfo: true })
				promises.push(
					new Promise((resolve) => {
						dispatch(ActionCreators.recommendedPlansInfo(planParams)).then(() => { resolve() })
					})
				)
			}

			if (auth && !getSavedPlans) {
				promises.push(
					dispatch(ActionCreators.allQueueItems(auth))
				)
			}

			if (getSavedPlans && auth) {
				promises.push(
					dispatch(ActionCreators.savedPlanInfo(savedplanParams, auth))
				)
			}

			if (getStats) {
				promises.push(
					dispatch(ActionCreators.readingplanStats(params, auth))
				)
			}

			return Promise.all(promises)
		}
	},

	/**
	 * Reset User Plan Subscription
	 *
	 * @param      {object}	params  The parameters
	 * @param      {bool}  	auth    The auth
	 */
	resetSubscription(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'reset_subscription',
				version: '3.1',
				auth,
				params,
				http_method: 'post',
				types: [ type('resetSubscriptionRequest'), type('resetSubscriptionSuccess'), type('resetSubscriptionFailure') ]
			}
		}
	},

	/**
	 * Restart User Plan Subscription
	 *
	 * @param      {object}	params  The parameters
	 * @param      {bool}  	auth    The auth
	 */
	restartSubscription(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'restart_subscription',
				version: '3.1',
				auth,
				params,
				http_method: 'post',
				types: [ type('restartSubscriptionRequest'), type('restartSubscriptionSuccess'), type('restartSubscriptionFailure') ]
			}
		}
	},

	/**
	 * unsubscribeUser - description
	 *
	 * @param  {type} params description
	 * @param  {type} auth   description
	 * @return {type}        description
	 */
	unsubscribeUser(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'unsubscribe_user',
				version: '3.1',
				auth,
				params,
				http_method: 'post',
				types: [ type('unsubscribeUserRequest'), type('unsubscribeUserSuccess'), type('unsubscribeUserFailure') ]
			}
		}
	},

	/**
	 *
	 * @param      {number} 	id  				reading plan id
	 * @param      {number}  	day   			Day number to update, within the Reading Plan
	 * @param      {string} 	updated_dt 	A valid ISO 8601 date; e.g., date('c') or 2013-10-25T10:01:27+00:00
	 * @param      {array} 		references 	List of references (must be valid for that day of reading) to mark as completed
	 * @param      {bool} 		devotional 	Boolean flag to signify that the devotional content for that day has been completed
	 */
	updateCompletion(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'update_completion',
				version: '3.1',
				auth,
				params,
				http_method: 'post',
				types: [ type('updateCompletionRequest'), type('updateCompletionSuccess'), type('updateCompletionFailure') ]
			}
		}
	},


	/**
	 * updateSubscribeUser - description
	 *
	 * @param  {type} params description
	 * @param  {type} auth   description
	 * @return {type}        description
	 */
	updateSubscribeUser(params, auth) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'update_subscribe_user',
				version: '3.1',
				auth,
				params,
				http_method: 'post',
				types: [ type('updateSubscribeUserRequest'), type('updateSubscribeUserSuccess'), type('updateSubscribeUserFailure') ]
			}
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

	allQueueItems(auth) {
		return {
			api_call: {
				endpoint: 'reading-plans',
				method: 'all_queue_items',
				version: '3.1',
				auth,
				params: {},
				http_method: 'get',
				types: [ type('allQueueItemsRequest'), type('allQueueItemsSuccess'), type('allQueueItemsFailure') ]
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