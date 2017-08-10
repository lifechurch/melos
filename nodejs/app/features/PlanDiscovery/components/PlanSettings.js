import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
import moment from 'moment'
import { routeActions } from 'react-router-redux'
import Toggle from 'react-toggle-button'
import TimePicker from 'rc-time-picker'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import ProgressBar from '../../../components/ProgressBar'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import { getBibleVersionFromStorage } from '../../../lib/readerUtils'
import Routes from '../../../lib/routes'



class PlanSettings extends Component {

	constructor(props) {
		super(props)
		const { subscription } = props
		this.state = {
			emailTime: subscription.email_delivery
				? moment()
						.hour(subscription.email_delivery.time.split(':')[0])
						.minute(subscription.email_delivery.time.split(':')[1])
				: moment()
						.hour(0)
						.minute(0),
		}
	}

	componentDidMount() {
		const { subSettings, subscription, dispatch } = this.props
		dispatch(plansAPI.actions.settings.get({
			id: this.subscription_id,
			kind: 'activity_notifications'
		}, { auth: true }))
	}

	handlePrivacyChange = (isPrivate) => {
		const { dispatch, subscription } = this.props
		dispatch(plansAPI.actions.subscription.put({
			id: subscription.id
		}, {
			auth: true,
			body: {
				privacy: isPrivate
					? 'private'
					: 'public'
			}
		}))
	}

	handleTogetherNotifications = (notificationsOn) => {
		const { subscription, dispatch } = this.props
		dispatch(plansAPI.actions.settings.put({
			id: this.subscription_id,
			kind: 'activity_notifications',
		}, {
			auth: true,
			body: {
				setting: Immutable
					.fromJS(subscription.settings.activity_notifications)
					.setIn(['email'], notificationsOn)
					.toJS()
			}
		}))
	}

	handleEmailDeliveryChange = (emailDeliveryOn) => {
		const { dispatch } = this.props
		const { emailTime } = this.state
		dispatch(plansAPI.actions.subscription.put({
			id: this.subscription_id,
		}, {
			body: {
				email_delivery: emailDeliveryOn
					? {
						time: `${emailTime.format('HH:mm')}+00:00`,
						version_id: getBibleVersionFromStorage(),
					}
					: null
			},
			auth: true
		}))
	}

	handleCatchUp = () => {
		const { onCatchUp } = this.props
		if (onCatchUp && typeof onCatchUp === 'function') {
			onCatchUp()
		}
	}

	handleStop = () => {
		const { dispatch, auth } = this.props
		if (this.together_id) {
			dispatch(plansAPI.actions.participant.delete({
				id: this.together_id,
				userid: auth && auth.userData && auth.userData.userid
			}, {
				auth: auth.isLoggedIn
			})).then(() => {
				dispatch({ type: 'DELETE_SUB_FROM_STATE', data: { id: this.subscription_id } })
				dispatch(routeActions.push(Routes.subscriptions({
					username: auth.userData.username
				})))
			})
		} else {
			dispatch(plansAPI.actions.subscription.delete({
				id: this.subscription_id
			}, {
				auth: auth.isLoggedIn
			})).then(() => {
				dispatch(routeActions.push(Routes.subscriptions({
					username: auth.userData.username
				})))
			})
		}
	}


	render() {
		const {
			dayOfString,
			startString,
			endString,
			subscription,
		} = this.props
		const {
			emailTime,
		} = this.state

		this.together_id = subscription && subscription.together_id
			? subscription.together_id
			: null
		this.subscription_id = subscription && subscription.id
			? subscription.id
			: null

		const rowStyle = {
			paddingTop: 20,
			paddingBottom: 20,
			borderTop: '1px solid #ddd',
			display: 'flex',
			alignItems: 'center',
		}
		const switchColors = {
			active: {
				base: '#6ab750',
			},
			inactive: {
				base: '#D4D4D4',
			}
		}
		const trackStyle = {
			height: 27,
			width: 55,
		}
		const thumbStyle = {
			width: 27,
			height: 27,
		}
		const thumbAnimateRange = [1, 25]

		let isPrivate = false
		let emailDeliveryOn = false
		let activityNotificationsOn = false
		let progressPercentage = 0
		let progressString = ''
		if (subscription) {
			isPrivate = subscription.privacy === 'private'
			emailDeliveryOn = !!(subscription.email_delivery)
			activityNotificationsOn = this.together_id
				&& subscription.settings
				&& subscription.settings.activity_notifications.email
			if (subscription.overall) {
				progressPercentage = subscription.overall.completion_percentage
				progressString = subscription.overall.progress_string
			}
		}

		return (
			<div className='row large-6 medium-8 small-11' style={{ marginTop: 30 }}>
				<div style={{ padding: '20px 0 35px 0' }}>
					<div style={{ marginBottom: '10px' }}>
						{ dayOfString }
						{` (${progressPercentage}%)`}
						&nbsp;&bull;&nbsp;
						{ progressString }
					</div>
					<ProgressBar
						percentComplete={progressPercentage}
						height='6px'
						color='#6ab750'
						borderColor='white'
						backgroundColor='#F4F4F4'
					/>
					<div className='space-between' style={{ marginTop: '5px' }}>
						<p>{ startString }</p>
						<p>{ endString }</p>
					</div>
				</div>
				{
					this.together_id &&
					<div style={rowStyle}>
						<div style={{ flex: 1, paddingRight: '40px' }}>
							<h3><FormattedMessage id='notifications.together title' /></h3>
							<ParticipantsAvatarList
								together_id={this.together_id}
							/>
							<p style={{ marginTop: '0.5rem' }}>
								<FormattedMessage id='notifications.together description' />
							</p>
						</div>
						<div>
							<Toggle
								value={activityNotificationsOn}
								onToggle={(val) => {
									this.handleTogetherNotifications(!val)
								}}
								activeLabel=''
								inactiveLabel=''
								colors={switchColors}
								trackStyle={trackStyle}
								thumbStyle={thumbStyle}
								thumbAnimateRange={thumbAnimateRange}
							/>
						</div>
					</div>
				}
				{
					// privacy can't be changed with a pwf
					!this.together_id &&
					<div style={rowStyle}>
						<div style={{ flex: 1, paddingRight: '40px' }}>
							<h3><FormattedMessage id='plans.privacy title' /></h3>
							<p>
								{
									isPrivate
										? <FormattedMessage id='plans.privacy description.private' />
										: <FormattedMessage id='plans.privacy description.public' />
								}
							</p>
						</div>
						<div>
							<Toggle
								value={isPrivate}
								onToggle={(val) => {
									this.handlePrivacyChange(!val)
								}}
								activeLabel=''
								inactiveLabel=''
								colors={switchColors}
								trackStyle={trackStyle}
								thumbStyle={thumbStyle}
								thumbAnimateRange={thumbAnimateRange}
							/>
						</div>
					</div>
				}
				<div style={rowStyle}>
					<div style={{ flex: 1, paddingRight: '40px' }}>
						<h3><FormattedMessage id='plans.email delivery' /></h3>
						<p>
							<FormattedMessage id='plans.email delivery text' />
						</p>
					</div>
					<div>
						<Toggle
							value={emailDeliveryOn}
							onToggle={(val) => {
								this.handleEmailDeliveryChange(!val)
							}}
							activeLabel=''
							inactiveLabel=''
							colors={switchColors}
							trackStyle={trackStyle}
							thumbStyle={thumbStyle}
							thumbAnimateRange={thumbAnimateRange}
						/>
					</div>
					{
						emailDeliveryOn &&
						<div className='vertical-center' style={{ marginTop: '20px', paddingLeft: '40px' }}>
							<TimePicker
								showSecond={false}
								defaultValue={emailTime}
								onChange={(value) => {
									this.setState({ emailTime: value })
									this.handleEmailDeliveryChange(true)
								}}
								use12Hours={true}
							/>
						</div>
					}
				</div>
				{
					// can't catch up on a pwf
					!this.together_id &&
					<div style={rowStyle}>
						<div style={{ flex: 1, paddingRight: '40px' }}>
							<h3><FormattedMessage id='plans.are you behind' /></h3>
							<p>
								<FormattedMessage id='plans.catch up description only' />
							</p>
						</div>
						<button className='solid-button green' onClick={this.handleCatchUp}>
							<FormattedMessage id='plans.catch me up' />
						</button>
					</div>
				}
				<div style={rowStyle}>
					<div style={{ flex: 1, paddingRight: '40px' }}>
						<a tabIndex={0} onClick={this.handleStop} className='warning-text'>
							<FormattedMessage id='plans.stop reading' />
						</a>
					</div>
				</div>
			</div>
		)
	}
}

PlanSettings.propTypes = {
	subscription: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	onCatchUp: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

PlanSettings.defaultProps = {

}

export default PlanSettings
