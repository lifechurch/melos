import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Immutable from 'immutable'
// actions
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// selectors
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// components
import User from '../components/User'
import CheckMark from '../components/CheckMark'
// utils
import Routes from '../lib/routes'


class ParticipantsAvatarList extends Component {
	componentDidMount() {
		const { together_id, dispatch, joinToken, participants, day, auth, together } = this.props
		if (day && !(together && together.activities)) {
			this.getDayCompletes()
		}
		if (!participants && together_id) {
			dispatch(participantsView({
				together_id,
				token: joinToken,
				auth,
				day
			}))
		}
	}

	componentDidUpdate(prevProps) {
		const { day, together } = this.props

		if (day && prevProps.day !== day) {
			if (!(together && together.activities && Immutable.fromJS(together.activities).hasIn(day))) {
				this.getDayCompletes()
			}
		}
	}

	getDayCompletes = () => {
		const { day, together_id, auth, dispatch } = this.props
		dispatch(plansAPI.actions.activities.get({
			id: together_id,
			day,
			kind: 'complete',
			fields: 'user_id,id',
			page: '*'
		},
			{
				auth: auth && auth.isLoggedIn
			}))
	}

	render() {
		const {
			participants,
			together,
			day,
			together_id,
			showMoreLink,
			statusFilter,
			customClass,
			avatarWidth,
		} = this.props

		const activities = together && together.activities
		const avatarList = []
		let link = null
		if (participants && together_id) {
			const userIds = Object.keys(participants)
			userIds.forEach((userID) => {
				const participant = participants[userID]
				const avatarSrc = participant && participant.user_avatar_url ? participant.user_avatar_url.px_48x48 : ''

				const filterMatch = Array.isArray(statusFilter)
					? Immutable.fromJS(statusFilter).includes(participant.status)
					: statusFilter === participant.status
				// truncate amount to show, and then render more link to go to participants
				// also allow filtering on status
				if (avatarList.length < 6 && (!statusFilter || filterMatch)) {
					// if we're showing participants for a specific day, we want to show the check
					// if they've completed the day
					let check = null
					if (day && activities) {
						const completions = activities[day] ? activities[day].map : null
						if (completions && completions.length > 0) {
							completions.forEach((id) => {
								const completion = activities[day].data[id]
								if (
									completion.kind === 'complete' &&
									parseInt(completion.user_id, 10) === parseInt(userID, 10)
								) {
									check = <CheckMark width={15} fill='black' />
								}
							})
						}
					}
					avatarList.push(
						<div
							className='item'
							key={participant.id}
							style={{
								marginRight: '10px',
								display: 'flex',
								alignItems: 'flex-start'
							}}
						>
							<User
								avatarLetter={participant.first_name ? participant.first_name.charAt(0) : null}
								src={participant && participant.has_avatar ? avatarSrc : null}
								width={avatarWidth}
							/>
							{ check }
						</div>
					)
				} else {
					link = (
						<div>{`+ ${userIds.length - avatarList.length}`}</div>
					)
				}
			})
		}

		let participantsLink = null
		if (showMoreLink) {
			participantsLink = showMoreLink
		} else {
			participantsLink = Routes.togetherParticipants({
				plan_id: together && together.plan_id,
				slug: '',
				together_id,
				query: day ? { day } : null,
			})
		}

		return (
			<Link to={participantsLink}>
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
		participants: together_id && getParticipantsUsersByTogetherId(state, together_id)
			? getParticipantsUsersByTogetherId(state, together_id)
			: null,
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		auth: state.auth,
	}
}

ParticipantsAvatarList.propTypes = {
	participants: PropTypes.object.isRequired,
	together: PropTypes.object,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	customClass: PropTypes.string,
	showMoreLink: PropTypes.string,
	statusFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	avatarWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	auth: PropTypes.object,
	joinToken: PropTypes.string,
	day: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

ParticipantsAvatarList.defaultProps = {
	showMoreLink: null,
	auth: null,
	together: null,
	statusFilter: null,
	avatarWidth: 36,
	customClass: '',
	isLoggedIn: false,
	joinToken: null,
	day: null,
}

export default connect(mapStateToProps, null)(ParticipantsAvatarList)
