import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Toggle from 'react-toggle-button'
import ProgressBar from '../../../components/ProgressBar'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import ActionCreators from '../actions/creators'


class PlanSettings extends Component {

	handleSelectPlan() {
		const { dispatch, id } = this.props
		dispatch(ActionCreators.planSelect({ id }))
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

	handleEmailDeliveryChange = () => {
		const { dispatch, id, isEmailDeliveryOn } = this.props
		const email_delivery = isEmailDeliveryOn ? false : '08:00:00'
		const email_delivery_version_id = isEmailDeliveryOn ? null : 1
		dispatch(ActionCreators.updateSubscribeUser({ id, email_delivery, email_delivery_version_id }, true)).then(() => {
			this.handleSelectPlan()
		})
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
			isPrivate,
			isEmailDeliveryOn,
			emailDelivery,
			together_id,
			dayOfString,
			progressPercentage,
			progressString,
			startString,
			endString,
		} = this.props

		const rowStyle = {
			paddingTop: 20,
			paddingBottom: 20,
			borderTop: '1px solid #ddd',
			display: 'flex',
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

		return (
			<div className='row' style={{ marginTop: 30 }}>
				<div className='columns large-8 large-centered'>
					<div style={{ padding: '20px 0 35px 0' }}>
						<div style={{ marginBottom: '10px' }}>
							{ dayOfString }
							{` (${progressPercentage ? Math.round(progressPercentage) : 0}%)`}
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
								value={isEmailDeliveryOn}
								activeLabel=''
								inactiveLabel=''
								colors={switchColors}
								trackStyle={trackStyle}
								thumbStyle={thumbStyle}
							/>
							<div>{ emailDelivery }</div>
						</div>
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

export default PlanSettings
