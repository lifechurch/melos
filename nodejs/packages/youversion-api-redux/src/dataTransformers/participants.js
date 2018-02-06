import Immutable from 'immutable'

const participantsTransformer = (data, prevData, action) => {
	if (action && action.request) {
		const { params: { method, body }, pathvars: { id, userid } } = action.request
		const bodyData = body && JSON.parse(body)
		if (method === 'DELETE' || (method === 'PUT' && bodyData && bodyData.status === 'kicked')) {
			const deleteIndex = Immutable
				.fromJS(prevData)
				.getIn([`${id}`, 'map'])
				.findIndex((val) => { return userid === val })
			return Immutable
				.fromJS(prevData)
				.deleteIn([`${id}`, 'data', `${userid}`])
				.deleteIn([`${id}`, 'map', deleteIndex > -1 ? deleteIndex : null])
				.toJS()
		}
	}
	return prevData || data
}

export default participantsTransformer
