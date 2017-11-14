import cookie from 'react-cookie'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import usersAction from '@youversion/api-redux/lib/endpoints/users/action'
import customGet from '@youversion/api-redux/lib/customHelpers/get'
import ActionCreator from '../../features/PlanDiscovery/actions/creators'
import { getDefaultVersion } from '../../lib/readingPlanUtils'
/**
 * Loads a data.
 *
 * @param      {object}   params         The parameters
 * @param      {object}   startingState  The starting state
 * @param      {object}   sessionData    The session data
 * @param      {object}   store          The store
 * @param      {object}   Locale         The locale
 * @return     {Promise}  { description_of_the_return_value }
 */
export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && params.url && params.languageTag) {
			const isCollection = new RegExp('^\/reading-plans-collection\/[0-9]+')
			const isIndex = new RegExp('^\/reading-plans$')
			const isSaved = new RegExp('^\/saved-plans-collection$')
			const isRecommended = new RegExp('^\/recommended-plans-collection\/[0-9]+')
			const isPlan = new RegExp('^\/reading-plans\/[0-9]+')

			const isReadingPlanSample = new RegExp('^\/reading-plans\/[0-9a-zA-Z-]+-[^\r\n\t\f\/ ]+\/day/[0-9]+')

			const isSharedDayComplete = new RegExp('^\/reading-plans\/[0-9]+-[^\r\n\t\f\/ ]+\/day\/[0-9]+\/completed')
			const isPlanComplete = new RegExp('^\/users\/[^\r\n\t\f\/ ]+\/reading-plans\/[0-9]+-[^\r\n\t\f\/ ]+\/completed')

			const isLookinside = new RegExp('^\/lookinside\/[0-9]+-[^\r\n\t\f\/ ]+')
			const isLookinsideSample = new RegExp('^\/lookinside\/[0-9]+-[^\r\n\t\f\/ ]+\/read\/day/[0-9]+')

			const isTogetherInvitation = new RegExp('^\/reading-plans\/[0-9a-zA-Z-]+(-[^\r\n\t\f\/ ]+)?\/together/[0-9a-zA-Z-]+/invitation')

			let auth = false
			if (sessionData.email && sessionData.password) {
				auth = { username: sessionData.email, password: sessionData.password }
			} else if (sessionData.tp_token) {
				auth = { tp_token: sessionData.tp_token }
			}

			if (isIndex.test(params.url)) {
				store.dispatch(ActionCreator.discoverAll({ language_tag: Locale.planLocale }, auth)).then(() => { resolve() })
			} else if (isSaved.test(params.url)) {
				store.dispatch(ActionCreator.savedPlanInfo({ context: 'saved' }, auth)).then(() => { resolve() })
			} else if (isTogetherInvitation.test(params.url)) {
				const { id, together_id, token } = params
				const { dispatch } = store
				const proms = [
					dispatch(readingPlansAction({
						method: 'view',
						params: {
							id: id.split('-')[0],
						},
					})),
					new Promise((resolve2) => {
						customGet({
							actionName: 'participants',
							pathvars: {
								id: together_id,
								token,
							},
							dispatch,
							actions: plansAPI.actions,
							auth,
							serverLanguageTag: Locale.planLocale,
						})
							.then((data) => {
								const promesan = [data]
								if (data && data.data) {
									data.data.forEach((user) => {
										promesan.push(
											dispatch(usersAction({
												method: 'view',
												params: {
													id: user.id,
												},
											}))
										)
									})
								}
								Promise.all(promesan)
									.then((promisedLand) => {
										resolve2(promisedLand)
									})
									.catch((err) => {
										resolve2(err)
									})
							})
							.catch((err) => { resolve2(err) })
					}),
					new Promise((reso) => {
						dispatch(plansAPI.actions.together.get({
							id: together_id,
							token,
						}, { auth }))
						.then((data) => { reso(data) })
						.catch((err) => { reso(err) })
					})
				]
				resolve(Promise.all(proms)
					.then(() => { resolve() })
					.catch(() => { resolve() }))
			} else if (isPlanComplete.test(params.url)) {
				store.dispatch(ActionCreator.planComplete({
					id: params.id,
					language_tag: Locale.planLocale,
					user_id: sessionData.userid,
					getPlanView: true,
					getSavedPlans: true,
					getRecommendedPlans: true,
				}, auth)).then((d) => { resolve() })

			} else if (isSharedDayComplete.test(params.url)) {
				// pass user id to get user info for page
				store.dispatch(ActionCreator.sharedDayComplete({
					id: params.id,
					language_tag: Locale.planLocale,
					user_id: params.user_id,
				}, false)).then((d) => { resolve() })
			} else if (isReadingPlanSample.test(params.url)) {
				const version = params.version || cookie.load('version') || '1'
				store.dispatch(ActionCreator.sampleAll({
					id: params.id,
					language_tag: Locale.planLocale,
					day: params.day,
					version,
				}, auth))
					.then(() => {
						resolve()
					}, () => {
						store.dispatch(ActionCreator.sampleAll({
							id: params.id,
							language_tag: Locale.planLocale,
							day: params.day,
							version: getDefaultVersion(store, Locale.locale3),
						}, auth)).then(() => {
							resolve()
						}, () => { resolve() })
					})

			}	else if (isLookinsideSample.test(params.url)) {
				const version = params.version || cookie.load('version') || '1'
				store.dispatch(ActionCreator.sampleAll({
					id: params.id,
					language_tag: Locale.planLocale,
					day: params.day,
					version,
				}, auth))
				.then(() => {
					resolve()
				}, () => {
					store.dispatch(ActionCreator.sampleAll({
						id: params.id,
						language_tag: Locale.planLocale,
						day: params.day,
						version: getDefaultVersion(store, Locale.locale3),
					}, auth)).then(() => {
						resolve()
					}, () => { resolve() })
				})
			} else if (isLookinside.test(params.url)) {
				store.dispatch(ActionCreator.readingplanView({
					id: params.id,
					language_tag: Locale.planLocale,
				}, auth)).then(() => { resolve() })

			} else if (params.id) {
				if (isCollection.test(params.url)) {
					store.dispatch(ActionCreator.collectionAll({ id: params.id })).then(() => { resolve() })
				} else if (isPlan.test(params.url)) {
					const getPlanView = true
					const getStats = true
					const getSavedPlans = true
					const getRecommendedPlans = true
					store.dispatch(ActionCreator.readingplanInfo({
						getPlanView,
						getStats,
						getSavedPlans,
						getRecommendedPlans,
						id: params.id,
						language_tag: Locale.planLocale
					}, auth)).then((d) => { resolve() })
				} else if (isRecommended.test(params.url)) {
					store.dispatch(ActionCreator.recommendedPlansInfo({ context: 'recommended', id: params.id, language_tag: Locale.planLocale }, auth)).then(() => { resolve() })
				} else {
					resolve()
				}

			} else {
				resolve()
			}

		} else {
			resolve()
		}

	})
}
