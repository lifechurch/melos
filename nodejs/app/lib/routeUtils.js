export function localizedLink(link, serverLanguageTag) {
	const languageTag = serverLanguageTag || 'en'

	if (['en', 'en-US', 'en_US', 'en-us', 'en_us'].indexOf(languageTag) > -1) {
		return link
	} else {
		return `/${languageTag}${link}`
	}
}
