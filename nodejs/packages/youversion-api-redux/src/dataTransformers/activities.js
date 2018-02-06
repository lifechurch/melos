import Immutable from 'immutable'
import { calcNextPage } from './default'

export const activitiesTransformer = (data, prevData, action) => {
	if (data) {
		const { request: { pathvars: { id, day, kind }, params: { method } } } = action
		const stateData = prevData || Immutable.fromJS(data).delete('data').toJS()
		const next_page = calcNextPage(data, action.request.params)
		// let's key by together_id and then day
		// if we've asked for a specific day, use that as the day key
		if (day) {
			const dataObj = {}
			const map = []
			// key activity by id
			if (data.data) {
				data.data.forEach((activity) => {
					map.push(activity.id)
					dataObj[activity.id] = activity
					// if we've passed a kind in, to filter the response by, let's
					// put it in each activity
					if (kind) {
						dataObj[activity.id] = Immutable
							.fromJS(dataObj[activity.id])
							.merge({ kind })
							.toJS()
					}
				})
			}
			const prevMap = Immutable
				.fromJS(stateData)
				.getIn(['data', `${id}`, `${day}`, 'map'])
			const merge = 'data' in dataObj
				? { ...dataObj, next_page }
				: { data: dataObj, next_page }
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(['data', `${id}`, `${day}`], merge)
				.mergeDeepIn(
					['data', `${id}`, `${day}`],
					prevMap
						? { map: Array.from(new Set(map.concat(prevMap.toJS()))) }
						: { map }
				)
				.toJS()
		// otherwise let's update the activities on a create
		} else if (method === 'POST') {
			// let's place this new activity at the top of the list
			const stateMap = Immutable
				.fromJS(stateData)
				.getIn(['data', `${data.together_id}`, `${data.day}`, 'map'])
			const newMap = stateMap.push(data.id)
			return Immutable
				.fromJS(prevData)
				.mergeDeepIn(['data', `${data.together_id}`, `${data.day}`, 'map'], newMap)
				.mergeDeepIn(['data', `${data.together_id}`, `${data.day}`, 'data', `${data.id}`], data)
				.toJS()
		// otherwise, we're getting all the days, so we pull the day from the data itself
		} else if (data.length > 0) {
			const newData = {}
			const dayData = {}
			const map = []
			data.forEach((dayActivities) => {
				day.forEach((activity) => {
					map.push(activity.id)
					dayData[activity.id] = activity
				})
				newData[dayActivities.day] = { data: dayData, map }
			})
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(['data', id], newData)
				.toJS()
		}
	}
	return prevData || data
}

export const activityTransformer = (data, prevData, action) => {
	const { request: { pathvars: { id, activity_id }, params: { method, day } } } = action
	// delete a like, edit a comment, post a comment, post a like
	if (data && 'id' in data) {
		return Immutable
			.fromJS(prevData)
			.setIn(['data', `${id}`, `${data.day}`, 'data', `${activity_id}`], data)
			.toJS()
	// if we did a delete but don't have any data, then we're deleting a comment
	} else if (method === 'DELETE') {
		const deleteIndex = Immutable
			.fromJS(prevData)
			.getIn(['data', `${id}`, `${day}`, 'map'])
			.findIndex((val) => { return activity_id === val })
		return Immutable
			.fromJS(prevData)
			.deleteIn(['data', `${id}`, `${day}`, 'data', `${activity_id}`])
			.deleteIn(['data', `${id}`, `${day}`, 'map', deleteIndex > -1 ? deleteIndex : null])
			.toJS()
	}
	return prevData || data
}
