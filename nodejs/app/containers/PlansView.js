import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import rtlDetect from 'rtl-detect'

class PlansView extends Component {
	localizedLink(link) {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

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
		const { children, auth, route: { isMyPlans } } = this.props

		const myPlansLink = auth.isLoggedIn && auth.userData && auth.userData.username ?
			(<Link className='solid-button green' to={`/users/${auth.userData.username}/reading-plans`}><FormattedMessage id="plans.my_plans" /></Link>) :
			(<a className='solid-button green' href='/sign-in'><FormattedMessage id="plans.my_plans" /></a>)

		return (
			<div>
				<div className='row horizontal-center discover-buttons'>
					<ul className='button-group primary-toggle'>
						<li className={isMyPlans ? '' : 'inactive' }>{ myPlansLink }</li>
						<li className={isMyPlans ? 'inactive' : ''}><Link to='/reading-plans' className='solid-button green'><FormattedMessage id="plans.discover" /></Link></li>
					</ul>
				</div>
				{children && React.cloneElement(children, { localizedLink: ::this.localizedLink, isRtl: ::this.isRtl })}
			</div>
		)
	}
}

PlansView.propTypes = {
	params: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(PlansView)
