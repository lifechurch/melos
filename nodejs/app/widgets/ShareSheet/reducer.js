import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case 'SHARE_ACTION':
			return Immutable
				.fromJS(state)
				.mergeIn(['data'], action.data)
				.toJS()

		default:
			return state
	}
}
