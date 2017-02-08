import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'
import SubscribeUserDialog from './SubscribeUserDialog'

class SubscribeUserAction extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}

	goToPlan() {
		const { readingPlan } = this.props
		// redirect to plan
		window.location.replace(`/users/${readingPlan.username}/reading-plans/${readingPlan.id}-${readingPlan.slug}`)
	}


	render() {
		const { readingPlan } = this.props

		// subscribe user or go to plan day if already subscribed
		if (readingPlan.subscription_id) {
			var button = (
				<div className='solid-button green padded' onClick={::this.goToPlan}>
					<FormattedMessage id="plans.read today" />
				</div>
			)
		} else {
			var button = (
				<div className='solid-button green padded' onClick={::this.handleClick}>
					<FormattedMessage id="plans.start" />
				</div>
			)
		}

		// toggle subscribe box
		if (this.state.dialogOpen) {
			var dialogBox = <SubscribeUserDialog {...this.props} />
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
