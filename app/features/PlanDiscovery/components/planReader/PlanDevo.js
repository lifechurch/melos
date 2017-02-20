import React, { PropTypes } from 'react'

function PlanDevo(props) {
	const { devoContent } = props

	if (!devoContent) {
		return (
			<div />
		)
	}
	return (
		<div className='row devo-content'>
			<div className='columns large-8 medium-8 medium-centered'>
				<div
					className='devotional'
					dangerouslySetInnerHTML={{ __html: devoContent }}
				/>
			</div>
		</div>
	)
}

PlanDevo.propTypes = {
	devoContent: PropTypes.string.isRequired,
}

export default PlanDevo