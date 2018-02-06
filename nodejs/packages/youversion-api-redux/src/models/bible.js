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
			bibleModel.references = Immutable
				.fromJS(bibleModel.references)
				.merge(chapter)
				.toJS()
		}
		if (verses) {
			bibleModel.references = Immutable
				.fromJS(bibleModel.references)
				.merge(verses)
				.toJS()
		}
		if (version) {
			bibleModel.versions = Immutable
				.fromJS(bibleModel.versions)
				.mergeDeepIn(['byId'], version)
				.toJS()
		}
		if (versions) {
			bibleModel.versions = Immutable
				.fromJS(bibleModel.versions)
				.mergeDeepIn(['byLang'], versions.byLang)
				.toJS()
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
				bibleModel.languages = Immutable
					.fromJS(bibleModel.languages)
					.merge({ all, map })
					.toJS()
			}
		}


		// utility functions on model
		bibleModel.pullRef = (usfm, id = null) => {
			const usfmKey = usfm && usfm.toUpperCase()
			if (!Immutable.fromJS(bibleModel).hasIn(['references', usfmKey])) {
				return null
			}

			const refsObj = Immutable
				.fromJS(bibleModel.references)
				.get(usfmKey)
				.toJS()

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
