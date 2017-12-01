import moment from 'moment'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'

/**
 * Loads a data.
 *
 * @param      {object}   params         The parameters
 * @param      {object}   startingState  The starting state
 * @param      {object}   sessionData    The session data
 * @param      {object}   store          The store
 * @param      {object}   Locale         The locale
 * @return     {Promise}  { description_of_the_return_value }
 */
export default function loadData(params, startingState, sessionData, store, Locale) {
	console.log('PLS EXPLORE')
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && params.url && params.languageTag) {
			const { dispatch } = store
			const serverLanguageTag = params.languageTag
			const version_id = getBibleVersionFromStorage(serverLanguageTag)
			// const isVOTD = new RegExp('^\/verse-of-the-day')
			// if (isVOTD.test(params.url)) {
			//
			// }
			resolve()
		} else {
			resolve()
		}
	})
}
