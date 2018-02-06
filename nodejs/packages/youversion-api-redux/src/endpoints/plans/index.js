import isTimestampExpired from '@youversion/utils/lib/time/isTimestampExpired'
import localOnceDaily from '@youversion/utils/lib/localOnceDaily'
import tokenDelimiter from '@youversion/js-api/lib/tokenAuth/tokenDelimiter'
import { fetchToken, storeToken } from '@youversion/token-storage'
import moment from 'moment'
import cookie from 'react-cookie'
import oauthAPI from '../oauth'
import apiEndpoint from '../../generators/apiEndpoint'
import { activitiesTransformer, activityTransformer } from '../../dataTransformers/activities'
import progressDayTransformer from '../../dataTransformers/progress'
import settingsTransformer from '../../dataTransformers/settings'
import daysTransformer from '../../dataTransformers/days'
import defaultDataTransformer from '../../dataTransformers/default'
import participantsTransformer from '../../dataTransformers/participants'
import deleteReducer from '../../customReducers/delete'

// SELECTORS -------------------------------------------------------------------

// plans ----------------------------------------------
export const getPlanDays = (state) => {
	return state.plans
		&& state.plans.days
		&& state.plans.days.data
		? state.plans.days.data.data
		: null
}
// participants ----------------------------------------------
export const getParticipants = (state) => {
	return 'data' in state.plans.participants && state.plans.participants.data
		? state.plans.participants.data
		: null
}
export const getParticipantsByTogetherId = (state, id) => {
	return 'data' in state.plans.participants && state.plans.participants.data
		&& id in state.plans.participants.data
		? state.plans.participants.data[id]
		: null
}
// subscriptions ----------------------------------------------
export const getSubscriptions = (state) => {
	return 'data' in state.plans.subscriptions.data
		? { ...state.plans.subscriptions.data, loading: state.plans.subscriptions.loading }
		: null
}
export const getSubscriptionById = (state, id) => {
	return ('data' in state.plans.subscriptions.data &&
					id in state.plans.subscriptions.data.data) ?
								state.plans.subscriptions.data.data[id] :
								null
}
export const getProgress = (state) => {
	return 'data' in state.plans.progress && state.plans.progress.data
		? state.plans.progress.data.data
		: null
}
export const getProgressById = (state, id) => {
	return 'data' in state.plans.progress
		&& state.plans.progress.data
		&& id in state.plans.progress.data.data
		? state.plans.progress.data.data[id]
		: null
}
export const getSettings = (state) => {
	return state.plans.settings.data
		? state.plans.settings.data
		: null
}
// togethers ----------------------------------------------
export const getTogethers = (state) => {
	return 'data' in state.plans.togethers.data ?
								state.plans.togethers.data :
								null
}
export const getTogetherById = (state, id) => {
	return ('data' in state.plans.togethers.data &&
					id in state.plans.togethers.data.data) ?
								state.plans.togethers.data.data[id] :
								null
}
export const getTogether = (state) => {
	return 'data' in state.plans.together
		? state.plans.together.data
		: null
}
export const getActivities = (state) => {
	return 'data' in state.plans.activities && state.plans.activities.data
		? state.plans.activities.data.data
		: null
}



// RESTFUL API ENDPOINT --------------------------------------------------------
// http://plans.youversionapi.com
const endpoint = 'plans'
const methods = {
	configuration: {
		url: '/4.0/configuration',
	},
	// plans --------------------------------------------
	days: {
		reducerName: 'days',
		url: '/4.0/plans/:id/days',
		transformer: daysTransformer,
	},
	day: {
		reducerName: 'days',
		url: '/4.0/plans/:id/days/:day',
		transformer: daysTransformer,
	},
	// subscriptions ------------------------------------
	subscriptions: {
		reducerName: 'subscriptions',
		url: '/4.0/subscriptions',
		transformer: true,
		reducer: (state, action) => {
			if (action.type === 'DELETE_SUB_FROM_STATE') {
				const { data: { subscription_id } } = action
				return deleteReducer({
					state,
					keyToMap: ['data', 'map'],
					keyToData: ['data', 'data', `${subscription_id}`],
					id: subscription_id,
				})
			}
			return state
		}
	},
	subscription: {
		reducerName: 'subscriptions',
		url: '/4.0/subscriptions/:id',
		transformer: true,
	},
	progress: {
		reducerName: 'progress',
		url: '/4.0/subscriptions/:id/progress',
		transformer: progressDayTransformer,
		reducer: (state, action) => {
			if (action.type === 'custom__progress') {
				const { request: { pathvars: { id } } } = action
				return progressDayTransformer(action.data, state, action, ['data', 'data', `${id}`])
			}
			return state
		}
	},
	// when we update progress, let's actually write into the progress state,
	// instead of writing to progressDay state and then handling merging
	// progress in a different place
	progressDay: {
		reducerName: 'progress',
		url: '/4.0/subscriptions/:id/progress/:day',
		transformer: progressDayTransformer,
	},
	settings: {
		reducerName: 'settings',
		url: '/4.0/subscriptions/:id/settings',
		transformer: settingsTransformer,
	},
	setting: {
		reducerName: 'settings',
		url: '/4.0/subscriptions/:id/settings/:kind',
		transformer: settingsTransformer,
	},
	// together ------------------------------------------
	togethers: {
		url: '/4.0/together',
		transformer: true,
		reducer(state, action) {
			// remove invitation from state on an accept or decline
			if (action.type === this.events.participants.actionSuccess) {
				if (action.request.params.method === 'PUT') {
					const { data: { id } } = action
					return deleteReducer({
						state,
						keyToMap: ['data', 'map'],
						keyToData: ['data', 'data', `${id}`],
						id,
					})
				}
			}
			return state
		}
	},
	together: {
		url: '/4.0/together/:id',
		transformer: true,
		reducer: (state, action) => {
			if (action.type === 'custom__together') {
				const { data: { id } } = action
				return defaultDataTransformer(action.data, state, action, ['data', 'data', `${id}`])
			}
			if (action.type === 'DELETE_SUB_FROM_STATE') {
				const { data: { together_id } } = action
				return deleteReducer({
					state,
					keyToMap: ['data', 'map'],
					keyToData: ['data', 'data', `${together_id}`],
					id: together_id,
				})
			}
			return state
		}
	},
	activities: {
		url: '/4.0/together/:id/activities',
		reducerName: 'activities',
		transformer: activitiesTransformer,
	},
	activity: {
		url: '/4.0/together/:id/activities/:activity_id',
		reducerName: 'activities',
		transformer: activityTransformer,
	},
	activityLike: {
		// the colon in the join needs to be encoded
		// '/4.0/together/:id/activities/(:activity_id):like'
		url: '/4.0/together/:id/activities/:activity_id%3Alike',
		reducerName: 'activities',
		transformer: activityTransformer,
	},
	// participants --------------------------------------
	participants: {
		reducerName: 'participants',
		url: '/4.0/together/:id/participants',
		transformer: participantsTransformer,
		reducer: (state, action) => {
			if (action.type === 'custom__participants') {
				return defaultDataTransformer(action.data, state, action)
			}
			return state
		}
	},
	participantsJoin: {
		// the colon in the join needs to be encoded
		// '/4.0/together/:id/participants:join'
		url: '/4.0/together/:id/participants%3Ajoin',
		transformer: true,
	},
	participant: {
		reducerName: 'participants',
		url: '/4.0/together/:id/participants/:userid',
		transformer: participantsTransformer,
	},
}

// ENDPOINT OPTIONS PREFETCH/POSTFETCH -----------------------------------------
/**
 * Setup prefetch/postfetch functions for checking auth tokens before and after
 * api calls
 */
const reloadGoogleAuth = () => {
	window.yvga.reloadAuthResponse().then((reloadedAuth) => {
		// rewrite the youversion token with the new google token
		const yvToken = fetchToken().split(tokenDelimiter)[0]
		storeToken(`${yvToken}${tokenDelimiter}GoogleJWT+${reloadedAuth.token}`)
	})
}
const customOptions = {
	methodOptions: {
		prefetch: [
			// let's check oauth for each authed plans call
			({ actions, dispatch, getState }, cb) => {
				if (getState().auth && getState().auth.isLoggedIn) {
					const { auth: { oauth, userData: { userid } }, serverLanguageTag } = getState()
					// check google token if signed in with google
					if (
						(cookie.load('auth_type') === 'google')
						&& typeof window !== 'undefined'
						&& window.yvga
						&& window.yvga.isSignedIn()
						&& window.yvga.needNewToken()
					) {
						reloadGoogleAuth()
					}
					// let's only check the oauth token once a day
					if (oauth && oauth.access_token) {
						localOnceDaily(
							`OAuthTokenCheck-${userid}`,
							(handleSuccess) => {
								// has our token expired?
								// or passed our buffer
								const buffer = moment(moment(oauth.valid_until * 1000))
									.subtract(24, 'hours')
									.unix()
								if (isTimestampExpired(buffer)) {
									// refresh it!
									dispatch(oauthAPI.actions.refresh.post({}, {
										body: {
											refresh_token: oauth.refresh_token
										}
									})).then((response) => {
										// if our refresh failed, we need auth credentials
										// log user out
										if ('error' in response) {
											if (typeof window !== 'undefined') {
												window.location.replace(`/${serverLanguageTag}/sign-out`)
											}
										} else {
											handleSuccess()
											cb()
										}
									})
								}
							}
						)
					} else if (typeof window !== 'undefined') {
						window.location.replace(`/${serverLanguageTag}/sign-out`)
					}
				}

				cb()
			}
		],
		postfetch: [
			// let's check if an authed call failed for some reason and try and refresh
			({ data, dispatch, getState, request }) => {
				if (data && 'error' in data && (!('status' in data.error) || data.error.status === 401)) {
					const { auth: { oauth }, serverLanguageTag } = getState()
					// if we're signed in with google and get a 401 let's refresh google and then oauth
					if (
						(cookie.load('auth_type') === 'google')
						&& typeof window !== 'undefined'
						&& window.yvga
						&& window.yvga.isSignedIn()
					) {
						reloadGoogleAuth()
					}
					dispatch(oauthAPI.actions.refresh.post({}, {
						body: {
							refresh_token: oauth.refresh_token
						}
					})).then((response) => {
						// if our refresh failed, we need auth credentials
						// log user out
						if ('error' in response) {
							if (typeof window !== 'undefined') {
								window.location.replace(`/${serverLanguageTag}/sign-out`)
							}
						} else {
						// retry the request that failed
							// dispatch(request)
							window.location.reload(true)
						}
					})
				}
			}
		]
	}
}

/**
 * Create plans endpoint with endpoint, methods and options
 * @type {Object} plansEndpoint - object containing actions and reducers for plans service
 */
const plansEndpoint = apiEndpoint(endpoint, methods, customOptions)

export default plansEndpoint
