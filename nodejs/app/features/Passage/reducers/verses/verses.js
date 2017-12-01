import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				let versesToMerge = Immutable.fromJS({})

				const {
					response: { verses },
					extras: {
						passage
					}
				} = action


				if (Array.isArray(verses) && 'verses' in verses[0]) {
					verses.forEach((verse) => {
						const {
							id: version,
							next_verse,
							previous_verse,
							verses: [ innerVerse ],
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
									version,
									passage,
									nextVerse: next_verse,
									previousVerse: previous_verse,
									text: content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim()
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