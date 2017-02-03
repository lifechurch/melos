import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'

function PlanReferences(props) {
	const { references, day, link, hasDevo, completedRefs, devoCompleted } = props

	const iconStyle = {
		padding: '1px 2px 3px 0',
		verticalAlign: 'middle',
		height: 18,
		width: 23,
		cursor: 'pointer'
	}

	const isComplete = (usfm) => {
		return completedRefs.indexOf(usfm) !== -1
	}

	const listItem = (key, icon, itemLink, label) => {
		return (
			<li key={key} className="li-right">
				{icon}
				<Link to={itemLink}>{label}</Link>
			</li>
		)
	}

	const circle = <Circle style={iconStyle} />
	const check = <CheckMark fill="#444444" style={iconStyle} />

	const referenceLinks = Object.keys(references).map((key) => {
		const { reference: { usfm, human } } = references[key]
		return listItem(
			usfm.join('+'),
			(isComplete(usfm.join('+'))) ? check : circle,
			{ pathname: `${link}/ref`, query: { day, content: key } },
			human
		)
	})

	if (hasDevo) {
		referenceLinks.unshift(listItem(
			'devo',
			devoCompleted ? check : circle,
			{ pathname: `${link}/devo`, query: { day } },
			<FormattedMessage id="plans.devotional" />
		))
	}

	return (
		<ul className="no-bullets plan-pieces">
			{referenceLinks}
		</ul>
	)
}

PlanReferences.propTypes = {
	references: PropTypes.object.isRequired,
	completedRefs: PropTypes.array,
	link: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired,
	hasDevo: PropTypes.bool,
	devoCompleted: PropTypes.bool
}

PlanReferences.defaultProps = {
	hasDevo: true,
	devoCompleted: true,
	completedRefs: []
}

export default PlanReferences