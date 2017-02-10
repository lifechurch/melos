import React, { PropTypes } from 'react'

import PlanReferenceItem from './PlanReferenceItem'
import PlanDevoItem from './PlanDevoItem'

function PlanReferences(props) {
	const { references, hasDevo } = props

	const iconStyle = {
		padding: '1px 2px 3px 0',
		verticalAlign: 'middle',
		height: 18,
		width: 23,
		cursor: 'pointer'
	}

	const referenceLinks = Object.keys(references).map((refIndex) => {
		const reference = references[refIndex].reference
		return <PlanReferenceItem {...props} content={refIndex} reference={reference} key={refIndex} iconStyle={iconStyle} />
	})

	if (hasDevo) {
		referenceLinks.unshift(<PlanDevoItem key="devo" {...props} iconStyle={iconStyle} />)
	}

	return (
		<ul className="no-bullets plan-pieces">
			{referenceLinks}
		</ul>
	)
}

PlanReferences.propTypes = {
	references: PropTypes.object.isRequired,
	hasDevo: PropTypes.bool,
}

PlanReferences.defaultProps = {
	hasDevo: true,
}

export default PlanReferences
