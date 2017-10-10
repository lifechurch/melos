import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// models
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// utils
import ViewportUtils from '../lib/viewportUtils'
import getCurrentDT from '../lib/getCurrentDT'
// components
import List from '../components/List'
import Modal from '../components/Modal'
import StickyHeader from '../components/StickyHeader'
import CommentMoment from '../features/Moments/components/types/Comment'
import CommentCreate from '../features/Moments/components/CommentCreate'
import TalkItOverInfo from '../features/PlanDiscovery/components/TalkItOverInfo'

class TalkItOver extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comment: null
		}
	}

	componentDidMount() {
		this.getActivities(1)
		this.viewportUtils = new ViewportUtils()
	}

	getActivities = (page) => {
		const { day, together_id, dispatch, tioIndex } = this.props
		if (page) {
			dispatch(plansAPI.actions.activities.get({
				id: together_id,
				day,
				page,
				order: 'desc',
				talk_it_over: tioIndex,
			}, { auth: true })).then(() => {
				// when we load first time, scroll to bottom for comment creator
				if (page === 1) {
					setTimeout(() => {
						document
						.getElementsByClassName('plan-reader-content')[0]
						.scrollIntoView(false)
					}, 500)
				}
			})
		}
	}

	handleComment = ({ parent_id = null }) => {
		const { day, together_id, dispatch, tioIndex } = this.props
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
						talk_it_over: tioIndex,
					},
					auth: true
				})).then(() => {
					this.setState({ comment: '' })
				})
		}
	}

	handleHeaderModal = () => {
		const viewport = this.viewportUtils.getViewport()
		// only open modal on mobile
		if (parseInt(viewport.width, 10) <= 599) {
			this.modal.handleOpen()
			this.setState({ headerModalOpen: true })
		}
	}

	render() {
		const { content, day, together_id, together, auth, users } = this.props
		const { comment, headerModalOpen } = this.state

		this.authedUser = auth
			&& users
			&& auth.userData
			&& auth.userData.userid
			&& auth.userData.userid in users
			? users[auth.userData.userid].response
			: null

		const avatarSrc = this.authedUser
			&& this.authedUser.has_avatar
			&& this.authedUser.user_avatar_url
			? this.authedUser.user_avatar_url.px_48x48
			: null

		this.isArchived = together
			&& together.archived
		this.dayActivities = together
			&& together.activities
			&& together.activities[day]
			? together.activities[day]
			: null

		return (
			<div className='talk-it-over'>
				<StickyHeader verticalOffset={140} translationDistance='70px' stackOrder={2}>
					{
						// we want to wait to render the info because the participants list
						// will try and grab the day completes if it doesn't see the activities
						// already for today
						this.dayActivities
							&& (
								<div role='button' tabIndex={0} onClick={this.handleHeaderModal}>
									<TalkItOverInfo
										customClass='talk-it-over-header'
										together_id={together_id}
										day={day}
										questionContent={content}
										archived={this.isArchived}
									/>
								</div>
							)
					}
				</StickyHeader>
				<List
					loadMoreDirection='up'
					loadMore={
						this.getActivities.bind(
							this,
							this.dayActivities
							&& this.dayActivities.next_page
						)
					}
				>
					{
						this.dayActivities &&
						this.dayActivities.map &&
						this.dayActivities.map.map((id) => {
							const moment = this.dayActivities.data[id]
							if (moment && moment.id && moment.kind === 'comment') {
								return (
									<li key={moment.id} style={{ marginBottom: '20px' }}>
										<CommentMoment
											id={moment.id}
											tioDay={day}
											together_id={together_id}
										/>
									</li>
								)
							}
							return null
						})
					}
					{
						!this.isArchived
							&& (
								<CommentCreate
									avatarSrc={avatarSrc}
									avatarPlaceholder={this.authedUser && this.authedUser.first_name ? this.authedUser.first_name.charAt(0) : null}
									onChange={(val) => { this.setState({ comment: val }) }}
									value={comment}
									onComment={this.handleComment}
								/>
							)
					}
				</List>
				{/*
					this modal is opened in two ways, either by editing a comment or showing the
					talk it over header on mobile
				*/}
				<Modal
					ref={(ref) => { this.modal = ref }}
					handleCloseCallback={() => {
						this.setState({ headerModalOpen: false })
					}}
					customClass='large-6 medium-8 small-11'
				>
					{
						headerModalOpen
							&& this.dayActivities
							&& (
								<TalkItOverInfo
									customClass='talk-it-over-modal'
									together_id={together_id}
									day={day}
									questionContent={content}
									archived={this.isArchived}
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
	console.log('TOG', getTogetherModel(state));
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

TalkItOver.propTypes = {
	content: PropTypes.string.isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	together: PropTypes.object.isRequired,
	tioIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	users: PropTypes.object,
	auth: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

TalkItOver.defaultProps = {
	users: null,
}

export default connect(mapStateToProps, null)(TalkItOver)
