import React, { Component } from 'react'

class PlanRef extends Component {
	render() {
		const { plan, reference } = this.props

		console.log(ref)
		if (!plan || !ref) {
			return (
				<div></div>
			)
		}
		return (
			<div>
				<p>Plan Day Ref</p>
			</div>
		)
	}
				// <div
				// 	className='devotional'
				// 	dangerouslySetInnerHTML={{ __html: plan.calendar[day - 1].additional_content.html.default }}
				// />
}

PlanRef.propTypes = {

}

export default PlanRef
