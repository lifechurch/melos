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


function authedUserHasLiked(momentLikes, userLikes) {
	// check if the any of the likes on the moment match any likes from the
	// authed user
	return momentLikes &&
					momentLikes.some((id) => {
						return userLikes &&
										userLikes.includes(id)
					})
}

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
			order: 'desc'
		},
			{
				auth: true
			}))
	}

	// if we pass a parent_id than this is a reply, otherwise it's a top
	// level comment
	handleComment = ({ parent_id = null }) => {
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
						parent_id,
					},
					auth: true
				})).then(() => {
					this.setState({ comment: '' })
				})
		}
	}

	handleLike = ({ parent_id }) => {
		const { day, together_id, dispatch } = this.props
		if (parent_id) {
			const moment = this.dayActivities.data[parent_id]
			// if the user has already liked the moment then we want to unlike it
			const alreadyLiked = moment.likes & this.dayActivities.authedUser.likes
			console.log('ALRE', moment.likes & [], alreadyLiked)
			if (alreadyLiked) {
				dispatch(plansAPI.actions.activity.delete({
					id: together_id,
					activity_id: alreadyLiked
				},
					{
						auth: true
					}))
			} else {
				dispatch(plansAPI.actions.activities.post({
					id: together_id,
				},
					{
						body: {
							kind: 'like',
							day: parseInt(day, 10),
							created_dt: getCurrentDT(),
							parent_id,
						},
						auth: true
					}))
			}
		}
	}

	renderMoment = (moment) => {
		console.log('MOMENT', moment);
		// fill the heart if the user has liked this moment
		const authedLike = authedUserHasLiked(
												moment.likes,
												this.dayActivities.authedUser.likes
											)

		return (
			<Moment
				userid={moment.user_id}
				content={moment.content}
				dt={moment.created_dt}
				filledLike={authedLike}
				likes={moment.likes ? moment.likes.length : null}
				onReply={this.handleComment.bind(this, { parent_id: moment.id })}
				onLike={this.handleLike.bind(this, { parent_id: moment.id })}
			/>
		)
	}

	render() {
		const { content, day, together_id, activities, auth, users, intl } = this.props
		const { comment } = this.state

		this.authedUser = auth &&
												auth.userData &&
												auth.userData.userid &&
												auth.userData.userid in users ?
												users[auth.userData.userid] :
												null

		const avatarSrc = this.authedUser &&
											this.authedUser.has_avatar &&
											this.authedUser.user_avatar_url ?
											this.authedUser.user_avatar_url.px_48x48 :
											null

		this.dayActivities = activities &&
														activities[day] ?
														activities[day] :
														null

		return (
			<div className='talk-it-over'>
				<div style={{ width: '80%', textAlign: 'center', margin: 'auto', marginBottom: '50px' }}>
					{
						this.dayActivities &&
						<ParticipantsAvatarList
							together_id={together_id}
							day={day}
							statusFilter={['accepted', 'host']}
							avatarWidth={46}
						/>
					}
					<h5 style={{ margin: '30px 0' }}>{ content }</h5>
				</div>
				<List>
					<Card
						customClass='moment-card'
						extension={
							<a
								tabIndex={0}
								className='green flex-end'
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
								placeholderText={this.authedUser && this.authedUser.first_name ? this.authedUser.first_name.charAt(0) : null}
							/>
						</div>
						<Textarea
							style={{ flex: 1, padding: '10px 0' }}
							className='yv-textarea'
							placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeAnnouncement.prompt' })}
							onChange={(val) => { this.setState({ comment: val.target.value }) }}
							value={comment}
						/>
					</Card>
					{
							this.dayActivities &&
							this.dayActivities.map &&
							this.dayActivities.map.map((id) => {
								const moment = this.dayActivities.data[id]
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
