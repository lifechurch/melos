import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import { chapterifyUsfm, getBibleVersionFromStorage } from '../../lib/readerUtils'

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
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && params.url && params.languageTag) {
			const { dispatch } = store
			const serverLanguageTag = params.languageTag
			const version_id = getBibleVersionFromStorage(serverLanguageTag)
			const isVOTD = new RegExp('^\/verse-of-the-day')
			if (isVOTD.test(params.url)) {
				console.log('LOAD', params)
				dispatch(momentsAction({
					method: 'votd',
					params: {
						language_tag: serverLanguageTag,
					}
				})).then((data) => {
					const usfm = data && data.votd && data.votd[2] && data.votd[2].usfm
					const promises = [
						dispatch(bibleAction({
							method: 'chapter',
							params: {
								id: version_id,
								reference: chapterifyUsfm(usfm),
							}
						})),
						dispatch(bibleAction({
							method: 'version',
							params: {
								id: version_id,
							}
						})).then((version) => {
							dispatch(imagesAction({
								method: 'items',
								params: {
									language_tag: version.language.iso_639_1,
									category: 'prerendered',
									usfm,
								}
							}))
						}),
						dispatch(readingPlansAction({
							method: 'configuration'
						})),
						dispatch(readingPlansAction({
							method: 'plans_by_reference',
							params: {
								usfm: usfm.join('+'),
								language_tag: serverLanguageTag,
							}
						}))
					]
					Promise.all(promises).then(() => { resolve() })
				})
				.catch((err) => {
					console.log('ERR', err)
					resolve(err)
				})
			}
		} else {
			resolve()
		}
	})
}
