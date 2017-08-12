import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'


function TalkItOverInfo(props) {
	const { together_id, day, questionContent, customClass } = props

	return (
		<div
			className={`vertical-center horizontal-center flex-wrap text-center ${customClass}`}
		>
			<h5 style={{ width: '100%' }}><FormattedMessage id='talk-it-over' /></h5>
			<ParticipantsAvatarList
				together_id={together_id}
				day={day}
				statusFilter={['accepted', 'host']}
				avatarWidth={30}
			/>
			<h6 style={{ width: '100%' }}>{ questionContent }</h6>
		</div>
	)
}

TalkItOverInfo.propTypes = {
	together_id: PropTypes.number.isRequired,
	questionContent: PropTypes.string.isRequired,
	day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	customClass: PropTypes.string,
}

TalkItOverInfo.defaultProps = {
	day: null,
	customClass: '',
}

export default TalkItOverInfo
