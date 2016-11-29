import type from './constants'
import Filter from '../../../lib/filter'

const ActionCreators = {

	/**
	 * @version: VERSION_ID
   * @reference: USFM
   * @lang: locale
	 */
	passageLoad(params, auth) {
		return dispatch => {
			const { passage, versions, language_tag } = params
			let promises = []

			versions.forEach((id) => {
				// get the version info, and then pass it along to the verses call
				promises.push(
					new Promise((resolve, reject) => {
						// get version info to pass down
						dispatch(ActionCreators.bibleVersion({ id: id })).then((version) => {
							// now we need to get the text for the verses
							dispatch(ActionCreators.bibleVerses({ id, references: [passage], format: 'text' })).then((verses) => {
								// for each verse, pass the text content and make the same call for
								// html content
								verses.verses.forEach((verse) => {
									resolve(
										dispatch(ActionCreators.bibleVerses({
											id: id,
											references: [passage],
											text: verse.content,
											versionInfo: {
												local_abbreviation: version.local_abbreviation.toUpperCase(),
												local_title: version.local_title,
												id: version.id,
											},
										}))
									)
								})

							})
						})
					}, (reason) => console.log(reason))
				)

			})
			// then make related reading plans call for the verse
			promises.push(dispatch(ActionCreators.readingplansConfiguration()))
			promises.push(dispatch(ActionCreators.readingPlansByReference({ usfm: passage, language_tag })))


			return Promise.all(promises)
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
