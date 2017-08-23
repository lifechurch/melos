import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
// selectors
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'


function InvitationString({ together_id, participants }) {

	const hostObj = participants
		&& participants.filter({ together_id, statusFilter: 'host' })
	const host = hostObj
		&& hostObj[Object.keys(hostObj)[0]]
		&& hostObj[Object.keys(hostObj)[0]].name
	const others = participants
		&& participants.filter({ together_id, idOnly: true }).length - 1

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

function mapStateToProps(state) {
	return {
		participants: getParticipantsUsers(state)
	}
}

InvitationString.propTypes = {
	together_id: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null)(InvitationString)
