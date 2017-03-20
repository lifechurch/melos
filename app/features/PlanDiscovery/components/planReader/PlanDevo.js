import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

function PlanDevo(props) {
	const { devoContent } = props

	if (!devoContent) {
		return (
			<div />
		)
	}

	// make sure devo content in text has correct line breaks
	const formattedText = devoContent.replace(/(?:\r\n|\r|\n)/g, '<br />')

	return (
		<div className='devo-content'>
			<div className="devo-header">
				<FormattedMessage id="plans.devotional" />
			</div>
			<div
				className='devotional'
				dangerouslySetInnerHTML={{ __html: formattedText }}
			/>
		</div>
	)
}

PlanDevo.propTypes = {
	devoContent: PropTypes.string.isRequired,
}

export default PlanDevo
