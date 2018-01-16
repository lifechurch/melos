import type from './constants'

const ActionCreators = {

	/**
	 * @passage: usfm of verse
   * @versions: list of versions for the locale
   * @language_tag: locale
	 */
	passageLoad(params) {
		return dispatch => {
			return new Promise((resolve) => {
				const { isInitialLoad, hasVerseChanged, passage, versions, language_tag } = params

				const refArray = passage.split('.')
				const chapUSFM = refArray.slice(0, 2).join('.')
				const verseORVerseRange = refArray.pop()
				let versesArray = []
				const promises = []
				const cleanedVersions = []

				cleanedVersions.push(versions[0])
				// // first, remove any duplicate versions and maintain ordering
				// let cleanedVersions = Array.from(new Set(versions))
				// // product wants it to look good, so make sure there are 4 versions (not one on the next row)
				// if (cleanedVersions.length > 4) {
				// 	cleanedVersions = cleanedVersions.slice(0, 4)
				// }

				// break up the verses into single verse, or verse range
				versesArray = verseORVerseRange.split(',').map((verseNum) => {
					// if it's a range, build the string for the API
					if (verseNum.includes('-')) {
						const consecutiveString = []
						const firstVerseOfRange = parseInt(verseNum.split('-')[0], 10)
						const lastVerseOfRange = parseInt(verseNum.split('-')[1], 10)

						for (let i = firstVerseOfRange; i <= lastVerseOfRange; i++) {
							consecutiveString.push(`${chapUSFM}.${i}`)
						}
						// 'REV.2.2+REV.2.3+REV.2.4'
						return consecutiveString.join('+')

					} else {
						return `${chapUSFM}.${verseNum}`
					}
				})

				if (isInitialLoad) {
					// then make related reading plans call for the verse
					promises.push(
						dispatch(ActionCreators.readingplansConfiguration())
					)

					cleanedVersions.forEach((id) => {
						promises.push(
							dispatch(ActionCreators.bibleVersion({ id }))
						)
					})
				}

				if (isInitialLoad || hasVerseChanged) {
					promises.push(
						dispatch(ActionCreators.readingPlansByReference({ usfm: passage, language_tag })),
						dispatch(ActionCreators.bibleVerses({ ids: cleanedVersions, references: versesArray }, { passage }))
					)
				}




// try getting chapters to see if we can pull the text out
				// versions.forEach((id) => {
				// 	dispatch(bibleAction({
				// 		method: 'chapter',
				// 		params: {
				// 			id,
				// 			reference: chapterifyUsfm(passage),
				// 		},
				// 	}))
				// })

				Promise.all(promises).then(() => {
					resolve()
				}, () => {
					resolve()
				})
			})
		}
	},

	selectPrimaryVersion(version) {
		return {
			type: type('selectPrimaryVersion'),
			version
		}
	},

	/**
	 * @id 						id of bible version
	 * @references		verse, or range of verses to get
	 * @format				html by default, or text
	 */
	bibleVerses(params, extras) {
		return {
			params,
			extras,
			api_call: {
				endpoint: 'bible',
				method: 'verses',
				version: '3.1',
				auth: false,
				params,
				http_method: 'get',
				types: [ type('bibleVersesRequest'), type('bibleVersesSuccess'), type('bibleVersesFailure') ]
			}
		}
	},

	/**
	 * @id 						id of bible version
	 * @references		verse, or range of verses to get
	 * @format				html by default, or text
	 */
	readingPlansByReference(params) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'plans_by_reference',
				version: '3.1',
				auth: false,
				params,
				http_method: 'get',
				types: [ type('readingplansPlansByReferenceRequest'), type('readingplansPlansByReferenceSuccess'), type('readingplansPlansByReferenceFailure') ]
			}
		}
	},

	/**
	 * @id: VERSION_ID
	 */
	bibleVersion(params) {
		return {
			params,
			api_call: {
				endpoint: 'bible',
				method: 'version',
				version: '3.1',
				auth: false,
				params,
				http_method: 'get',
				types: [ type('bibleVersionRequest'), type('bibleVersionSuccess'), type('bibleVersionFailure') ]
			}
		}
	},

	/**
	 * no params
	 */
	readingplansConfiguration(params = {}) {
		return {
			params,
			api_call: {
				endpoint: 'reading-plans',
				method: 'configuration',
				version: '3.1',
				auth: false,
				params,
				http_method: 'get',
				types: [ type('readingplansConfigurationRequest'), type('readingplansConfigurationSuccess'), type('readingplansConfigurationFailure') ]
			}
		}
	},

	/* no params */
	bibleConfiguration(params = {}) {
		return {
			params,
			api_call: {
				endpoint: 'bible',
				method: 'configuration',
				version: '3.1',
				auth: false,
				params,
				http_method: 'get',
				types: [ type('bibleConfigurationRequest'), type('bibleConfigurationSuccess'), type('bibleConfigurationFailure') ]
			}
		}
	},

}

export default ActionCreators
