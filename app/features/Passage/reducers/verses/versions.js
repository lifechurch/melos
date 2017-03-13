import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { params } = action
				if ('ids' in params) {
					return Immutable.fromJS(state).set('ids', params.ids).toJS()
				}
				return state
			}())

		case type('bibleVersionSuccess'):
			return (function bibleVersionSuccess() {
				const {
					response: {
						id,
						local_abbreviation,
						local_title,
						copyright_short,
						language
					},
					params: {
						passage
					}
				} = action

				return Immutable.fromJS(state).mergeDeep({
					versions: {
						[`${id}`]: {
							id,
							local_abbreviation,
							local_title,
							copyright_short,
							language
						}
					}
				}).toJS()
			}())

		default:
			return state
	}
}
