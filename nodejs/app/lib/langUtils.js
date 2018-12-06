import planLocales from '../../locales/config/planLocales.json'

const availableLocales = require('../../locales/config/availableLocales.json')
const localeList = require('../../locales/config/localeList.json')

/**
 * Parses the accept-language HTTP header and
 * returns an array of Objects with the following
 * keys:
 *  - locale: this is the full locale, ISO 639-1
 *  - prefix: this is the language portion of a locale, ISO 639-2
 *  - weight: some browsers associate a weight value to a locale between 0 and 1
 * @param {Object} req - the Express request object
 * @return
 */
export function getLocalesFromHeader(acceptLangHeader) {
	if (acceptLangHeader) {
		return acceptLangHeader.split(',').map((l) => {
			const locale = l.split(';');
			const weight = (locale.length > 1) ? parseFloat(locale[1].split('=')[1]) : 1;
			const prefix = locale[0].split('-')[0];
			return { locale: locale[0], prefix, weight };
		});
	}
	return []
}


export function getCurrentUserLocale({ localeFromUrl, localeFromCookie, localeFromUser, localesFromHeader }) {
	let final = { locale: availableLocales['en-US'], source: 'default' }
  let languageWithoutCountry = localeFromUrl.split(/[\-_]+/)[0]

	// 1: Try URL First
	if (typeof availableLocales[localeFromUrl] !== 'undefined') {
		final = { locale: availableLocales[localeFromUrl], source: 'url' };

  // 1.1: Try URL without Country Code
  } else if (typeof availableLocales[languageWithoutCountry] !== 'undefined') {
    final = { locale: availableLocales[languageWithoutCountry], source: 'url' };

	// 2: Try Cookie Second
	} else if (typeof localeFromCookie !== 'undefined' && typeof availableLocales[localeFromCookie] !== 'undefined') {
		final = { locale: availableLocales[localeFromCookie], source: 'cookie' };

	// 3: Try User Profile Info (from token of last login)
	} else if (typeof localeFromUser !== 'undefined' && localeFromUser !== null && typeof availableLocales[localeFromUser] !== 'undefined') {
		final = { locale: availableLocales[localeFromUser], source: 'profile' };

	// 3: Try accept-language Header Third
	} else {
		let lastWeight = 0;
		let bestLocale;

		localesFromHeader.forEach((l) => {
			if (l.weight > lastWeight) {
				if (typeof availableLocales[l.locale] !== 'undefined') {
					bestLocale = availableLocales[l.locale];
					lastWeight = l.weight;
				} else if (typeof availableLocales[l.prefix] !== 'undefined') {
					bestLocale = availableLocales[l.prefix];
					lastWeight = l.weight;
				}
			}
		});

		if (typeof bestLocale !== 'undefined' && bestLocale !== null) {
			final = { locale: bestLocale, source: 'accept-language' }
		}
	}

	return final
}

/**
 * Gets the Locale of the User by checking the
 * following places in order:
 *
 *  1) URL: assuming an explicit URL should take first priority
 *  2) Cookie: a cookie is only written when a user explicitly switches to a language/locale
 *  3) Profile: the user's profile is only update when a user explicitly switches to a language/locale
 *  4) Browser: also known as the accept-language header, this is the final fallback to a configuration setting in the browser
 *
 * @param {Object} req - the Express request object
 * @param {string} localeFromUser - the ISO 639-1 language code from the User's profile
 * @return
 */
export function getLocale({ localeFromUrl, localeFromCookie, localeFromUser, acceptLangHeader }) {
	const localesFromHeader = getLocalesFromHeader(acceptLangHeader)
	const final = getCurrentUserLocale({ localeFromUrl, localeFromCookie, localeFromUser, localesFromHeader })

	// Loop Through Locale List and Get More Info
	localeList.forEach((lc) => {
		if (lc.locale === final.locale) {
			final.locale2 = lc.locale2
			final.locale3 = lc.locale3
			final.momentLocale = lc.momentLocale
			final.nativeName = lc.nativeName
			final.planLocale = planLocales[lc.locale]
		}
	})

	// Get the appropriate react-intl locale data for this locale
	final.data = require(`react-intl/locale-data/${final.locale2}`);

	// Get the appropriate set of localized strings for this locale
	final.messages = require(`../../locales/${final.locale}.json`);

	// Add the list of preferred locales based on browser configuration to this response
	final.preferredLocales = localesFromHeader;

	return final;
}
