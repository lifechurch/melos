import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { push } from 'react-router-redux'

import ActionCreators from '../actions/creators'

class PlanSettings extends Component {
	constructor(props) {
		super(props)
		this.handleCatchUp = this.handleCatchUp.bind(this)
		this.handleEmailDeliveryChange = this.handleEmailDeliveryChange.bind(this)
		this.handlePrivacyChange = this.handlePrivacyChange.bind(this)
		this.handleStop = this.handleStop.bind(this)
		this.handleSelectPlan = this.handleSelectPlan.bind(this)
		this.handleReloadCalendar = this.handleReloadCalendar.bind(this)
	}

	handleSelectPlan() {
		const { dispatch, id } = this.props
		dispatch(ActionCreators.planSelect({ id }))
	}

	handleReloadCalendar() {
		const { dispatch, id, params, serverLanguageTag, auth: { userData: { userid } } } = this.props
		const language_tag = serverLanguageTag || params.lang || 'en'
		return dispatch(ActionCreators.calendar({ id, language_tag, user_id: userid })).then(() => {
			this.handleSelectPlan()
		})
	}

	handlePrivacyChange() {
		const { dispatch, id, isPrivate } = this.props
		dispatch(ActionCreators.updateSubscribeUser({ id, private: !isPrivate }, true)).then(() => {
			this.handleSelectPlan()
		})
	}

	handleEmailDeliveryChange() {
		const { dispatch, id, isEmailDeliveryOn } = this.props
		const email_delivery = isEmailDeliveryOn ? false : '08:00:00'
		const email_delivery_version_id = isEmailDeliveryOn ? null : 1
		dispatch(ActionCreators.updateSubscribeUser({ id, email_delivery, email_delivery_version_id }, true)).then(() => {
			this.handleSelectPlan()
		})
	}

	handleCatchUp() {
		const { dispatch, id, subscriptionLink } = this.props
		dispatch(ActionCreators.resetSubscription({ id }, true)).then(() => {
			this.handleReloadCalendar().then(() => {
				dispatch(push(subscriptionLink))
			})
		})
	}

	handleStop() {
		const { dispatch, id, myPlansLink, auth: { userData: { userid } } } = this.props
		dispatch(ActionCreators.unsubscribeUser({ id }, true)).then(() => {
			dispatch(ActionCreators.items({ user_id: userid, page: 1 }, true)).then(() => {
				dispatch(push(myPlansLink))
			})
		})
	}

	render() {
		const { isPrivate, isEmailDeliveryOn, emailDelivery } = this.props

		const rowStyle = {
			paddingTop: 20,
			paddingBottom: 20,
			borderTop: '1px solid #ddd'
		}

		const rightCellStyle = {
			textAlign: 'right'
		}

		return (
			<div className="row" style={{ marginTop: 30 }}>
				<div className="columns large-8 large-centered">
					<div className="row" style={rowStyle}>
						<div className="columns medium-8">
							<h3><FormattedMessage id="plans.privacy title" /></h3>
							<p>
								{isPrivate
                ? <FormattedMessage id="plans.privacy description.private" />
                : <FormattedMessage id="plans.privacy description.public" />
              }
							</p>
						</div>
						<div className="columns medium-4" style={rightCellStyle}>
							<button className="solid-button green" onClick={this.handlePrivacyChange}>
								{isPrivate
                ? <FormattedMessage id="plans.make public" />
                : <FormattedMessage id="plans.make private" />
              }
							</button>
						</div>
					</div>
					<div className="row" style={rowStyle}>
						<div className="columns medium-8">
							<h3><FormattedMessage id="plans.email delivery" /></h3>
							<p>
								<FormattedMessage id="plans.email delivery text" />
							</p>
						</div>
						<div className="columns medium-4" style={rightCellStyle}>
							<button className="solid-button green" onClick={this.handleEmailDeliveryChange}>
								{isEmailDeliveryOn
                ? <FormattedMessage id="plans.email_off" />
                : <FormattedMessage id="plans.email_on" />
              }
							</button>
							<div>{emailDelivery}</div>
						</div>
					</div>
					<div className="row" style={rowStyle}>
						<div className="columns medium-8">
							<h3><FormattedMessage id="plans.are you behind" /></h3>
							<p>
								<FormattedMessage id="plans.catch up description only" />
							</p>
						</div>
						<div className="columns medium-4" style={rightCellStyle}>
							<button className="solid-button green" onClick={this.handleCatchUp}>
								<FormattedMessage id="plans.catch me up" />
							</button>
						</div>
					</div>
					<div className="row" style={rowStyle}>
						<div className="columns small-12">
							<a tabIndex={0} onClick={this.handleStop} className="warning-text">
								<FormattedMessage id="plans.stop reading" />
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

PlanSettings.propTypes = {
	id: PropTypes.number.isRequired,
	isPrivate: PropTypes.bool.isRequired,
	isEmailDeliveryOn: PropTypes.bool.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	emailDelivery: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
	myPlansLink: PropTypes.string.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired
}

PlanSettings.defaultProps = {
	emailDelivery: {}
}

export default PlanSettings
