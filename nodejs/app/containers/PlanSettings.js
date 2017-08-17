import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
// actions
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
// components
import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'
// utils


class PlanSettings extends Component {

	render() {
		const { subscription, participants, togethers } = this.props
		const isAuthHost = participants.isAuthHost(
			subscription
			&& subscription.together_id
		)
		const shareLink = togethers
			&& togethers.byId
			&& subscription
			&& subscription.together_id
			&& togethers.byId[subscription.together_id]
			&& togethers.byId[subscription.together_id].public_share
		const subSettings = subscription
			&& subscription.settings

		return (
			<PlanSettingsComponent
				{...this.props}
				onStopPlan={this.handleStopPlan}
				isAuthHost={isAuthHost}
				shareLink={shareLink}
				subSettings={subSettings}
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
		togethers: getTogetherModel(state),
		participants: getParticipantsUsers(state),
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth
	}
}

PlanSettings.propTypes = {
	subscription: PropTypes.object.isRequired,
	togethers: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(PlanSettings))
