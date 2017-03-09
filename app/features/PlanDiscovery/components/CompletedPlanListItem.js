import React, { Component, PropTypes } from 'react'
import moment from 'moment'

class CompletedPlanListItem extends Component {
	render() {
		const { plan, languageTag } = this.props
		const completedDate = moment(plan.completed_dt)
		return (
			<div>
				<div className='plan-length'>
					{ plan.formatted_length[languageTag] || plan.formatted_length.default}
				</div>
				<div className='plan-completed'>
					{ completedDate.format('LL') }
				</div>
			</div>
		)
	}
}

CompletedPlanListItem.propTypes = {
	plan: PropTypes.object,
	languageTag: PropTypes.string

}

CompletedPlanListItem.defaultProps = {
	plan: {},
	languageTag: 'default'
}

export default CompletedPlanListItem