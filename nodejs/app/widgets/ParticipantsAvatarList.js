import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
// actions
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// selectors
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// components
import User from '../components/User'


class ParticipantsAvatarList extends Component {
	componentDidMount() {
		const { together_id, dispatch, joinToken, participants, day, auth } = this.props
		if (day) {
			this.getDayCompletes()
		}
		if (!participants) {
			dispatch(participantsView({
				together_id,
				auth: auth && auth.isLoggedIn,
				token: joinToken,
				day
			}))
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { day } = this.props

		if (day && prevProps.day !== day) {
			this.getDayCompletes()
		}
	}

	getDayCompletes = () => {
		const { day, together_id, auth, dispatch } = this.props
		dispatch(plansAPI.actions.activities.get({
			id: together_id,
			day,
			kind: 'complete',
			fields: 'user_id',
			page: '*'
		},
			{
				auth: auth && auth.isLoggedIn
			}))
	}

	render() {
		const {
			participants,
			together_id,
			showMoreLink,
			statusFilter,
			customClass,
			avatarWidth
		} = this.props

		const avatarList = []
		let link = null
		if (participants && together_id) {
			const userIds = Object.keys(participants)
			userIds.forEach((userID, index) => {
				const participant = participants[userID]
				const avatarSrc = participant && participant.user_avatar_url ? participant.user_avatar_url.px_48x48 : ''
				// truncate amount to show, and then render more link to go to participants
				// also allow filtering on status
				if (index < 6 && (!statusFilter || statusFilter === participant.status)) {
					avatarList.push(
						<div className='vertical-center item' key={participant.id} style={{ marginRight: '10px' }}>
							<User
								avatarLetter={participant.first_name ? participant.first_name.charAt(0) : null}
								src={participant && participant.has_avatar ? avatarSrc : null}
								width={avatarWidth}
							/>
						</div>
					)
				} else if (showMoreLink) {
					link = (
						<div>{ userIds.length - avatarList.length } More</div>
					)
				}
			})
		}

		return (
			<Link to={showMoreLink}>
				<div className={`participants-list vertical-center ${customClass}`}>
					{ avatarList }
					{ link }
				</div>
			</Link>
		)
	}
}

function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		participants: getParticipantsUsersByTogetherId(state, together_id),
		activities: getTogetherModel(state) &&
								together_id in getTogetherModel(state).byId &&
								getTogetherModel(state).byId[together_id].activities ?
								getTogetherModel(state).byId[together_id].activities :
								null,
		auth: state.auth,
	}
}

ParticipantsAvatarList.propTypes = {
	participants: PropTypes.object.isRequired,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	customClass: PropTypes.string,
	showMoreLink: PropTypes.string,
	statusFilter: PropTypes.string,
	avatarWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	auth: PropTypes.object,
	joinToken: PropTypes.string,
	day: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

ParticipantsAvatarList.defaultProps = {
	showMoreLink: null,
	auth: null,
	statusFilter: null,
	avatarWidth: 24,
	customClass: '',
	isLoggedIn: false,
	joinToken: null,
	day: null,
}

export default connect(mapStateToProps, null)(ParticipantsAvatarList)
