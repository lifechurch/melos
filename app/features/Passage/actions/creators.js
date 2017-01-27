import type from './constants'
import Immutable from 'immutable'

const ActionCreators = {

	/**
	 * @passage: usfm of verse
   * @versions: list of versions for the locale
   * @language_tag: locale
	 */
	passageLoad(params, auth) {
		return dispatch => {
			const { isInitialLoad, hasVerseChanged, hasVersionChanged, version, passage, versions, language_tag } = params

			// rev.2.1 || rev.2.2-4 || rev.2.3,8 || rev.2.2-4,8
			let refArray = passage.split('.')
			const chapUSFM = refArray.slice(0,2).join('.')
			const verseORVerseRange = refArray.pop()
			let versesArray = []
			let promises = []

			// break up the verses into single verse, or verse range
			versesArray = verseORVerseRange.split(',').map((verseNum) => {
				// if it's a range, build the string for the API
				if (verseNum.includes('-')) {
					let consecutiveString = []
					let firstVerseOfRange = parseInt(verseNum.split('-')[0])
					let lastVerseOfRange = parseInt(verseNum.split('-')[1])

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
			}

			if (isInitialLoad || hasVersionChanged) {
				// promises.push(
				// )
			}

			if (isInitialLoad || hasVerseChanged) {
				promises.push(
					dispatch(ActionCreators.readingPlansByReference({ usfm: passage, language_tag }))
				)

				versions.forEach((id) => {
					// get the version info, and then pass it along to the verses call
					promises.push(
						new Promise((resolve, reject) => {
							// get version info to pass down
							dispatch(ActionCreators.bibleVersion({ id: id })).then((version) => {
								// now we need to get the text for the verses
								dispatch(ActionCreators.bibleVerses({ id, references: versesArray, format: 'text' })).then((verses) => {

									// for each verse, pass the text content and make the same call for
									// html content
									if (verses && verses.verses) {
										verses.verses.forEach((verse, index) => {
											// build extra info for the verses
											let text = {
												text: verse.content,
												usfm: versesArray,
												versionInfo: {
													local_abbreviation: version.local_abbreviation.toUpperCase(),
													local_title: version.local_title,
													id: version.id,
													copyright_short: version.copyright_short,
												},
											}

											// get the html content now
											dispatch(ActionCreators.bibleVerses({
												id: id,
												references: versesArray,
											}))

											// resolve the promise with both text info and html result to build the data object for
											// the verse card in the reducer
											.then((html) => resolve(Immutable.fromJS(html).merge(text).toJS()))

										})
									} else {
										reject('verses error')
									}
								})
							})
						}, (reason) => reject(reason))
					)
				})
			}

			if (auth && isInitialLoad) {
				// promises.push(
				// )
			}

			if (auth && (isInitialLoad || hasVerseChanged || hasVersionChanged)) {
				// promises.push(
				// )
			}

			// wait for all the promises and then dispatch the action
			// to build the data object
			return Promise.all(promises).then((data) => {
				dispatch({ type: type('passageLoadSuccess'), data, primaryVersion: versions[0], current_verse: passage, versions, verseRange: verseORVerseRange })
			}, (reason) => dispatch({ type: type('passageLoadFailure'), reason }))
		}
	},

	/**
	 * @id 						id of bible version
	 * @references		verse, or range of verses to get
	 * @format				html by default, or text
	 */
	bibleVerses(params) {
		return {
			params,
			api_call: {
				endpoint: 'bible',
				method: 'verses',
				version: '3.1',
				auth: false,
				params: params,
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
				params: params,
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
				params: params,
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
				params: params,
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
				params: params,
				http_method: 'get',
				types: [ type('bibleConfigurationRequest'), type('bibleConfigurationSuccess'), type('bibleConfigurationFailure') ]
			}
		}
	},

}

export default ActionCreators
