import React, { PropTypes } from 'react'
import { Link } from 'react-router'

function PlanReferences(props) {
	const { references, day, link } = props
	const referenceLinks = Object.keys(references).map((key) => {
		const { reference: { usfm, human } } = references[key]
		const refLink = { pathname: `${link}/ref`, query: { day, content: key } }
		return <li key={usfm.join('+')} className="li-right"><Link to={refLink}>{human}</Link></li>
	})

	return (
		<ul className="no-bullets plan-pieces">
			{referenceLinks}
		</ul>
	)
}

PlanReferences.propTypes = {
	references: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired
}

export default PlanReferences