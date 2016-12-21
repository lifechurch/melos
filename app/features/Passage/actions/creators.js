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
			const { version, passage, versions, language_tag } = params
			let promises = []
			console.log('lnakwjrhbakwjerhbfjkawehfbjkawehbfjawebfs')
			// rev.2.1 || rev.2.2-4 || rev.2.3,8 || rev.2.2-4,8
			let chapUSFM = passage.split('.').slice(0,2).join('.')
			let verseORVerseRange = passage.split('.').pop()
			let versesString = []
			let versesArray = []

			if (verseORVerseRange.includes('-')) {
				let firstVerseOfRange = verseORVerseRange.split('-')[0]
				// split on comma in case there are more verses after the -
				let lastVerseOfRange = (verseORVerseRange.split('-')[1]).split(',')[0]
				let rangeString = ''

				for (let i = firstVerseOfRange; i <= lastVerseOfRange; i++) {
					versesString.push(`${chapUSFM}.${i}`)
				}

				versesArray.push(versesString.join('+'))
				console.log(verseORVerseRange)
				// if there are verses after -
				if (verseORVerseRange.includes(',')) {
					verseORVerseRange.split(',').forEach((verseNum, index) => {
						// we've already handled the first string before the , up above
						if (index !== 0) {
							versesArray.push(`${chapUSFM}.${i}`)
						}
					})
				}
			}

			console.log(versesArray)

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
								verses.verses.forEach((verse) => {
									// build extra info for the verses
									let text = {
										text: verse.content,
										versionInfo: {
											local_abbreviation: version.local_abbreviation.toUpperCase(),
											local_title: version.local_title,
											id: version.id,
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
							})
						})
					}, (reason) => console.log(reason))
				)

			})
			// then make related reading plans call for the verse
			promises.push(dispatch(ActionCreators.readingplansConfiguration()))
			promises.push(dispatch(ActionCreators.readingPlansByReference({ usfm: passage, language_tag })))

			// wait for all the promises and then dispatch the action
			// to build the data object
			return Promise.all(promises).then((data) => {
				dispatch({ type: type('passageLoadSuccess'), data, primaryVersion: versions[0], current_verse: passage, versions })
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
