import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('passageAltVersionsLoad'):
			console.log(action)
			return Immutable.fromJS(action.versions).toJS()

		default:
			return state
	}
}