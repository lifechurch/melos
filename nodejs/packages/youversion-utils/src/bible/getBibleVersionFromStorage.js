import cookie from 'react-cookie'
import LocaleVersions from '@youversion/stringer-things/dist/config/localeVersions.json'

export default function getBibleVersionFromStorage(language_tag = null) {
	let langVersion = null
	if (language_tag && language_tag in LocaleVersions) {
		langVersion = LocaleVersions[language_tag].text[0]
	}
	return cookie.load('version') || langVersion || 1
}
