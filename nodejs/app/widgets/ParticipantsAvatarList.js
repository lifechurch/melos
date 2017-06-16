import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
// actions
import participantsView from '@youversion/api-redux/src/batchedActions/participantsUsersView'
// selectors
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/src/models'
// components
import User from '../components/User'


class ParticipantsAvatarList extends Component {
	componentDidMount() {
		const { together_id, dispatch, isLoggedIn, joinToken, participants } = this.props
		if (!participants) {
			dispatch(participantsView({
				together_id,
				auth: isLoggedIn,
				token: joinToken
			}))
		}
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
								src={avatarSrc}
								width={avatarWidth}
							/>
						</div>
					)
				} else if (showMoreLink) {
					link = (
						<Link to={showMoreLink}>
							<div>{ userIds.length - avatarList.length } More</div>
						</Link>
						)
				}
			})
		}

		return (
			<div className={`participants-list vertical-center ${customClass}`}>
				{ avatarList }
				{ link }
			</div>
		)
	}
}

function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		participants: getParticipantsUsersByTogetherId(state, together_id),
	}
}

ParticipantsAvatarList.propTypes = {
	participants: PropTypes.object.isRequired,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	customClass: PropTypes.string,
	showMoreLink: PropTypes.string,
	statusFilter: PropTypes.string,
	avatarWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isLoggedIn: PropTypes.bool,
	joinToken: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

ParticipantsAvatarList.defaultProps = {
	showMoreLink: null,
	statusFilter: null,
	avatarWidth: 24,
	customClass: '',
	isLoggedIn: false,
	joinToken: null,
}

export default connect(mapStateToProps, null)(ParticipantsAvatarList)
