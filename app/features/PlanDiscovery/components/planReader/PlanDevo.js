import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

function PlanDevo(props) {
	const { devoContent } = props

	if (!devoContent) {
		return (
			<div />
		)
	}
	return (
		<div className='devo-content'>
			<div className="devo-header">
				<FormattedMessage id="plans.devotional" />
			</div>
			<div
				className='devotional'
				dangerouslySetInnerHTML={{ __html: devoContent }}
			/>
		</div>
	)
}

PlanDevo.propTypes = {
	devoContent: PropTypes.string.isRequired,
}

export default PlanDevo
