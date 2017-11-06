import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedText from '../../../../components/FormattedText'

function PlanDevo(props) {
	const { devoContent } = props

	if (!devoContent) {
		return (
			<div />
		)
	}

	return (
		<div className='devo-content'>
			<div className='devo-header'>
				<FormattedMessage id='plans.devotional' />
			</div>
			<FormattedText
				text={devoContent}
				customClass='devotional'
			/>
		</div>
	)
}

PlanDevo.propTypes = {
	devoContent: PropTypes.string.isRequired,
}

export default PlanDevo
