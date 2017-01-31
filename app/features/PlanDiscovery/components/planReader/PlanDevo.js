import React, { Component, PropTypes } from 'react'

class PlanDevo extends Component {
	render() {
		const { plan, day } = this.props

		console.log(day)
		console.log(plan)
		if (!plan || !day) {
			return (
				<div></div>
			)
		}
		return (
			<div>
				<p>Plan Day Devo</p>
				<div
					className='devotional'
					dangerouslySetInnerHTML={{ __html: plan.calendar[day - 1].additional_content.html.default }}
				/>
			</div>
		)
	}
}

PlanDevo.propTypes = {

}

export default PlanDevo