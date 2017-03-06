import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				let versesToMerge = Immutable.fromJS({})

				const {
					response: { verses },
					params: {
						passage
					}
				} = action

				if (Array.isArray(verses) && 'verses' in verses[0]) {
					verses.forEach((verse) => {
						const {
							id: version,
							verses: [ innerVerse ]
						} = verse

						const {
							content,
							reference: {
								human,
								usfm: [ usfm ]
							}
						} = innerVerse

						versesToMerge = versesToMerge.mergeDeep({
							[`${passage}`]: {
								[`${version}`]: {
									content,
									chapUsfm: usfm.split('.').slice(0, 2).join('.'),
									human,
									usfm,
									version
								}
							}
						})
					})
					return Immutable.fromJS(state).mergeDeep(versesToMerge.toJS()).toJS()
				}

				return state
			}())

		default:
			return state
	}
}
