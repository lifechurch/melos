import Immutable from 'immutable'

export const calcNextPage = (data, params) => {
	// let's do the next_page math here
	let next_page = null
	if (data.next_page) {
		// if we sent a page with this request and the response says thare's a next_page
		// then add 1 to the page sent
		if (params && 'page' in params) {
			next_page = params.page + 1
		} else {
			// else if we have a next page and didn't send page, then it has to be
			// the second page (because no page sent defaults to 1)
			next_page = 2
		}
	}
	return next_page
}


/**
 * [defaultDataTransformer description]
 * @param  {[type]} data     [description]
 * @param  {[type]} prevData [description]
 * @param  {[type]} action   [description]
 * @return {[type]}          [description]
 */
export default function defaultDataTransformer(data, prevData, action, dataLocationKey = null) {
	let combined = {}
	const map = []
	const method = action
		? Immutable.fromJS(action).getIn(['request', 'params', 'method'], null)
		: null

	// POST
	if (method === 'POST' || method === 'PUT') {
		if ('error' in data) {
			return prevData
		}
		const stateData = prevData || Immutable.fromJS(data).delete('data').toJS()
		// let's place this new activity at the top of the list
		const stateMap = Immutable
			.fromJS(stateData)
			.getIn(['map'])
		let newMap = [data.id]
		if (stateMap) {
			newMap = stateMap.includes(data.id)
				? stateMap
				: stateMap.unshift(data.id)
		}

		return Immutable
			.fromJS(prevData)
			.setIn(['map'], newMap)
			.mergeDeepIn(['data', `${data.id}`], data)
			.toJS()
	// DELETE
	} else if (method === 'DELETE') {
		const { request: { pathvars: { id } } } = action
		const key = ['data', `${id}`]

		return Immutable
			.fromJS(prevData)
			.deleteIn(key)
			.toJS()
	// DATA RESPONSE (GET, etc..)
	} else if (data && data.data) {
		const { request: { pathvars: { id } } } = action
		const stateData = prevData || Immutable.fromJS(data).delete('data').toJS()
		if (!(stateData.data)) {
			stateData.data = {}
		}

		// if our response is an array, let's loop through and convert it to an object
		// keyed by each object's id
		if (Array.isArray(data.data) && data.data.length > 0 && 'id' in data.data[0]) {
			data.data.forEach((datum) => {
				// let's push a map to maintain order from the api
				map.push(datum.id)
				combined[datum.id] = datum
			})
		// if our data is an object or an array without ids in the object, just use that
		} else {
			combined = data
		}

		const next_page = calcNextPage(data, action.request.pathvars)
		// let's keep data at the top level
		const merge = 'data' in combined
			? { ...combined }
			: { data: combined, next_page }

		// to make this reusable for custom reducers, let's let the caller determine
		// where in state the data should be stored
		const key = dataLocationKey || ['data', `${id}`]

		// if we passed an id in to the request, let's key by that id
		if (id) {
			const prevMap = Immutable
				.fromJS(stateData)
				.getIn(key.concat(['map']), [])
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(key, merge)
				.mergeDeepIn(key,
					{ map: Array.from(new Set(prevMap.concat(map))) }
				)
				.toJS()
		} else {
			const prevMap = Immutable
				.fromJS(stateData)
				.getIn(['map'], [])
			return Immutable
				.fromJS(stateData)
				.mergeDeep(merge)
				.mergeDeep({ map: Array.from(new Set(prevMap.concat(map))) })
				.toJS()
		}
	} else if (data && 'id' in data) {
		const { request: { pathvars: { id } } } = action
		const stateData = prevData || {}
		// to make this reusable for custom reducers, let's let the caller determine
		// where in state the data should be stored
		const key = dataLocationKey || ['data', `${id}`]
		const mapKey = (dataLocationKey
			&& dataLocationKey.slice(0, -2))
			|| []
		if (id) {
			const prevMap = Immutable
				.fromJS(stateData)
				.getIn(mapKey.concat(['map']), [])
			return Immutable
				.fromJS(stateData)
				.mergeDeepIn(key, data)
				.setIn(mapKey.concat('map'), Array.from(new Set(prevMap.concat([parseInt(id, 10)]))))
				.toJS()
		}
	}
	// don't return a null data in case it overwrites prevData
	// or error
	const newData = (data && 'data' in data && !data.data)
		|| (data && 'error' in data)
		? null
		: data
	return newData || prevData || combined
}
