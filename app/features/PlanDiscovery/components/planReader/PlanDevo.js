import React, { Component, PropTypes } from 'react'

class PlanDevo extends Component {
	render() {
		const { devoContent } = this.props

		if (!devoContent) {
			return (
				<div>no content :(</div>
			)
		}
		return (
			<div>
				<p>Plan Day Devo</p>
				<div
					className='devotional'
					dangerouslySetInnerHTML={{ __html: devoContent }}
				/>
			</div>
		)
	}
}

PlanDevo.propTypes = {

}

export default PlanDevo