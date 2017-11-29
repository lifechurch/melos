import BibleActionCreators from '../features/Bible/actions/creators'

/**
 * get default version for a language
 * the store is used to check current state and dipatch the bible config action
 * if the language list isn't already in state
 */
export function getDefaultVersion(store, locale) {
	const currentState = store.getState()
	const language_tag = locale ? locale.toString() : 'eng'
	let defaultVersion = 1
	if (currentState.bibleReader.languages.map && currentState.bibleReader.languages.map[language_tag]) {
		defaultVersion = currentState.bibleReader.languages.all[currentState.bibleReader.languages.map[language_tag]].id
	} else {
		store.dispatch(BibleActionCreators.bibleConfiguration()).then((d) => {
			const langs = store.getState().bibleReader.languages
			if (language_tag in langs.map) {
				defaultVersion = langs.all[langs.map[language_tag]].id
			}
		})
	}
	return defaultVersion
}
