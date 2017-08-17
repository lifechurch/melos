import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import { getSettings } from '@youversion/api-redux/lib/endpoints/plans'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
// components
import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'
// utils


class PlanSettings extends Component {

	render() {
		const { subscription, participants, auth } = this.props
		const isAuthHost = participants.isAuthHost(
			subscription
			&& subscription.together_id
		)
		return (
			<PlanSettingsComponent
				{...this.props}
				onStopPlan={this.handleStopPlan}
				isAuthHost={isAuthHost}
			/>
		)
	}
}

function mapStateToProps(state, props) {
	const { subscription_id } = props
	return {
		subscription: getSubscriptionModel(state) &&
			subscription_id in getSubscriptionModel(state).byId
			? getSubscriptionModel(state).byId[subscription_id]
			: null,
		participants: getParticipantsUsers(state),
		subSettings: getSettings(state),
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
