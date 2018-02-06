import Immutable from 'immutable'

const daysTransformer = (data, prevData, action) => {
	if (data) {
		const { request: { pathvars: { id, day }, params } } = action

		// single day or page of days?
		if (day) {
			return Immutable
				.fromJS(prevData || {})
				.mergeIn(['data', `${id}`, `${day}`], data)
				.toJS()
		} else {
			const stateData = prevData || Immutable.fromJS(data).delete('data').toJS()
			// let's do the next_page math here
			let next_page = null
			if (data.next_page) {
				// if we sent a page with this request and the response says thare's a next_page
				// then add 1 to the page sent
				if ('page' in params) {
					next_page = params.page + 1
				} else {
					// else if we have a next page and didn't send page, then it has to be
					// the second page (because no page sent defaults to 1)
					next_page = 2
				}
			}
			const days = {}
			data.data.forEach((dayObj) => {
				days[dayObj.day] = dayObj
			})

			const merge = { data: days, next_page }
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(['data', `${id}`], merge)
				.toJS()
		}
	}
	return prevData || data
}

export default daysTransformer
