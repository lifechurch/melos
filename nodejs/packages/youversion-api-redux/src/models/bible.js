import { createSelector } from 'reselect'
import Immutable from 'immutable'
import { getChapter, getVerses, getVersion, getVersions, getConfiguration } from '../endpoints/bible/reducer'

const getBibleModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getChapter, getVerses, getVersion, getVersions, getConfiguration ],
	(chapter, verses, version, versions, config) => {
		const bibleModel = {
			versions: { byId: {}, byLang: {} },
			references: {},
			languages: {},
		}

		if (chapter) {
			bibleModel.references = chapter
		}
		if (verses) {
			bibleModel.references = verses
		}
		if (version) {
			bibleModel.versions.byId = version
		}
		if (versions) {
			bibleModel.versions.byLang = versions.byLang
		}
		if (config) {
			if (config && config.response && config.response.default_versions) {
				const all = config
					&& config.response
					&& config.response.default_versions
				const map = {}
				if (all && all.length > 0) {
					all.forEach((v, i) => {
						map[v.language_tag] = i
					})
				}

				bibleModel.languages.all = all
				bibleModel.languages.map = map
			}
		}


		// utility functions on model
		bibleModel.pullRef = (usfm, id = null) => {
			const usfmKey = usfm && usfm.toUpperCase()

			if (!('references' in bibleModel && usfmKey in bibleModel.references)) {
				return null
			}

			const refsObj = bibleModel.references[usfmKey]

			return refsObj[id || Object.keys(refsObj)[0]]
		}

		bibleModel.pullVersion = (id) => {
			const data = bibleModel
				&& bibleModel.versions
				&& bibleModel.versions.byId
				&& bibleModel.versions.byId[`${id}`]
			return data && { ...data.response, loading: data.loading }
		}

		return bibleModel
	}
)

export default getBibleModel
