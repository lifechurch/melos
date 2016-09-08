import type from '../actions/constants'
import Immutable from 'immutable'

export default function saveForLater(state = {}, action) {
	switch (action.type) {

		case type("planSaveforlaterRequest"):
		case type("planRemoveSaveRequest"):
		case type("planInfoRequest"):

			if (action.params.uiFocus) {
				return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [], collection: { isFetching: true } }).toJS()
			} else {
				return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [] }).toJS()
			}

		case type("planSaveforlaterFailure"):
		case type("planRemoveSaveFailure"):
		case type("planInfoFailure"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors, collection: { isFetching: false } }).toJS()


		case type("planSaveforlaterSuccess"):
		case type("planRemoveSaveSuccess"):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { saved: !state.plans.saved } }).toJS()

		case type("planInfoSuccess"):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: action.response }).toJS()

		default:
			return state
	}
}
