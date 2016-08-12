import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'

class PlanActionButtons extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}

	saveForLater() {

	}

	render() {
		const { readingPlan } = this.props

		if (readingPlan.subscription_id) {
			var subscribe_link = 'gotoplan'
		} else {
			var subscribe_link = 'subscribetoplan'
		}

		if (this.state.dialogOpen) {
			var dialogBox = (
				<div className='plan-privacy-buttons text-center'>
					<p className='detail-text'><FormattedMessage id="plans.privacy.visible to friends?" /></p>
					<div className='yes-no-buttons'>
						<a className='yes solid-button green'><FormattedMessage id="ui.yes button" /></a>
						<a className='no solid-button gray'><FormattedMessage id="ui.no button" /></a>
					</div>
				</div>
			)
		} else {
			var dialogBox = null
		}

		return (
			<div className='rp-subscription-info'>
				<div className='solid-button green padded' onClick={::this.handleClick}><FormattedMessage id="plans.read today" /></div>
				{ dialogBox }
				<div className='text-center'>
					<a className='save-for-later' onClick={::this.saveForLater}><FormattedMessage id="plans.save for later" /> </a>
					&bull;
					<a> <FormattedMessage id="plans.sample" /></a>
				</div>
			</div>
		)
	}
}

export default PlanActionButtons