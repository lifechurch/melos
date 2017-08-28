import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
import { push } from 'react-router-redux'
import Toggle from 'react-toggle-button'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import ProgressBar from '../../../components/ProgressBar'
import ShareLink from '../../../components/ShareLink'
import PlanStartString from './PlanStartString'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import Routes from '../../../lib/routes'
import calcTodayVsStartDt from '../../../lib/calcTodayVsStartDt'
import getCurrentDT from '../../../lib/getCurrentDT'


class PlanSettings extends Component {

	componentDidMount() {
		const { dispatch } = this.props
		dispatch(plansAPI.actions.settings.get({
			id: this.subscription_id,
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

	handleTogetherNotifications = (notificationsOn, kind) => {
		const { subscription, dispatch } = this.props
		dispatch(plansAPI.actions.setting.put({
			id: this.subscription_id,
			kind,
		}, {
			auth: true,
			body: {
				setting: Immutable
					.fromJS(subscription.settings[kind])
					.setIn(['email'], notificationsOn)
					.toJS(),
				updated_dt: getCurrentDT(),
			}
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
				dispatch(push(Routes.subscriptions({
					username: auth.userData.username
				})))
			})
		} else {
			dispatch(plansAPI.actions.subscription.delete({
				id: this.subscription_id
			}, {
				auth: auth.isLoggedIn
			})).then(() => {
				dispatch(push(Routes.subscriptions({
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
			isAuthHost,
			auth,
			intl,
		} = this.props

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
		let commentNotificationsOn = false
		let acceptNotificationsOn = false
		let startsInFuture = false
		let progressPercentage = 0
		let progressString = ''
		if (subscription) {
			startsInFuture = calcTodayVsStartDt(subscription.start_dt).isInFuture
			isPrivate = subscription.privacy === 'private'
			commentNotificationsOn = this.together_id
				&& subscription.settings
				&& subscription.settings.comment_notifications
				&& subscription.settings.comment_notifications.email
			acceptNotificationsOn = this.together_id
				&& subscription.settings
				&& subscription.settings.accept_notifications
				&& subscription.settings.accept_notifications.email
			if (subscription.overall) {
				progressPercentage = subscription.overall.completion_percentage
				progressString = subscription.overall.progress_string
			}
		}

		return (
			<div className='row large-6 medium-8 small-11 plan-settings' style={{ marginTop: 30 }}>
				<div style={{ padding: '25px 0 20px 0' }}>
					{
						startsInFuture
							?	(
								<div className='vertical-center button-actions'>
									<h4>
										<PlanStartString start_dt={subscription && subscription.start_dt} />
									</h4>
									{
										isAuthHost
											&& (
												<Link
													to={Routes.togetherCreate({
														username: auth && auth.userData && auth.userData.username,
														plan_id: subscription && subscription.plan_id,
														query: {
															subscription_id: this.subscription_id,
														}
													})}
													className='yv-gray-link margin-left-auto'
												>
													<FormattedMessage id='change date' />
												</Link>
											)
									}
								</div>
							)
							: (
								<div>
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
							)
					}
				</div>
				{
					this.together_id &&
					<div className='text-center flex-wrap horizontal-center' style={rowStyle}>
						<div style={{ marginBottom: '15px', width: '100%' }}>
							<FormattedMessage id='participants' />
						</div>
						<ParticipantsAvatarList
							together_id={this.together_id}
							statusFilter={['host', 'accepted']}
						/>
					</div>
				}
				{
					this.together_id
						&& isAuthHost
						&& (
							<div className='text-center flex-wrap horizontal-center'>
								<ShareLink together_id={this.together_id} />
							</div>
						)
				}
				{
					this.together_id &&
					<div style={{ marginTop: '50px', padding: '10px 0' }}>
						<h3><FormattedMessage id='notifications' /></h3>
					</div>
				}
				{
					this.together_id &&
					isAuthHost &&
					<div style={rowStyle}>
						<div style={{ flex: 1, paddingRight: '40px' }}>
							<h3><FormattedMessage id='when participant accepts' /></h3>
						</div>
						<div>
							<Toggle
								value={acceptNotificationsOn}
								onToggle={(val) => {
									this.handleTogetherNotifications(!val, 'accept_notifications')
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
					this.together_id &&
					<div style={rowStyle}>
						<div style={{ flex: 1, paddingRight: '40px' }}>
							<h3><FormattedMessage id='when participant comments' /></h3>
						</div>
						<div>
							<Toggle
								value={commentNotificationsOn}
								onToggle={(val) => {
									this.handleTogetherNotifications(!val, 'comment_notifications')
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
	isAuthHost: PropTypes.bool.isRequired,
	shareLink: PropTypes.node,
	dayOfString: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	startString: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	endString: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	intl: PropTypes.object.isRequired,
}

PlanSettings.defaultProps = {
	shareLink: null,
	dayOfString: null,
	startString: null,
	endString: null,
}

export default PlanSettings
