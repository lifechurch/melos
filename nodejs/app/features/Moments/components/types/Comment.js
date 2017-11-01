import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// models
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// utils
import getCurrentDT from '../../../../lib/getCurrentDT'
import Routes from '../../../../lib/routes'
// components
import Avatar from '../../../../components/Avatar'
import Like from '../../../../components/Like'
import Modal from '../../../../components/Modal'
import FormattedText from '../../../../components/FormattedText'
import OverflowMenu, { Edit, Delete } from '../../../../components/OverflowMenu'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import Moment from '../Moment'
import CommentCreate from '../CommentCreate'


class Comment extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comment: null,
			editingComment: null,
		}
	}

	handleEdit = () => {
		this.modal.handleOpen()
		this.setState({ editingComment: this.moment.content })
	}

	handleSaveEdit = () => {
		const { together_id, dispatch, onEdit } = this.props
		const { editingComment } = this.state
		if (onEdit) {
			onEdit()
		} else if (editingComment) {
			dispatch(plansAPI.actions.activity.put({
				id: together_id,
				activity_id: this.moment.id
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

	handleLike = () => {
		const { together_id, dispatch, onLike, onUnlike } = this.props
		if (this.moment) {
			// if the user has already liked the moment then we want to unlike it
			if (this.authHasLiked) {
				if (onUnlike) {
					onUnlike()
				} else {
					this.handleUnlike()
				}
			} else if (onLike) {
				onLike()
			} else {
				dispatch(plansAPI.actions.activityLike.post({
					id: together_id,
					activity_id: this.moment.id,
				}, { auth: true }))
			}
		}
	}

	handleUnlike = () => {
		const { together_id, dispatch } = this.props
		if (this.moment) {
			dispatch(plansAPI.actions.activityLike.delete({
				id: together_id,
				activity_id: this.moment.id
			}, { auth: true }))
		}
	}

	handleDelete = () => {
		const { tioDay, together_id, onDelete, dispatch } = this.props
		if (this.moment) {
			if (onDelete) {
				onDelete()
			} else {
				dispatch(plansAPI.actions.activity.delete({
					id: together_id,
					activity_id: this.moment.id
				},
					{
						auth: true,
					// this isn't used by the api, but we use it to delete the activity
					// from state because there is no data that comes back from a comment delete
						day: tioDay,
					}))
			}
		}
	}

	render() {
		const {
			id,
			tioDay,
			title,
			users,
			auth,
			together,
			momentData,
			charLimit,
		} = this.props
		const { editingComment } = this.state

		this.isArchived = together
			&& together.archived
		this.moment = together
			&& together.activities
			&& together.activities[tioDay]
			&& together.activities[tioDay].data
			&& together.activities[tioDay].data[id]
			? together.activities[tioDay].data[id]
			: momentData
		const likedIds = this.moment && this.moment.likes
		const authedId = auth && auth.userData && auth.userData.userid
		this.authHasLiked = likedIds && authedId && likedIds.includes(authedId)
		const userid = this.moment && this.moment.user_id
		this.isAuthedMoment = userid
			&& authedId
			&& userid === authedId
		const dt = this.moment && (this.moment.updated_dt || this.moment.created_dt)
		const user = 	userid && userid in users
			? users[userid].response
			: null
		const avatarSrc = user && user.has_avatar && user.user_avatar_url
			? user.user_avatar_url.px_48x48
			: null
		const userLink = Routes.user({
			username: user && user.username,
		})

		return (
			<div>
				<Moment
					className='yv-comment-moment'
					likedIds={likedIds}
					commentIds={null}
					header={
						<MomentHeader
							icon={
								userid &&
								<Avatar
									src={avatarSrc}
									width={38}
									placeholderText={user && user.first_name ? user.first_name.charAt(0) : null}
									link={userLink}
								/>
							}
							title={title || (user ? user.name : null)}
							subTitle={null}
							dt={dt}
						/>
					}
					footer={
						<MomentFooter
							left={
								<Like
									isFilled={this.authHasLiked}
									onLike={!this.archived && this.handleLike}
								/>
							}
							right={
								!this.archived
									&& this.isAuthedMoment
									&& (
										<OverflowMenu>
											<Edit onClick={this.handleEdit} />
											<Delete onClick={this.handleDelete} />
										</OverflowMenu>
									)
							}
						/>
					}
				>
					{
						this.moment
							&& this.moment.content
							&& <FormattedText text={this.moment.content} />
					}
				</Moment>
				<Modal
					ref={(ref) => { this.modal = ref }}
					handleCloseCallback={() => {
						this.setState({ editingMoment: false })
					}}
					customClass='large-6 medium-8 small-11 comment'
				>
					{
							typeof editingComment === 'string'
								&& (
									<CommentCreate
										avatarSrc={avatarSrc}
										avatarPlaceholder={this.authedUser && this.authedUser.first_name ? this.authedUser.first_name.charAt(0) : null}
										onChange={(val) => {
											this.setState({
												editingComment: val || ''
											})
										}}
										value={editingComment}
										charLimit={charLimit}
										onComment={this.handleSaveEdit}
									/>
								)
						}
				</Modal>
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		together: getTogetherModel(state)
			&& together_id in getTogetherModel(state).byId
			&& getTogetherModel(state).byId[together_id]
			? getTogetherModel(state).byId[together_id]
			: null,
		users: getUsers(state),
		auth: state.auth,
	}
}
Comment.propTypes = {
	id: PropTypes.number,
	together_id: PropTypes.number,
	tioDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	together: PropTypes.object,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	users: PropTypes.object,
	auth: PropTypes.object,
	onLike: PropTypes.func,
	onUnlike: PropTypes.func,
	onDelete: PropTypes.func,
	onEdit: PropTypes.func,
	momentData: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
	charLimit: PropTypes.number,
}

Comment.defaultProps = {
	id: null,
	together_id: null,
	tioDay: null,
	together: null,
	title: null,
	userid: null,
	users: null,
	auth: null,
	onEdit: null,
	onLike: null,
	onUnlike: null,
	onDelete: null,
	momentData: null,
	charLimit: null,
}

export default connect(mapStateToProps, null)(Comment)
