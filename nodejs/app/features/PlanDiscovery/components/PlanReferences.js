import React, { PropTypes } from 'react'

import PlanReferenceItem from './PlanReferenceItem'
import PlanDevoItem from './PlanDevoItem'

function PlanReferences(props) {
	const { references, hasDevo, dayProgress } = props

	const referenceLinks = []

	if (hasDevo) {
		referenceLinks.push(<PlanDevoItem key='devo' {...props} />)
	}

	if (references) {
		Object.keys(references).forEach((refIndex, i) => {
			const reference = references[refIndex].reference
			referenceLinks.push(
				<PlanReferenceItem
					key={refIndex}
					human={reference.human}
					isComplete={dayProgress.complete || dayProgress.partial[i]}
				/>
			)
		})
	}


	return (
		<ul className='no-bullets plan-pieces'>
			{ referenceLinks }
		</ul>
	)
}

PlanReferences.propTypes = {
	references: PropTypes.object.isRequired,
	dayProgress: PropTypes.object.isRequired,
	hasDevo: PropTypes.bool,
}

PlanReferences.defaultProps = {
	hasDevo: true
}

export default PlanReferences
