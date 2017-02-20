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
		const { dispatch, subscriptionLink } = this.props
		dispatch(routeActions.push(subscriptionLink))
	}

	render() {
		const { id, isSubscribed, subscriptionLink } = this.props
		const { dialogOpen } = this.state
		return (
			<div>
				{isSubscribed
					?
						<button className='solid-button green padded' onClick={this.handleGoToPlan}>
							<FormattedMessage id="plans.read today" />
						</button>
					:
						<button className='solid-button green padded' onClick={this.handleClick}>
							<FormattedMessage id="plans.start" />
						</button>
				}
				{!!dialogOpen &&
					<SubscribeUserDialog
						id={id}
						isSubscribed={isSubscribed}
						subscriptionLink={subscriptionLink}
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
	subscriptionLink: PropTypes.string.isRequired
}

export default connect()(SubscribeUserAction)
