import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import rtlDetect from 'rtl-detect'

class PlansView extends Component {
	localizedLink(link) {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl() {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		const { children, auth } = this.props

		const myPlansLink = auth.isLoggedIn && auth.userData && auth.userData.username ?
			(<a className='solid-button green' href={`/users/${auth.userData.username}/reading-plans`}><FormattedMessage id="plans.my_plans" /></a>) :
			(<a className='solid-button green' href='/sign-in'><FormattedMessage id="plans.my_plans" /></a>)

		return (
			<div>
				<div className='row horizontal-center discover-buttons'>
					<ul className='button-group primary-toggle'>
						<li><Link to='/reading-plans' className='solid-button green'><FormattedMessage id="plans.discover" /></Link></li>
						<li className='inactive'>{ myPlansLink }</li>
					</ul>
				</div>
				{children && React.cloneElement(children, { localizedLink: ::this.localizedLink, isRtl: ::this.isRtl })}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(PlansView)
