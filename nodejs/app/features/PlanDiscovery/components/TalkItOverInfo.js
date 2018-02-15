import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'


function TalkItOverInfo(props) {
	const { together_id, day, questionContent, customClass, archived } = props

	return (
		<div
			className={`vertical-center horizontal-center flex-wrap text-center ${customClass}`}
		>
			<h5 style={{ width: '100%' }}><FormattedMessage id='talk it over' /></h5>
			<ParticipantsAvatarList
				together_id={together_id}
				day={day}
				statusFilter={['accepted', 'host']}
				avatarWidth={30}
			/>
			<h6 style={{ width: '100%' }}>{ questionContent }</h6>
			{
				archived
					&& (
						<div className='font-grey'>
							<FormattedMessage id='plan archived' />
						</div>
					)
			}
		</div>
	)
}

TalkItOverInfo.propTypes = {
	together_id: PropTypes.number.isRequired,
	questionContent: PropTypes.string.isRequired,
	day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	customClass: PropTypes.string,
	archived: PropTypes.bool,
}

TalkItOverInfo.defaultProps = {
	day: null,
	customClass: '',
	archived: false,
}

export default TalkItOverInfo
