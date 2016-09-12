import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'

class SubscribeUserDialog extends Component {

	subscribeUser(privacy) {
		const { dispatch, readingPlan, auth } = this.props
		if (!auth.isLoggedIn) window.location.replace(`/sign-in`)
		// if user isn't subscribed, then subscribe!
		if (!readingPlan.subscription_id) {
			dispatch(ActionCreators.readingplanSubscribeUser({ id: readingPlan.id , private: privacy }, auth.isLoggedIn)).then(() => {
				// redirect to plan
				this.goToPlan()
			})
		} else {
			// user already subscribed
			this.goToPlan()
		}
	}

	goToPlan() {
		const { readingPlan } = this.props
		// redirect to plan
		window.location.replace(`/users/${readingPlan.username}/reading-plans/${readingPlan.id}-${readingPlan.slug}`)
	}


	render() {

		return (
			<div className='plan-privacy-buttons text-center'>
				<p className='detail-text'><FormattedMessage id="plans.privacy.visible to friends?" /></p>
				<div className='yes-no-buttons'>
					<a className='yes solid-button green' onClick={this.subscribeUser.bind(this, false)}><FormattedMessage id="ui.yes button"/></a>
					<a className='no solid-button gray' onClick={this.subscribeUser.bind(this, true)}><FormattedMessage id="ui.no button" /></a>
				</div>
			</div>
		)
	}
}

export default SubscribeUserDialog