import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import cookie from 'react-cookie'
import ActionCreators from '../../../features/SelectLanguage/actions/creators'
import LocaleList from '../../../../locales/config/localeList.json'
import Card from '../../../components/Card'

const fourLetterLocales = [ 'en-GB', 'es-ES', 'pt-PT', 'zh-CN', 'zh-HK', 'zh-TW', 'my-MM' ]

function getAPILocale(localeObject) {
	const { locale, locale2 } = localeObject
	if (fourLetterLocales.indexOf(locale) > -1) {
		return locale
	} else {
		return locale2
	}
}

function isValidLocale(locale) {
	for (let x = 0; x < LocaleList.length; x++) {
		if (LocaleList[x].locale2 === locale || LocaleList[x].locale === locale) {
			return true
		}
	}
	return false
}

function getLocalePath(locale, redirectToRoot) {
	const pathParts = window.location.pathname.split('/')
	if (redirectToRoot) {
		return `/${locale}/`
	}

	if (pathParts.length > 1 && isValidLocale(pathParts[1])) {
		pathParts[1] = locale
	} else {
		pathParts.splice(1, 0, locale)
	}
	return pathParts.join('/')
}

class LangSelector extends Component {

	constructor(props) {
		super(props)
		this.localeIndex = []
		this.preferredLocales = null
		this.availableLocales = null
		this.state = { ready: false }
	}

	componentDidMount() {
		const { auth } = this.props
		const { ready } = this.state
		if (!ready && this.preferredLocales === null && typeof window !== 'undefined') {
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

			this.preferredLocales = _preferredLocales.map((l) => {
				const match2Letter = []
				for (const al of LocaleList) {
					const fullDisplayName = al.nativeName && al.englishName && al.nativeName !== al.englishName ? (<span>{al.displayName} <small>{al.englishName}</small></span>) : al.displayName
					if (this.localeIndex.indexOf(al.locale) === -1) {
						if (al.locale === l.locale) {
							this.localeIndex.push(al.locale)
							return (<li className='preferred' key={al.locale}><a tabIndex={0} onClick={this.handleLanguageChange(al)}>{fullDisplayName}</a></li>)
						} else if (al.locale2 === l.locale) {
							this.localeIndex.push(al.locale)
							match2Letter.push(<li className='preferred' key={al.locale}><a tabIndex={0} onClick={this.handleLanguageChange(al)}>{fullDisplayName}</a></li>)
						}
					}
				}
				return match2Letter
			})

			this.setState({ ready: true })
		}
	}

	handleLanguageChange = (locale) => {
		return () => {
			const apiLocale = getAPILocale(locale)

			const {
				dispatch,
				auth,
				redirectToRoot
			} = this.props

			if (typeof auth !== 'undefined' && typeof auth.userData !== 'undefined' && typeof auth.userData.userid !== 'undefined') {
				dispatch(ActionCreators.changeLanguage({
					user_id: auth.userData.userid,
					language_tag: locale.locale2,
					locale: apiLocale,
					redirect: false
				})).then(() => {
					window.location.pathname = getLocalePath(apiLocale, redirectToRoot)
				})
			} else {
				window.location.pathname = getLocalePath(apiLocale, redirectToRoot)
			}
		}
	}

	render() {
		if (this.availableLocales === null) {
			this.availableLocales = LocaleList.map((l) => {
				if (this.localeIndex.indexOf(l.locale) === -1) {
					const fullDisplayName = l.nativeName && l.englishName && l.nativeName !== l.englishName ? (<span>{l.displayName} <small>{l.englishName}</small></span>) : l.displayName
					return (<li key={l.locale}><a tabIndex={0} onClick={this.handleLanguageChange(l)}>{fullDisplayName}</a></li>)
				}
				return null
			})
		}

		return (
			<div className="yv-lang-selector">
				<div className="row">
					<div className="medium-8 large-6 medium-centered column">
						<h2 className="title"><FormattedMessage id="containers.SelectLanguage.choose" /></h2>
						<Card>
							<ul className='side-nav language-selector'>
								{this.preferredLocales}
								<hr />
								{this.availableLocales}
							</ul>
						</Card>
					</div>
				</div>
			</div>
		)
	}
}

LangSelector.propTypes = {
	dispatch: PropTypes.func.isRequired,
	auth: PropTypes.object,
	redirectToRoot: PropTypes.bool
}

LangSelector.defaultProps = {
	auth: {},
	redirectToRoot: false
}

export default LangSelector
