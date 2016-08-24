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

	saveForLater(id) {
		if (this.props.readingPlan.saved) {
			this.props.dispatch(ActionCreators.readingplanRemoveSave({ id: id }, true))
		} else {
			this.props.dispatch(ActionCreators.readingplanSaveforlater({ id: id }, true))
		}
	}

	samplePlan(plan) {
		// redirect to sample plan
		window.location.replace(`/reading-plans/${plan.id}-${plan.slug}/day/1`)
	}

	subscribeUser(id, privacy) {
		this.props.dispatch(ActionCreators.readingplanSubscribeUser({ id: id , private: privacy })).then((plan) => {
			// redirect to start plan
			window.location.replace(`/users/${plan.username}/reading-plans/${plan.id}-${plan.slug}`)
		})
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
						<a className='yes solid-button green' onClick={this.subscribeUser.bind(this, readingPlan.id, false)}><FormattedMessage id="ui.yes button"/></a>
						<a className='no solid-button gray' onClick={this.subscribeUser.bind(this, readingPlan.id, true)}><FormattedMessage id="ui.no button" /></a>
					</div>
				</div>
			)
		} else {
			var dialogBox = null
		}

		if (this.props.readingPlan.saved) {
			var saveforlater = <a className='save-for-later' onClick={this.saveForLater.bind(this, readingPlan.id)}><FormattedMessage id="plans.save for later" />checkmark </a>
		} else {
			var saveforlater = <a className='save-for-later' onClick={this.saveForLater.bind(this, readingPlan.id)}><FormattedMessage id="plans.save for later" /> </a>
		}

		return (
			<div className='rp-subscription-info'>
				<div className='solid-button green padded' onClick={::this.handleClick}><FormattedMessage id="plans.read today" /></div>
				{ dialogBox }
				<div className='text-center'>
					{saveforlater}
					&bull;
					<a onClick={this.samplePlan.bind(this, readingPlan)}> <FormattedMessage id="plans.sample" /></a>
				</div>
			</div>
		)
	}
}

export default PlanActionButtons