import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import ActionCreators from '../features/SelectLanguage/actions/creators'
import EventHeader from '../components/EventHeader'
import LocaleList from '../../localeList.json'
import { FormattedMessage } from 'react-intl'

class SelectLanguage extends Component {

	handleLanguageChange() {

	}

	render() {
		const { auth } = this.props

		let preferredLocales = null
		let localeIndex = []
		if (typeof window !== 'undefined') {

			var _preferredLocales = window.__LOCALE__.preferredLocales.slice()

			if (typeof auth !== 'undefined' && typeof auth.userData !== 'undefined' && typeof auth.userData.language_tag !== 'undefined') {
				_preferredLocales.unshift({ locale: auth.userData.language_tag })
			}

			preferredLocales = _preferredLocales.map((l) => {
				var match2Letter = []
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
				return (<li key={l.locale}><a href={`/${l.locale}/`}>{fullDisplayName}</a></li>)
			}
		})

		return (
			<div>
				<EventHeader {...this.props} />
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
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(SelectLanguage)
