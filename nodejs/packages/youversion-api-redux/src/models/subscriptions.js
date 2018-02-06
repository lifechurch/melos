import { createSelector } from 'reselect'
import Immutable from 'immutable'
import moment from 'moment'
import calcProgress from '@youversion/utils/lib/readingPlans/calcProgress'
import { getSubscriptions, getProgress, getSettings } from '../endpoints/plans'


const getSubscriptionsModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getSubscriptions, getProgress, getSettings ],
	(subscriptions, progress, settings) => {
		const subscriptionsModel = {
			byId: {},
			allIds: [],
			next_page: null,
			loading: false
		}

		// SUBSCRIPTIONS
		if (subscriptions) {
			let subIds = []
			// build id list froms subscriptions and or subscription
			if (subscriptions && subscriptions.map) {
				subIds = subIds.concat(subscriptions.map)
				// set next_page
				subscriptionsModel.next_page = subscriptions.next_page
				// set loading
				subscriptionsModel.loading = subscriptions.loading
			}

			subIds.forEach((sub) => {
				subscriptionsModel.byId = Immutable
					.fromJS(subscriptionsModel.byId)
					.mergeDeepIn([sub], subscriptions.data[sub])
					.toJS()
			})
		}
		// PROGRESS
		if (progress) {
			Object.keys(progress).forEach((sub) => {
				// calc completion percentage
				const days = progress[sub].data.days
				const newSub = Immutable
					.fromJS(progress[sub].data)
					.setIn(['overall'],
						calcProgress({
							progressDays: days,
							start_dt: sub in subscriptions.data
								&& subscriptions.data[sub].start_dt,
						})
					)
					.toJS()
				subscriptionsModel.byId = Immutable
					.fromJS(subscriptionsModel.byId)
					.mergeDeepIn([sub], newSub)
					.toJS()
			})
		}
		// SETTINGS
		if (settings) {
			Object.keys(settings).forEach((sub) => {
				subscriptionsModel.byId = Immutable
					.fromJS(subscriptionsModel.byId)
					.mergeDeepIn([sub, 'settings'], settings[sub])
					.toJS()
			})
		}

		// set ids
		const ids = subscriptions && 'map' in subscriptions
			? subscriptions.map
			: Object.keys(subscriptionsModel.byId)
		// sort by created_dt
		subscriptionsModel.allIds = ids.sort((a, b) => {
			const oA = subscriptionsModel.byId[a]
			const oB = subscriptionsModel.byId[b]
			// descending
			return moment(oB.created_dt).diff(moment(oA.created_dt))
		})


		// utility functions
		subscriptionsModel.getCompleted = () => {
			const completed = []
			if (subscriptionsModel.allIds.length > 0) {
				subscriptionsModel.allIds.forEach((id) => {
					const sub = subscriptionsModel.byId[id]
					if (sub.completed_dt) {
						completed.push(sub)
					}
				})
			}

			return completed
		}

		return subscriptionsModel
	}
)

export default getSubscriptionsModel
