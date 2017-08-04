import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import { getSettings } from '@youversion/api-redux/lib/endpoints/plans'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
// components
import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'
// utils


class PlanSettings extends Component {

	render() {
		return (
			<PlanSettingsComponent
				{...this.props}
				onStopPlan={this.handleStopPlan}
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
		serverLanguageTag: state.serverLanguageTag,
		subSettings: getSettings(state),
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
