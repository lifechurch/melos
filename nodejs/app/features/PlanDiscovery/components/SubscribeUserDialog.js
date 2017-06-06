import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

import ActionCreators from '../actions/creators'

class SubscribeUserDialog extends Component {
	constructor(props) {
		super(props)
		this.handleSubscribeUser = this.handleSubscribeUser.bind(this)
	}

	handleSubscribeUser(privacy) {
		const { dispatch, id, isLoggedIn, isSubscribed, subscriptionLink, useRouter } = this.props
		if (!isLoggedIn) window.location.replace('/sign-in')
		if (!isSubscribed) {
			dispatch(ActionCreators.readingplanSubscribeUser({ id, private: privacy }, isLoggedIn)).then(() => {
				if (useRouter) {
					dispatch(routeActions.push(subscriptionLink))
				} else {
					window.location.replace(subscriptionLink)
				}
			})
		} else if (useRouter) {
			dispatch(routeActions.push(subscriptionLink))
		} else {
			window.location.replace(subscriptionLink)
		}
	}

	render() {
		return (
			<div className='plan-privacy-buttons text-center'>
				<p className='detail-text'>
					<FormattedMessage id="plans.privacy.visible to friends?" />
				</p>
				<div className='yes-no-buttons'>
					<a
						tabIndex={0}
						className='yes solid-button green'
						onClick={() => { this.handleSubscribeUser(false) }}
					>
						<FormattedMessage id="ui.yes button" />
					</a>
					<a
						tabIndex={0}
						className='no solid-button gray'
						onClick={() => { this.handleSubscribeUser(true) }}
					>
						<FormattedMessage id="ui.no button" />
					</a>
				</div>
			</div>
		)
	}
}

SubscribeUserDialog.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	dispatch: PropTypes.func.isRequired,
	isSubscribed: PropTypes.bool.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	useRouter: PropTypes.bool
}

SubscribeUserDialog.defaultProps = {
	useRouter: true,
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	}
}

export default connect(mapStateToProps)(SubscribeUserDialog)
