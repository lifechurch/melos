import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import Toggle from 'react-toggle-button'
import TimePicker from 'rc-time-picker'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import ProgressBar from '../../../components/ProgressBar'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import ActionCreators from '../actions/creators'
import { getBibleVersionFromStorage } from '../../../lib/readerUtils'


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
			emailDeliveryOn: !!(subscription.email_delivery)
		}
	}

	componentDidMount() {
		const { subSettings, subscription_id, subscription, dispatch } = this.props
		console.log(plansAPI.actions)
		dispatch(plansAPI.actions.settings.get({
			id: subscription_id,
			kind: 'activity_notifications'
		}, { auth: true }))
	}

	componentDidUpdate(prevProps, prevState) {
		const { emailTime } = this.state
		if (emailTime && emailTime !== prevState.emailTime) {
			this.handleEmailDeliveryChange(true)
		}
	}

	handleReloadCalendar = () => {
		const { dispatch, id, params, serverLanguageTag, auth: { userData: { userid } } } = this.props
		const language_tag = serverLanguageTag || params.lang || 'en'
		return dispatch(ActionCreators.calendar({ id, language_tag, user_id: userid })).then(() => {
			this.handleSelectPlan()
		})
	}

	handlePrivacyChange = () => {
		const { dispatch, id, isPrivate } = this.props
		dispatch(ActionCreators.updateSubscribeUser({ id, private: !isPrivate }, true)).then(() => {
			this.handleSelectPlan()
		})
	}

	handleEmailDeliveryChange = (emailDeliveryOn) => {
		const { dispatch, subscription_id } = this.props
		const { emailTime } = this.state
		dispatch(plansAPI.actions.subscription.put({
			id: subscription_id,
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
		const { onStopPlan } = this.props
		if (onStopPlan && typeof onStopPlan === 'function') {
			onStopPlan()
		}
	}

	render() {
		const {
			together_id,
			dayOfString,
			startString,
			endString,
			subscription,
		} = this.props
		const { emailDeliveryOn, emailTime } = this.state

		const rowStyle = {
			paddingTop: 20,
			paddingBottom: 20,
			borderTop: '1px solid #ddd',
			display: 'flex',
			flexWrap: 'wrap',
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

		let isPrivate = false
		let progressPercentage = 0
		let progressString = ''
		if (subscription) {
			isPrivate = subscription.privacy === 'private'
			if (subscription.overall) {
				progressPercentage = Math.round(subscription.overall.completion_percentage * 100)
				progressString = subscription.overall.progress_string
			}
		}

		return (
			<div className='row' style={{ marginTop: 30 }}>
				<div className='columns large-8 large-centered'>
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
						together_id &&
						<div className='row' style={rowStyle}>
							<div className='columns medium-8'>
								<h3><FormattedMessage id='notifications.together title' /></h3>
								<ParticipantsAvatarList
									together_id={together_id}
								/>
								<p style={{ marginTop: '0.5rem' }}>
									<FormattedMessage id='notifications.together description' />
								</p>
							</div>
							<div className='columns medium-4 flex-end' style={{ margin: 'auto' }}>
								<Toggle
									value={false}
									activeLabel=''
									inactiveLabel=''
									colors={switchColors}
									trackStyle={trackStyle}
									thumbStyle={thumbStyle}
								/>
							</div>
						</div>
					}
					{
						// privacy can't be changed with a pwf
						!together_id &&
						<div className='row' style={rowStyle}>
							<div className='columns medium-8'>
								<h3><FormattedMessage id='plans.privacy title' /></h3>
								<p>
									{
										isPrivate
											? <FormattedMessage id='plans.privacy description.private' />
											: <FormattedMessage id='plans.privacy description.public' />
									}
								</p>
							</div>
							<div className='columns medium-4 flex-end' style={{ margin: 'auto' }}>
								<Toggle
									value={isPrivate}
									activeLabel=''
									inactiveLabel=''
									colors={switchColors}
									trackStyle={trackStyle}
									thumbStyle={thumbStyle}
								/>
							</div>
						</div>
					}
					<div className='row' style={rowStyle}>
						<div className='columns medium-8'>
							<h3><FormattedMessage id='plans.email delivery' /></h3>
							<p>
								<FormattedMessage id='plans.email delivery text' />
							</p>
						</div>
						<div className='columns medium-4 flex-end' style={{ margin: 'auto' }}>
							<Toggle
								value={emailDeliveryOn}
								onToggle={(val) => {
									this.setState({ emailDeliveryOn: !val })
									this.handleEmailDeliveryChange(!val)
								}}
								activeLabel=''
								inactiveLabel=''
								colors={switchColors}
								trackStyle={trackStyle}
								thumbStyle={thumbStyle}
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
									}}
									use12Hours={true}
								/>
							</div>
						}
					</div>
					{
						// can't catch up on a pwf
						!together_id &&
						<div className='row' style={rowStyle}>
							<div className='columns medium-8'>
								<h3><FormattedMessage id='plans.are you behind' /></h3>
								<p>
									<FormattedMessage id='plans.catch up description only' />
								</p>
							</div>
							<div className='columns medium-4 flex-end' style={{ margin: 'auto' }}>
								<button className='solid-button green' onClick={this.handleCatchUp}>
									<FormattedMessage id='plans.catch me up' />
								</button>
							</div>
						</div>
					}
					<div className='row' style={rowStyle}>
						<div className='columns small-12'>
							<a tabIndex={0} onClick={this.handleStop} className='warning-text'>
								<FormattedMessage id='plans.stop reading' />
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	const { subscription_id } = props
	console.log(getSubscriptionModel(state))
	return {
		// subSettings: getSubscriptionSettings(state),
		subscription: getSubscriptionModel(state) &&
								subscription_id in getSubscriptionModel(state).byId
								? getSubscriptionModel(state).byId[subscription_id]
								: null,
	}
}

PlanSettings.propTypes = {
	id: PropTypes.number.isRequired,
	isPrivate: PropTypes.bool,
	isEmailDeliveryOn: PropTypes.bool.isRequired,
	emailDelivery: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
	onStopPlan: PropTypes.func.isRequired,
	onCatchUp: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired
}

PlanSettings.defaultProps = {
	emailDelivery: null,
	isPrivate: false,
}

export default connect(mapStateToProps, null)(PlanSettings)
