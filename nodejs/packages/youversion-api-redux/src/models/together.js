import { createSelector } from 'reselect'
import moment from 'moment'
import Immutable from 'immutable'
import { getParticipants, getTogethers, getTogether, getActivities } from '../endpoints/plans'


const getTogetherModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getTogethers, getTogether, getParticipants, getActivities ],
	(togethers, together, participants, activities) => {
		const togetherModel = { byId: {}, allIds: [] }
		// TOGETHER(s)
		if (together && together.map && together.map.length > 0) {
			together.map.forEach((togetherId) => {
				togetherModel.byId = Immutable
					.fromJS(togetherModel.byId)
					.mergeDeepIn([togetherId], together.data[togetherId])
					.toJS()
			})
		}
		if (togethers && togethers.map && togethers.map.length > 0) {
			togethers.map.forEach((togetherId) => {
				togetherModel.byId = Immutable
					.fromJS(togetherModel.byId)
					.mergeDeepIn([togetherId], togethers.data[togetherId])
					.toJS()
			})
		}
		// PARTICIPANTS
		// let's add the list of participants to each subscription with friends
		if (participants && participants.map && Array.isArray(participants.map) && participants.map.length > 0) {
			participants.map.forEach((together_id) => {
				togetherModel.byId = Immutable
					.fromJS(togetherModel.byId)
					.mergeDeepIn([together_id], {
						participants: participants.data[together_id]
					})
					.toJS()
			})
		}
		// ACTIVITIES
		if (activities) {
			Object.keys(activities).forEach((together_id) => {
				const days = activities[together_id]

				let newDays = {}
				Object.keys(days).forEach((dayNum) => {
					let newDay = {
						data: {},
						map: Immutable.fromJS(days[dayNum].map).toJS().sort((a, b) => {
							// sort activities by created_dt
							const oA = days[dayNum].data[a]
							const oB = days[dayNum].data[b]
							return moment(oA.created_dt).diff(moment(oB.created_dt))
						}),
						next_page: days[dayNum].next_page
					}
					// sort activities by created_dt
					newDay.map.forEach((id) => {
						const act = days[dayNum].data[id]
						newDay = Immutable
							.fromJS(newDay)
							.mergeDeepIn(['data', `${id}`], act)
							.toJS()
					})
					newDays = Immutable
						.fromJS(newDays)
						.mergeDeepIn([dayNum], newDay)
						.toJS()
				})
				togetherModel.byId = Immutable
					.fromJS(togetherModel.byId)
					.mergeDeepIn([together_id], {
						activities: newDays
					})
					.toJS()
			})
		}

		// set ids
		togetherModel.allIds = Object.keys(togetherModel.byId)

		return togetherModel
	}
)

export default getTogetherModel
