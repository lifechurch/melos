import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import FormattedText from '../../../../components/FormattedText'

function PlanDevo(props) {
	const { devoContent, hasDevotionalAudio } = props

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
			{hasDevotionalAudio && (
			<div className="devo-audio-disclaimer">
          Bible.com doesn't support playing this audio plan content. To listen, download the Bible App
        </div>
      )}
			<FormattedText
				text={devoContent}
				customClass='devotional'
			/>
		</div>
	)
}

PlanDevo.propTypes = {
	devoContent: PropTypes.string.isRequired,
	hasDevotionalAudio: PropTypes.bool
}

PlanDevo.defaultProps = {
	hasDevotionalAudio: false
}

export default PlanDevo
