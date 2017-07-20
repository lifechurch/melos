import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux'

import SubscribeUserDialog from './SubscribeUserDialog'

class SubscribeUserAction extends Component {
	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }

		this.handleGoToPlan = this.handleGoToPlan.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.setState((nextState) => {
			return { dialogOpen: !nextState.dialogOpen }
		})
	}

	handleGoToPlan() {
		const { dispatch, subLinkBase } = this.props
		dispatch(routeActions.push(subLinkBase))
	}

	render() {
		const { id, isSubscribed, subLinkBase } = this.props
		const { dialogOpen } = this.state

		const triggerButton = (
			isSubscribed ?
				(
					<button style={{ width: '100%', maxWidth: 300 }} className='solid-button green' onClick={this.handleGoToPlan}>
						<FormattedMessage id="plans.read today" />
					</button>
				)
				:
				(
					<button style={{ width: '100%', maxWidth: 300 }} className='solid-button green' onClick={this.handleClick}>
						<FormattedMessage id="plans.start" />
					</button>
				)
		)
		const footer = (
			<button
				className='cancel-button'
				onClick={this.handleClick}
			>
				Cancel
			</button>
		)
		return (
			<div>
				{ triggerButton }
				{!!dialogOpen &&
					<SubscribeUserDialog
						id={id}
						isSubscribed={isSubscribed}
						subLinkBase={subLinkBase}
						footer={footer}
					/>
				}
			</div>
		)
	}
}

SubscribeUserAction.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	dispatch: PropTypes.func.isRequired,
	isSubscribed: PropTypes.bool.isRequired,
	subLinkBase: PropTypes.string.isRequired
}

export default connect()(SubscribeUserAction)
