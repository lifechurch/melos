import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
// selectors
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'


function InvitationString({ together_id, together, participants }) {

	const host = together && participants && together.host_user_id in participants
		? participants[together.host_user_id].name
		: null
	const others = together_id in participants
		? participants[together_id].map.length - 1
		: null

	return (
		<FormattedMessage
			id='invitation with others'
			values={{
				host,
				others,
			}}
		/>
	)
}

function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		participants: together_id && getParticipantsUsersByTogetherId(state, together_id)
			? getParticipantsUsersByTogetherId(state, together_id)
			: null,
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
	}
}

InvitationString.propTypes = {
	together_id: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null)(InvitationString)
