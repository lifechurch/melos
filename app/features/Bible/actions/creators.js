import type from './constants'
import Filter from '../../../lib/filter'

const ActionCreators = {

	/**
	 * @version: VERSION_ID
   * @reference: USFM
   * @lang: locale
	 */
	readerLoad(params, auth) {
		return dispatch => {
			const { version, reference, language_tag } = params
			let promises = [
				dispatch(ActionCreators.bibleVersions({ language_tag: language_tag, type: 'all' })),
				dispatch(ActionCreators.bibleConfiguration()),
				dispatch(ActionCreators.bibleVersion({ id: version })),
				dispatch(ActionCreators.bibleChapter({ id: version, reference: reference, format: 'html', language_tag: language_tag })),
				dispatch(ActionCreators.momentsColors(auth))
			]

			if (auth) {
				promises.push(dispatch(ActionCreators.momentsVerseColors(auth, { usfm: reference, version_id: version })))
				promises.push(dispatch(ActionCreators.momentsLabels(auth)))
				promises.push(dispatch(ActionCreators.usersViewSettings(auth)))
			}
			return Promise.all(promises)
		}
	},

	/**
	 * @id: VERSION_ID
   * @reference: USFM
   * @format: html/text
	 */
	loadVersionAndChapter(params) {
		return dispatch => {
			const { id, reference, format } = params
			return Promise.all([
				dispatch(ActionCreators.bibleVersion({ id })),
				dispatch(ActionCreators.bibleChapter({ id, reference, format: 'html' }))
			])
		}
	},

	/**
	 * @version: VERSION_ID
   * @reference: USFM
   * @lang: locale
	 */
	verseLoad(params, auth) {
		return dispatch => {
			const { verse, versions, language_tag } = params
			let promises = []
			versions.forEach((version) => {
				promises.push(dispatch(ActionCreators.bibleVerses({ id: version, reference: verse })))
			})
			// then make related reading plans call for the verse
			//
			//
			return Promise.all(promises)
		}
	},

	/**
	 * @language_tag
	 * @type: all/public
	 */
	bibleVersions(params) {
		return {
			params,
			api_call: {
				endpoint: 'bible',
				method: 'versions',
				version: '3.1',
				auth: false,
				params: params,
				http_method: 'get',
				types: [ type('bibleVersionsRequest'), type('bibleVersionsSuccess'), type('bibleVersionsFailure') ]
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

	/**
	 * @id: VERSION_ID
   * @reference: USFM
   * @format: html/text
	 */
	bibleChapter(params) {
		return {
			params,
			api_call: {
				endpoint: 'bible',
				method: 'chapter',
				version: '3.1',
				auth: false,
				params: params,
				http_method: 'get',
				types: [ type('bibleChapterRequest'), type('bibleChapterSuccess'), type('bibleChapterFailure') ]
			}
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
	momentsColors(auth, params = {}) {
		return {
			params,
			api_call: {
				endpoint: 'moments',
				method: 'colors',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('momentsColorsRequest'), type('momentsColorsSuccess'), type('momentsColorsFailure') ]
			}
		}
	},

	usersViewSettings(auth, params = {}) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'view_settings',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('usersViewSettingsRequest'), type('usersViewSettingsSuccess'), type('usersViewSettingsFailure') ]
			}
		}
	},

	usersUpdateSettings(auth, params = {}) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'update_settings',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('usersUpdateSettingsRequest'), type('usersUpdateSettingsSuccess'), type('usersUpdateSettingsFailure') ]
			}
		}
	},


	/**
	 * See http://developers.youversion.com/api/docs/3.1/sections/moments/create.html
	 * @kind
	 * @references
	 * @color
	 * @title
	 * @content
	 * @labels
	 * @user_status
	 * @image_id
	 * @created_dt
	 */
	momentsCreate(auth, params) {
		return {
			params,
			api_call: {
				endpoint: 'moments',
				method: 'create',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'post',
				types: [ type('momentsCreateRequest'), type('momentsCreateSuccess'), type('momentsCreateFailure') ]
			}
		}
	},

	/* no params */
	momentsLabels(auth, params={}) {
		return {
			params,
			api_call: {
				endpoint: 'moments',
				method: 'labels',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('momentsLabelsRequest'), type('momentsLabelsSuccess'), type('momentsLabelsFailure') ]
			}
		}
	},

	/**
	 * @usfm (chapter only)
	 * @version_id
	 */
	momentsVerseColors(auth, params) {
		return {
			params,
			api_call: {
				endpoint: 'moments',
				method: 'verse_colors',
				version: '3.1',
				auth: auth,
				params: params,
				http_method: 'get',
				types: [ type('momentsVerseColorsRequest'), type('momentsVerseColorsSuccess'), type('momentsVerseColorsFailure') ]
			}
		}
	},

	bookSelectorOpen() {
		return {
			type: type('bookSelectorOpen')
		}
	},

	bookSelectorClose() {
		return {
			type: type('bookSelectorClose')
		}
	},

	bookSelectorSelectBook(params) {
		return {
			type: type('bookSelectorSelectBook'),
			params
		}
	},

	bookSelectorSelectChapter(params) {
		return {
			type: type('bookSelectorSelectChapter'),
			params
		}
	},

	bookSelectorFilterBooks(params) {
		return {
			type: type('bookSelectorFilterBooks'),
			params
		}
	},

	bookSelectorCancelFilter() {
		return {
			type: type('bookSelectorCancelFilter')
		}
	},

	bookSelectorFilterBookSelect(params) {
		return {
			type: type('bookSelectorFilterBookSelect'),
			params
		}
	},

	bookSelectorFilterChapterSelect(params) {
		return {
			type: type('bookSelectorFilterChapterSelect'),
			params
		}
	},

	versionSelectorOpen() {
		return {
			type: type('versionSelectorOpen')
		}
	},

	versionSelectorClose() {
		return {
			type: type('versionSelectorClose')
		}
	},

	versionSelectorSelectLanguage(params) {
		return {
			type: type('versionSelectorSelectLanguage'),
			params
		}
	},

	versionSelectorSelectVersion(params) {
		return {
			type: type('versionSelectorSelectVersion'),
			params
		}
	},

	versionSelectorFilterLanguages(params) {
		return {
			type: type('versionSelectorFilterLanguages'),
			params
		}
	},

	versionSelectorFilterVersions(params) {
		return {
			type: type('versionSelectorFilterVersions'),
			params
		}
	},

	versionSelectorCancelFilter() {
		return {
			type: type('versionSelectorCancelFilter')
		}
	},

	versionSelectorFilterVersionSelect(params) {
		return {
			type: type('versionSelectorFilterVersionSelect'),
			params
		}
	},

	audioOpen() {
		return {
			type: type('audioOpen')
		}
	},

	audioClose() {
		return {
			type: type('audioClose')
		}
	},

	audioLoaded(params) {
		return {
			type: type('audioLoaded'),
			params
		}
	},

	audioPlay(params) {
		return {
			type: type('audioPlay')
		}
	},

	audioSeek(params) {
		return {
			type: type('audioPlay'),
			params
		}
	},

	audioSpeed(params) {
		return {
			type: type('audioSpeed'),
			params
		}
	},

	audioNewWindow(params) {
		return {
			type: type('audioNewWindow'),
			params
		}
	},

	fontChangeSize(params) {
		return {
			type: type('fontChangeSize'),
			params
		}
	},

	fontChangeFamily(params) {
		return {
			type: type('fontChangeFamily'),
			params
		}
	},

	footnotesToggle(params) {
		return {
			type: type('footnotesToggle'),
			params
		}
	},

	numbersAndTitlesToggle(params) {
		return {
			type: type('numbersAndTitlesToggle'),
			params
		}
	},

	verseActionOpen(params) {
		return {
			type: type('verseActionOpen'),
			params
		}
	},

	verseActionClose(params) {
		return {
			type: type('verseActionClose'),
			params
		}
	},

	verseActionShareOpen(params) {
		return {
			type: type('verseActionShareOpen'),
			params
		}
	},

	verseActionShareClose(params) {
		return {
			type: type('verseActionShareClose'),
			params
		}
	},

	verseActionCopyOpen(params) {
		return {
			type: type('verseActionCopyOpen'),
			params
		}
	},

	verseActionCopyClose(params) {
		return {
			type: type('verseActionCopyClose'),
			params
		}
	},

	verseActionBookmarkOpen(params) {
		return {
			type: type('verseActionBookmarkOpen'),
			params
		}
	},

	verseActionBookmarkClose(params) {
		return {
			type: type('verseActionBookmarkClose'),
			params
		}
	},

	verseActionNoteOpen(params) {
		return {
			type: type('verseActionNoteOpen'),
			params
		}
	},

	verseActionNoteClose(params) {
		return {
			type: type('verseActionNoteClose'),
			params
		}
	}
}

export default ActionCreators
