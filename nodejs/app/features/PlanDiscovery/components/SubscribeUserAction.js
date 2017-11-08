import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import SubscribeUserDialog from './SubscribeUserDialog'


class SubscribeUserAction extends Component {
	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.setState((nextState) => {
			return { dialogOpen: !nextState.dialogOpen }
		})
	}

	render() {
		const { id, subLinkBase } = this.props
		const { dialogOpen } = this.state

		const triggerButton = (
			<button style={{ width: '100%', maxWidth: 300 }} className='solid-button green' onClick={this.handleClick}>
				<FormattedMessage id="plans.start" />
			</button>
		)
		const footer = (
			<button
				className='cancel-button'
				onClick={this.handleClick}
			>
				<FormattedMessage id='cancel' />
			</button>
		)
		return (
			<div>
				{ triggerButton }
				{!!dialogOpen &&
					<SubscribeUserDialog
						id={id}
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
	subLinkBase: PropTypes.string.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
}

export default connect()(SubscribeUserAction)
