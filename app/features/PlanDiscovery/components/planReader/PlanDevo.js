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
			<div className='row devo-content'>
				<p>Plan Day Devo</p>
				<div className='columns large-8 medium-8 medium-centered'>
					<div
						className='devotional'
						dangerouslySetInnerHTML={{ __html: devoContent }}
					/>
				</div>
			</div>
		)
	}
}

PlanDevo.propTypes = {

}

export default PlanDevo