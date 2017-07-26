import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import cookie from 'react-cookie'
import ActionCreators from '../../../features/SelectLanguage/actions/creators'

let preferredLocales = null
const localeIndex = []

const handleLanguageChange = (locale) => {
	const { dispatch, auth } = this.props
	dispatch(ActionCreators.changeLanguage({ user_id: auth.userData.userid, language_tag: locale.locale2, locale: locale.locale }))
}

function LangSelector(props) {

	// only if window exists
	if (typeof window !== 'undefined') {
		const _preferredLocales = window.__LOCALE__.preferredLocales.slice()

		// Check locale cookie
		const cookieLocale = cookie.load('locale')
		if (typeof cookieLocale !== 'undefined') {
			_preferredLocales.unshift({ locale: cookieLocale })
		}

		// Check language_tag in User Profile
		if (typeof auth !== 'undefined' && typeof auth.userData !== 'undefined' && typeof auth.userData.language_tag !== 'undefined') {
			_preferredLocales.unshift({ locale: auth.userData.language_tag })
		}

		preferredLocales = _preferredLocales.map((l) => {
			const match2Letter = []
			for (const al of LocaleList) {
				const fullDisplayName = al.nativeName && al.englishName && al.nativeName !== al.englishName ? (<span>{al.displayName} <small>{al.englishName}</small></span>) : al.displayName
				if (localeIndex.indexOf(al.locale) === -1) {
					if (al.locale === l.locale) {
						localeIndex.push(al.locale)
						return (<li className='preferred' key={al.locale}><a onClick={::this.handleLanguageChange.bind(this, al)}>{fullDisplayName}</a></li>)
					} else if (al.locale2 === l.locale) {
						localeIndex.push(al.locale)
						match2Letter.push(<li className='preferred' key={al.locale}><a onClick={::this.handleLanguageChange.bind(this, al)}>{fullDisplayName}</a></li>)
					}
				}
			}
			return match2Letter
		})
	}

	const availableLocales = LocaleList.map((l) => {
		if (localeIndex.indexOf(l.locale) === -1) {
			const fullDisplayName = l.nativeName && l.englishName && l.nativeName !== l.englishName ? (<span>{l.displayName} <small>{l.englishName}</small></span>) : l.displayName
			return (<li key={l.locale}><a onClick={::this.handleLanguageChange.bind(this, l)}>{fullDisplayName}</a></li>)
		}
	})

	return (
		<div>
			<div className="row">
				<div className="medium-6 medium-centered column">
					<h1 className="title"><FormattedMessage id="containers.SelectLanguage.choose" /></h1>
					<ul className='side-nav language-selector'>
						{preferredLocales}
						<hr />
						{availableLocales}
					</ul>
				</div>
			</div>
		</div>
	)
}

LangSelector.propTypes = {

}

LangSelector.defaultProps = {

}

export default LangSelector
