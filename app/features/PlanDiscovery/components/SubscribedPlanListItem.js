import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

class SubscribedPlanListItem extends Component {
	render() {
		const { plan, day } = this.props
		return (
			<div>
				<div className="progress_wrap">
					<div className="progress_counter" style={{ width: `${plan.completion_percentage}%` }} title={`${plan.completion_percentage}%`}>&nbsp;</div>
				</div>
				<br />
				<div className="plan-length">
					<FormattedMessage id="plans.which day in plan" values={{ day: day, total: plan.total_days }} />
				</div>
			</div>
		)
	}
}

SubscribedPlanListItem.propTypes = {
	plan: PropTypes.object,
	day: PropTypes.number,
}

SubscribedPlanListItem.defaultProps = {
	plan: {},
	day: 1
}

export default SubscribedPlanListItem