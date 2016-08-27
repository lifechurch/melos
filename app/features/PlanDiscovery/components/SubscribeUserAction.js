import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'

class SubscribeUserAction extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}

	subscribeUser(privacy, subscribed) {
		const { dispatch, auth, readingPlan } = this.props
		// if user isn't subscribed, then subscribe!
		if (!subscribed) {
			console.log("subscribing", readingPlan.id, privacy, auth.isLoggedIn)
			dispatch(ActionCreators.readingplanSubscribeUser({ id: readingPlan.id , private: privacy }, auth.isLoggedIn)).then((data) => {console.log('done')})
		}
		console.log(auth)
		// redirect to plan
		window.location.replace(`/users/${auth.userData.username}/reading-plans/${readingPlan.id}-${readingPlan.slug}`)
	}


	render() {
		const { readingPlan, auth } = this.props

		// subscribe user or go to plan day if already subscribed
		if (readingPlan.subscription_id) {
			var button = (
				<div className='solid-button green padded' onClick={this.subscribeUser.bind(this, false, true)}>
					<FormattedMessage id="plans.read today" />
				</div>
			)
		} else {
			var button = (
				<div className='solid-button green padded' onClick={::this.handleClick}>
					<FormattedMessage id="plans.start"/>
				</div>
			)
		}

		// toggle subscribe box
		if (this.state.dialogOpen) {
			var dialogBox = (
				<div className='plan-privacy-buttons text-center'>
					<p className='detail-text'><FormattedMessage id="plans.privacy.visible to friends?" /></p>
					<div className='yes-no-buttons'>
						<a className='yes solid-button green' onClick={this.subscribeUser.bind(this, false, false)}><FormattedMessage id="ui.yes button"/></a>
						<a className='no solid-button gray' onClick={this.subscribeUser.bind(this, true, false)}><FormattedMessage id="ui.no button" /></a>
					</div>
				</div>
			)
		} else {
			var dialogBox = null
		}


		return (
			<div>
				{ button }
				{ dialogBox }
			</div>
		)
	}
}

export default SubscribeUserAction