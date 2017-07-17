import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// components
import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'
import Modal from '../components/Modal'
// utils
import Routes from '../lib/routes'

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

	handleStopPlan = () => {
		const { dispatch, auth, subscription_id } = this.props
		dispatch(plansAPI.actions.subscription.delete({
			id: subscription_id
		}, {
			auth: auth.isLoggedIn
		})).then((data) => {
			if (
				data.data &&
				data.data.status &&
				data.data.status === 403
			) {
				this.setState({ showError: true })
			} else {
				dispatch(routeActions.push(Routes.subscriptions({
					username: auth.userData.username
				})))
			}
		})
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

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
