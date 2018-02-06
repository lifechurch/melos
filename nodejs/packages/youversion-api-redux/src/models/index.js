import { createSelector } from 'reselect'
import Immutable from 'immutable'
import { getUsers } from '../endpoints/users/reducer'
import { getParticipants, getTogethers } from '../endpoints/plans'


export const getAuth = (state) => {
	return state.auth
}
export const getAuthedUserData = (state) => {
	return 'userData' in state.auth ?
					state.auth.userData :
					null
}

/**
 * selector returning an object containing each participant for each
 * plan together
 */
export const getParticipantsUsers = createSelector(
	[ getParticipants, getUsers, getAuthedUserData ],
	(participants, users, authData) => {
		const participantsModel = { byTogetherId: {} }
		// let's build out an object keyed by together_id which contains each
		// participant keyed by participant.id (user.id)
		if (participants && Object.keys(participants).length > 0 && users) {
			// for each participants object keyed by together_id, let's loop through
			// the list of participants and merge the participant with the user object
			// that matches the user
			Object.keys(participants).forEach((together_id) => {
				if (together_id in participants && participants[together_id]) {
					participantsModel.byTogetherId[together_id] = participants[together_id]
					const participantsForTogether = participants[together_id].map
					if (participantsForTogether && participantsForTogether.length > 0) {
						participantsForTogether.forEach((userid) => {
							if (userid in users && users[userid].response) {
								participantsModel.byTogetherId[together_id] = Immutable
									.fromJS(participantsModel.byTogetherId[together_id])
									.mergeDeepIn(['data', `${userid}`], users[userid].response)
									.toJS()
							}
						})
					}
				}
			})
		}

		// function on model
		// filter participants by togetherid and optional participant filter
		participantsModel.filter = ({ together_id, statusFilter = null, idOnly = false }) => {
			const usersForTogether = together_id in participantsModel.byTogetherId
				&& participantsModel.byTogetherId[together_id].map
			const filteredArr = []
			const filteredObj = {}
			if (usersForTogether && usersForTogether.length > 0) {
				usersForTogether.forEach((id) => {
					const u = id in participantsModel.byTogetherId[together_id].data
						&& participantsModel.byTogetherId[together_id].data[id]
					const filterMatch = Array.isArray(statusFilter)
						? Immutable.fromJS(statusFilter).includes(u.status)
						: statusFilter === u.status

					if (!statusFilter || filterMatch) {
						filteredArr.push(id)
						filteredObj[id] = u
					}
				})
			}
			return idOnly
				? filteredArr
				: filteredObj
		}

		participantsModel.isAuthHost = (together_id) => {
			return authData
				&& together_id
				&& authData.userid === participantsModel.filter({
					together_id,
					statusFilter: 'host',
					idOnly: true,
				})[0]
		}

		return participantsModel
	}
)

export const getTogetherInvitations = createSelector(
	[ getAuthedUserData, getTogethers, getParticipants ],
	(authedUser, togethers, participants) => {
		const invitations = []
		if (togethers && participants) {
			const togetherIds = togethers.map
			if (togetherIds && togetherIds.length > 0) {
				togetherIds.forEach((id) => {
					// if user's id is in this together's participants
					if (
						Immutable
							.fromJS(participants)
							.getIn([`${id}`, 'data', `${authedUser.userid}`, 'status'], null) === 'invited'
					) {
						invitations.push(id)
					}
				})
			}
		}
		return invitations
	}
)
