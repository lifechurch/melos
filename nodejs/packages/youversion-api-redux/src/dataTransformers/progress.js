import Immutable from 'immutable'

const progressDayTransformer = (data, prevData, action, customKey) => {
	if (data) {
		const { request: { pathvars: { id, day } } } = action
		const stateData = prevData || Immutable.fromJS(data).delete('data').toJS()
			// take the progressDay response and write to the correct day in progress state
		if (day) {
			return Immutable
				.fromJS(stateData)
				.setIn(['data', `${id}`, 'data', 'days', `${data.day}`], data)
				.toJS()
		} else {
			const days = {}
			if (data && data.data && data.data.days) {
				data.data.days.forEach((dayObj) => {
					days[dayObj.day] = dayObj
				})
			}

			const key = customKey || ['data', `${id}`]
			const merge = Immutable
				.fromJS(data)
				.setIn(['data', 'days'], days)
				.toJS()
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(
					key,
					data && data.data && data.data.days
						? merge
						: data
				)
				.toJS()
		}
	}
	return prevData || data
}

export default progressDayTransformer
