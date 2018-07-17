import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import FormattedText from '../../../../components/FormattedText'
import AudioIcon from '../../../../components/icons/Audio'

function PlanDevo(props) {
	const { devoContent, hasDevotionalAudio } = props

	if (!devoContent) {
		return (
			<div />
		)
	}

	return (
		<div className='devo-content'>
			<div className='devo-header' style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ width: '100%' }}><FormattedMessage id='plans.devotional' /></div>
				{hasDevotionalAudio && (<div className="devo-audio-disclaimer" style={{ width: 'auto', display: 'flex', backgroundColor: '#f4f4f4', borderRadius: '5px', padding: 10 }}>
					<AudioIcon />
					<a style={{ fontSize: 12, lineHeight: '16px', display: 'inline-block', paddingLeft: 10 }} href="/app">
            Listen to this audio devotional now in the Bible App.
          </a>
				</div>)}
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
	hasDevotionalAudio: PropTypes.bool
}

PlanDevo.defaultProps = {
	hasDevotionalAudio: false
}

export default PlanDevo
