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
import Textarea from '../components/Textarea'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import Moment from '../features/Moments/components/Moment'
import CommentCreate from '../features/Moments/components/CommentCreate'


function getAuthedLikeOnMoment(momentLikes, userLikes) {
	// check if the any of the likes on the moment match any likes from the
	// authed user and return the activity id that matches
	let val = null
	if (momentLikes && userLikes) {
		val = momentLikes.filter((id) => {
			return userLikes.includes(id)
		})
	}
	return val ? val[0] : val
}

class TalkItOver extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comment: null,
			editingMoment: null,
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
			})).then((data) => {
				console.log('DATA', data)
				if (data && data.data && data.data[together_id][day]) {
					data.data[together_id][day].map.forEach((id) => {
						const activity = data.data[together_id][day].data[id]
						if (activity && activity.id) {
							dispatch(plansAPI.actions.activities.get({
								id: together_id,
								day,
								page,
								order: 'desc',
								parent_id: id,
							},
								{
									auth: true
								}))
						}
					})
				}
			})
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
			const alreadyLiked = getAuthedLikeOnMoment(moment.likes, this.dayActivities.authedUser.likes)
			if (alreadyLiked) {
				this.handleDelete(alreadyLiked)
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

	handleDelete = (activity_id) => {
		const { day, together_id, dispatch } = this.props
		if (activity_id) {
			dispatch(plansAPI.actions.activity.delete({
				id: together_id,
				activity_id
			},
				{
					auth: true,
				// this isn't used by the api, but we use it to delete the activity
				// from state
					day,
				}))
		}
	}

	handleEdit = (moment) => {
		this.modal.handleOpen()
		// let the modal know how to populate the comment creator
		this.setState({ editingMoment: moment, editingComment: moment.content })
	}

	handleSaveEdit = () => {
		const { together_id, dispatch } = this.props
		const { editingMoment, editingComment } = this.state
		if (editingMoment) {
			dispatch(plansAPI.actions.activity.put({
				id: together_id,
				activity_id: editingMoment.id
			},
				{
					body: {
						updated_dt: getCurrentDT(),
						content: editingComment,
					},
					auth: true
				})).then(() => {
					this.modal.handleClose()
					this.setState({ editingComment: '' })
				})
		}
	}

	renderMoment = (moment) => {
		// fill the heart if the user has liked this moment
		const authedLike = getAuthedLikeOnMoment(
												moment.likes,
												this.dayActivities.authedUser.likes
											)

		return (
			<Moment
				userid={moment.user_id}
				content={moment.content}
				dt={moment.updated_dt || moment.created_dt}
				filledLike={!!authedLike}
				likes={moment.likes ? moment.likes.length : null}
				onReply={this.handleComment.bind(this, { parent_id: moment.id })}
				onLike={this.handleLike.bind(this, { parent_id: moment.id })}
				onDelete={this.handleDelete.bind(this, moment.id)}
				onEdit={this.handleEdit.bind(this, moment)}
			/>
		)
	}

	render() {
		const { content, day, together_id, activities, auth, users } = this.props
		const { comment, editingMoment, editingComment } = this.state

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
					<CommentCreate
						avatarSrc={avatarSrc}
						avatarPlaceholder={this.authedUser && this.authedUser.first_name ? this.authedUser.first_name.charAt(0) : null}
						onChange={(val) => { this.setState({ comment: val }) }}
						value={comment}
						onComment={this.handleComment}
					/>
					{
							this.dayActivities &&
							this.dayActivities.map &&
							this.dayActivities.map.map((id) => {
								const moment = this.dayActivities.data[id]
								// we don't render a separate moment for a child activity,
								// nor day complete
								if (moment && moment.id && !moment.parent_id && moment.kind === 'comment') {
									return (
										<li key={moment.id} style={{ marginTop: '20px' }}>
											{ this.renderMoment(moment) }
										</li>
									)
								}
								return null
							})
						}
				</List>
				<Modal ref={(ref) => { this.modal = ref }} customClass='large-5 medium-8'>
					{
						editingMoment &&
						'content' in editingMoment &&
						<CommentCreate
							avatarSrc={avatarSrc}
							avatarPlaceholder={this.authedUser && this.authedUser.first_name ? this.authedUser.first_name.charAt(0) : null}
							onChange={(val) => { this.setState({ editingComment: val }) }}
							value={editingComment}
							onComment={this.handleSaveEdit}
						/>
					}
				</Modal>
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
	content: PropTypes.string.isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	activities: PropTypes.object,
	users: PropTypes.object,
	auth: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

TalkItOver.defaultProps = {
	activities: null,
	users: null,
}

export default connect(mapStateToProps, null)(TalkItOver)
