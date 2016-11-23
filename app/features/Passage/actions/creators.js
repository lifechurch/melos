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

			versions.forEach((version) => {
				console.log(version)
				promises.push(dispatch(ActionCreators.bibleVerses({ id: version, references: [passage] })))
			})
			// then make related reading plans call for the verse
			//
			//
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
