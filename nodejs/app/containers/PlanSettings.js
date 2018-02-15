import React from 'react'
import PropTypes from 'prop-types'
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


function PlanSettings(props) {
	const { subscription, participants } = props
	const isAuthHost = participants.isAuthHost(
		subscription
		&& subscription.together_id
	)

	const subSettings = subscription
		&& subscription.settings

	return (
		<PlanSettingsComponent
			{...props}
			isAuthHost={isAuthHost}
			subSettings={subSettings}
		/>
	)
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
	participants: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(PlanSettings))
