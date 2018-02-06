import Immutable from 'immutable'

export default ({ state, keyToData, keyToMap, id }) => {
	const deleteIndex = Immutable
		.fromJS(state)
		.getIn(keyToMap, null)
		&& Immutable
				.fromJS(state)
				.getIn(keyToMap)
				.findIndex((val) => { return parseInt(id, 10) === parseInt(val, 10) })
	return Immutable
		.fromJS(state)
		.deleteIn(keyToData)
		.deleteIn(keyToMap, deleteIndex > -1 ? deleteIndex : null)
		.toJS()
}
