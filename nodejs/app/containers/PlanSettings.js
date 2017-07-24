import React, { Component } from 'react'
import { connect } from 'react-redux'
// actions
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
// components
import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'
import Modal from '../components/Modal'
// utils

class PlanSettings extends Component {
	constructor() {
		super()
		this.state = {
			showError: false
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { showError } = this.state
		if (showError !== prevState.showError) {
			if (this.modal) {
				if (showError) {
					this.modal.handleOpen()
				} else {
					this.modal.handleClose()
				}
			}
		}
	}

	render() {
		return (
			<div>
				<PlanSettingsComponent
					{...this.props}
					onStopPlan={this.handleStopPlan}
				/>
				<Modal ref={(ref) => { this.modal = ref }}>
					<div>Nuh uh gurl. You know whatchu tryin 2do</div>
				</Modal>
			</div>
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
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
