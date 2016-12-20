import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {

		// configuration
		//
		case type('readingplansConfigurationRequest'):
			return { loading: true }

		case type('readingplansConfigurationFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('readingplansConfigurationSuccess'):
			return Immutable.fromJS(action.response).delete('loading').toJS()


		default:
			return state
	}
}