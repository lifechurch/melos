import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import rtlDetect from 'rtl-detect'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'

class PlansView extends Component {
	componentDidMount() {
		const { dispatch, subscriptions, auth } = this.props
		const prefetch = auth.isLoggedIn
			&& !(subscriptions && subscriptions.allIds.length > 0)
		// if the user is logged in and on the plans tab, let's prefetch the id list
		// for subscriptions if the user has any
		if (prefetch) {
			dispatch(plansAPI.actions.subscriptions.get({
				order: 'desc',
				page: 1
			}, { auth: true }))
		}
	}
	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		const { children, auth, serverLanguageTag, route: { isMyPlans } } = this.props

		const myPlansLink = auth.isLoggedIn && auth.userData && auth.userData.username ?
			(<Link className='solid-button green' to={`/users/${auth.userData.username}/reading-plans`}><FormattedMessage id="plans.my_plans" /></Link>) :
			(<a className='solid-button green' href='/sign-in'><FormattedMessage id="plans.my_plans" /></a>)

		return (
			<div style={{ paddingBottom: '100px' }}>
				<div className='row horizontal-center discover-buttons'>
					<ul className='button-group primary-toggle'>
						<li className={isMyPlans ? '' : 'inactive' }>{ myPlansLink }</li>
						<li className={isMyPlans ? 'inactive' : ''}><Link to='/reading-plans' className='solid-button green'><FormattedMessage id="plans.discover" /></Link></li>
					</ul>
				</div>
				{
					children
						&& (children.length > 0 || !Array.isArray(children))
						&& React.cloneElement(children, {
							localizedLink: this.localizedLink,
							isRtl: this.isRtl,
							auth,
							serverLanguageTag,
						})
				}
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
		subscriptions: getSubscriptionsModel(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(PlansView)
