import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
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
import Textarea from '../components/Textarea'
import Avatar from '../components/Avatar'
import Moment from '../features/Moments/components/Moment'


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
						day: parseInt(day, 10),
						created_dt: getCurrentDT(),
						content: comment,
					},
					auth: true
				})).then(() => {
					this.setState({ comment: null })
					this.getActivities({ page: 1 })
				})
		}
	}

	renderMoment = (moment) => {
		console.log('MOMENT', moment);
		return (
			<Moment
				userid={moment.user_id}
				content={moment.content}
				title={null}
				dt={moment.created_dt}
			/>
		)
	}

	render() {
		const { content, day, together_id, activities, auth, users, intl } = this.props
		const { comment } = this.state

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

		const dayActivities = activities &&
														activities[day] ?
														activities[day] :
														null

		return (
			<div className='talk-it-over'>
				{
					dayActivities &&
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
						<div style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
							<Avatar
								src={avatarSrc}
								width={38}
								placeholderText={authedUser && authedUser.first_name ? authedUser.first_name.charAt(0) : null}
							/>
						</div>
						<Textarea
							ref={(ref) => { this.textarea = ref }}
							className='yv-textarea'
							placeholder={intl.formatMessage({ id: 'type response' })}
							onChange={(val) => { this.setState({ comment: val.target.value }) }}
							value={comment}
						/>
					</Card>
					{
							dayActivities &&
							dayActivities.map &&
							dayActivities.map.map((id) => {
								const moment = dayActivities.data[id]
								// we don't render a separate moment for a child activity,
								// nor day complete
								if (moment && moment.id && !moment.parent_id && moment.kind === 'comment') {
									return (
										<li key={moment.id} className='no-bullets' style={{ marginTop: '20px' }}>
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

export default connect(mapStateToProps, null)(injectIntl(TalkItOver))
