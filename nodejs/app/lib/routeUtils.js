export function localizedLink(link, serverLanguageTag) {
	const languageTag = serverLanguageTag || 'en'

	if (['en', 'en-US'].indexOf(languageTag) > -1) {
		return link
	} else {
		return `/${languageTag}${link}`
	}
}
