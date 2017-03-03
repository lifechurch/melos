import Immutable from 'immutable'

import type from '../../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				let versesToMerge = Immutable.fromJS({})
				const {
					response: {
						verses
					},
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

						versesToMerge = versesToMerge.mergeDeepIn([`${passage}`, `${version}`], {
							content,
							chapUsfm: usfm.split('.').slice(0, 2).join('.'),
							heading: '',
							human,
							usfm,
							version,
							text: ''
						})
					})
					return Immutable.fromJS(state).mergeDeep(versesToMerge.toJS()).toJS()
				}

				return state
			}())

		case type('bibleVersionSuccess'):
			return (function bibleVersionSuccess() {
				const { response: { id, local_abbreviation, local_title, copyright_short }, params: { passage } } = action
				return Immutable.fromJS(state).mergeDeep({
					[`${passage}`]: {
						[`${id}`]: {
							versionInfo: {
								id,
								local_abbreviation,
								local_title,
								copyright_short
							}
						}
					}
				}).toJS()
			}())

		default:
			return state
	}
}
