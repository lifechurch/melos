import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI, { getTogether } from '@youversion/api-redux/lib/endpoints/plans'
// models
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// utils
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import getCurrentDT from '../lib/getCurrentDT'
// components
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import List from '../components/List'
import Card from '../components/Card'
import Input from '../components/Input'
import Avatar from '../components/Avatar'


class TalkItOver extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comment: null
		}
	}

	componentDidMount() {
		this.getActivities({ page: 1 })
	}

	getActivities = ({ page }) => {
		const { day, together_id, dispatch } = this.props
		dispatch(plansAPI.actions.activities.get({
			id: together_id,
			day,
			page,
		},
			{
				auth: true
			}))
	}

	handleComment = () => {
		const { day, together_id, dispatch } = this.props
		const { comment } = this.state
		if (comment) {
			dispatch(plansAPI.actions.activities.post({
				id: together_id,
			},
				{
					body: {
						kind: 'comment',
						day,
						created_dt: getCurrentDT(),
						content: comment,
					},
					auth: true
				}))
		}
	}

	renderMoment = (moment) => {
		return (
			<div>
				{ moment.id }
			</div>
		)
	}

	render() {
		const { content, day, together_id, activities, auth, users } = this.props

		const authedUser = auth &&
												auth.userData &&
												auth.userData.userid &&
												auth.userData.userid in users ?
												users[auth.userData.userid] :
												null

		const avatarSrc = authedUser &&
											authedUser.has_avatar &&
											authedUser.user_avatar_url ?
											authedUser.user_avatar_url.px_48x48 :
											null
		console.log(authedUser, users);
		const activitiesList = activities &&
														activities[day] &&
														activities[day].data ?
														activities[day].data :
														null
		return (
			<div>
				{
					activitiesList &&
					<ParticipantsAvatarList
						together_id={together_id}
						day={day}
						statusFilter={['accepted', 'host']}
						avatarWidth={46}
					/>
				}
				<h5>{ content }</h5>
				<List>
					<Card
						footer={
							<a
								tabIndex={0}
								className='green'
								onClick={this.handleComment}
							>
								<FormattedMessage id='moments.comments.form.save button' />
							</a>
						}
					>
						<Avatar src={avatarSrc} />
						<Input onChange={(val) => { this.setState({ comment: val }) }} />
					</Card>
					{
							activitiesList &&
							activitiesList.map((moment) => {
								if (moment && moment.id) {
									return (
										<li key={moment.id} className='no-bullets'>
											{ this.renderMoment(moment) }
										</li>
									)
								}
								return null
							})
						}
				</List>
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	const { together_id } = props
	console.log('TOG', getTogetherModel(state));
	return {
		activities: getTogetherModel(state) &&
								together_id in getTogetherModel(state).byId &&
								getTogetherModel(state).byId[together_id].activities ?
								getTogetherModel(state).byId[together_id].activities :
								null,
		users: getUsers(state),
		auth: state.auth,
	}
}

TalkItOver.propTypes = {

}

TalkItOver.defaultProps = {
	location: {},
}

export default connect(mapStateToProps, null)(TalkItOver)
