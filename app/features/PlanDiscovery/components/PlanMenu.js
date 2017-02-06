import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import XMark from '../../../components/XMark'

class PlanMenu extends Component {
	constructor(props) {
		super(props)
		this.state = { show: false }
		this.handleToggle = this.handleToggle.bind(this)
		this.handleCatchUp = this.handleCatchUp.bind(this)
	}

	handleToggle() {
		this.setState((prevState) => {
			return { show: !prevState.show }
		})
	}

	handleCatchUp() {
		const { onCatchUp } = this.props
		this.handleToggle()
		if (typeof onCatchUp === 'function') {
			onCatchUp()
		}
	}

	render() {
		const { subscriptionLink, aboutLink } = this.props
		const { show } = this.state
		let menu, trigger

		if (show) {
			trigger = <XMark width={14.4} height={13.7} />
			menu = (
				<ul>
					<Link onClick={this.handleToggle} to={`${subscriptionLink}`}>
						<li>
							<FormattedMessage id="plans.overview" />
						</li>
					</Link>
					<Link onClick={this.handleToggle} to={`${subscriptionLink}/edit`}>
						<li>
							<FormattedMessage id="plans.settings" />
						</li>
					</Link>
					<Link onClick={this.handleToggle} to={`${aboutLink}`}>
						<li>
							<FormattedMessage id="features.EventEdit.features.preview.components.PreviewTypePlan.info" />
						</li>
					</Link>
					<Link onClick={this.handleToggle} to={`${subscriptionLink}/calendar`}>
						<li>
							<FormattedMessage id="plans.month" />
						</li>
					</Link>
					<a tabIndex={0} onClick={this.handleCatchUp}>
						<li>
							<FormattedMessage id="plans.catch me up" />
						</li>
					</a>
				</ul>
			)
		} else {
			trigger = '•••'
		}

		return (
			<div id="plan-more-menu" style={{ marginLeft: 15, marginTop: 1, display: 'inline-block', float: 'right' }}>
				<a tabIndex={0} onClick={this.handleToggle}><div className="trigger">{trigger}</div></a>
				{menu}
			</div>
		)
	}
}

PlanMenu.propTypes = {
	subscriptionLink: PropTypes.string.isRequired,
	aboutLink: PropTypes.string.isRequired,
	onCatchUp: PropTypes.func.isRequired
}

export default PlanMenu