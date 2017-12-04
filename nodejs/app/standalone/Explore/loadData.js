import moment from 'moment'
import exploreApi from '@youversion/api-redux/lib/endpoints/explore'
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
			const isTopic = new RegExp('^\/explore/[0-9a-zA-Z-]+')
			const isExplore = new RegExp('^\/explore')
			if (isTopic.test(params.url)) {
				dispatch(exploreApi.actions.topic.get({ topic: params.topic })).then(() => {
					resolve()
				}).catch(() => { resolve() })
			} else if (isExplore.test(params.url)) {
				dispatch(exploreApi.actions.topics.get()).then(() => {
					resolve()
				}).catch(() => { resolve() })
			}
		} else {
			resolve()
		}
	})
}
