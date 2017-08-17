import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
// actions
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// selectors
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// components
import User from '../components/User'
import CheckMark from '../components/CheckMark'
// utils
import Routes from '../lib/routes'
import { hasUserCompletedActivity } from '../lib/readingPlanUtils'


const MAX_AVATARS = 5

class ParticipantsAvatarList extends Component {
	componentDidMount() {
		const { together_id, dispatch, joinToken, participants, day, auth, together } = this.props
		if (day && !(together && together.activities)) {
			this.getDayCompletes()
		}
		if (together_id && !(participants && together_id in participants.byTogetherId)) {
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
			plan_id,
			showMoreLink,
			statusFilter,
			customClass,
			avatarWidth,
		} = this.props

		const activities = together && together.activities
		const avatarList = []
		const usersToShow = participants
			&& together_id
			&& participants.filter({
				together_id,
				statusFilter,
			})
		if (participants && together_id && usersToShow) {
			Object.keys(usersToShow).forEach((id) => {
				const participant = usersToShow[id]
				const avatarSrc = participant && participant.user_avatar_url ? participant.user_avatar_url.px_48x48 : ''

				// truncate amount to show, and then render more link to go to participants
				if (avatarList.length < MAX_AVATARS) {
					// if we're showing participants for a specific day, we want to show the check
					// if they've completed the day
					let check = null
					if (day && activities) {
						const completions = activities[day] ? activities[day].data : null
						if (hasUserCompletedActivity(completions, participant.id)) {
							check = <CheckMark width={13} fill='black' />
						}
					}
					avatarList.push(
						<div
							className='item'
							key={participant.id}
							// set the margin as a ratio of the width
							style={{
								marginRight: `${avatarWidth * 0.37}px`,
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
				}
			})
		}

		let participantsLink = null
		if (showMoreLink) {
			participantsLink = showMoreLink
		} else {
			participantsLink = Routes.togetherParticipants({
				plan_id: plan_id || (together && together.plan_id),
				slug: '',
				together_id,
				query: day ? { day } : null,
			})
		}

		return (
			<Link to={participantsLink}>
				<div className={`participants-list vertical-center ${customClass}`}>
					{ avatarList }
					{
						// if we want to show more users than is allowed, show the link
						usersToShow
							&& Object.keys(usersToShow).length > avatarList.length
							? (
								<div className='yv-green-link'>
									{`+ ${Object.keys(usersToShow).length - avatarList.length}`}
								</div>
							)
							: (
								<div className='yv-green-link'>
									<FormattedMessage id='x participants' values={{ number: avatarList.length }} />
								</div>
							)
					}
				</div>
			</Link>
		)
	}
}

function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		participants: getParticipantsUsers(state),
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
	plan_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
	plan_id: null,
	statusFilter: null,
	avatarWidth: 32,
	customClass: '',
	isLoggedIn: false,
	joinToken: null,
	day: null,
}

export default connect(mapStateToProps, null)(ParticipantsAvatarList)
