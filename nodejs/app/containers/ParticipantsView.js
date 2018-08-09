import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import deleteSub from '@youversion/api-redux/lib/batchedActions/deleteSub'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import Participants from '../features/PlanDiscovery/components/Participants'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import User from '../components/User'


class ParticipantsView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userToDelete: null
		}
	}

	componentDidMount() {
		const {
			dispatch,
			auth,
			params: { id, together_id },
			location: { query },
			plan,
			participants,
			together,
      serverLanguageTag
		} = this.props

		// join token will allow us to see the participants and together unauthed
		const token = query && query.token ? query.token : null
		if (!(plan && 'id' in plan && participants && together_id in participants.byTogetherId)) {
			dispatch(planView({
				plan_id: id.split('-')[0],
				together_id,
				token,
				auth,
				serverLanguageTag
			}))
		}
		if (!(together && 'id' in together)) {
			dispatch(plansAPI.actions.together.get({
				id: together_id,
				token
			}, { auth: auth && auth.isLoggedIn }))
		}
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	deleteParticipant = () => {
		const { dispatch, auth, params: { together_id }, subscriptions } = this.props
		const { userToDelete } = this.state
		// if the host is removing themself, do a delete call and then remove the sub
		// from the list
		if (auth.userData.userid === userToDelete) {
			dispatch(plansAPI.actions.participant.delete(
				{
					id: together_id,
					userid: userToDelete,
				}, {
					auth: true,
				}
			)).then(() => {
				// remove subscription from state for authed user
				this.modal.handleClose()
				let idToDelete
				Object.keys(subscriptions.byId).forEach((id) => {
					const sub = subscriptions.byId[id]
					if (parseInt(sub.together_id, 10) === parseInt(together_id, 10)) {
						idToDelete = id
					}
				})
				dispatch(deleteSub({ subscription_id: idToDelete, together_id }))
				dispatch(push(Routes.subscriptions({
					username: auth.userData.username
				})))
			})
		} else {
		// else host is removing someone else, we want to kick them
			dispatch(plansAPI.actions.participant.put(
				{
					id: together_id,
					userid: userToDelete,
				}, {
					body: {
						status: 'kicked'
					},
					auth: true,
				}
			)).then(() => {
				this.modal.handleClose()
			})
		}
	}

	openDelete = (userid) => {
		this.setState({ userToDelete: userid })
		this.modal.handleOpen()
	}

	render() {
		const { plan, participants, together, auth, location: { query } } = this.props
		const { userToDelete } = this.state

		const day = query && query.day ? parseInt(query.day, 10) : null
		const together_id = together && together.id
		const acceptedParticipants = participants
			&& participants.filter({ together_id, statusFilter: ['host', 'accepted'] })
		const pendingParticipants = participants
			&& participants.filter({ together_id, statusFilter: ['invited'] })
		const deleteUserData = participants
			&& userToDelete
			&& participants.filter({ together_id })
			&& participants.filter({ together_id })[userToDelete]
		const src = plan && plan.images ? selectImageFromList({ images: plan.images, width: 640, height: 320 }).url : ''
		this.isAuthHost = participants.isAuthHost(together && together.id)
		const backLink = (
			auth.isLoggedIn
				? (
					<Link to={Routes.subscriptions({ username: auth.userData.username })}>
						<FormattedMessage id='plans.my_plans' />
					</Link>
				)
				: (
					<Link to={Routes.plan({ plan_id: plan && plan.id })}>
						<FormattedMessage id='plans.about this plan' />
					</Link>
				)
		)

		return (
			<div>
				<Participants
					planImg={src}
					accepted={acceptedParticipants
						&& Object.keys(acceptedParticipants)
						&& Object.keys(acceptedParticipants).length > 0
						&& Object.keys(acceptedParticipants).map((id) => {
							return acceptedParticipants[id]
						})
					}
					pending={pendingParticipants
						&& Object.keys(pendingParticipants)
						&& Object.keys(pendingParticipants).length > 0
						&& Object.keys(pendingParticipants).map((id) => {
							return pendingParticipants[id]
						})
					}
					together_id={together_id}
					// only allow participant deletes if the authed user is the host of pwf
					handleDelete={this.isAuthHost && this.openDelete}
					// show checkmarks if we have a specific day
					activities={together
						&& together.activities
						&& day
						&& Immutable
								.fromJS(together)
								.hasIn(['activities', `${day}`, 'data'], false)
						&& Immutable
								.fromJS(together)
								.getIn(['activities', `${day}`, 'data'])
								.toJS()
					}
					backLink={backLink}
					day={day}
				/>
				<Modal
					ref={(ref) => { this.modal = ref }}
					handleCloseCallback={() => {
						this.setState({ userToDelete: null })
					}}
					customClass='large-3 medium-6 small-10'
				>
					<ConfirmationDialog
						handleConfirm={this.deleteParticipant}
						handleCancel={() => { this.modal.handleClose() }}
						subPrompt={
							deleteUserData &&
							'id' in deleteUserData &&
							<User
								avatarLetter={deleteUserData.first_name ? deleteUserData.first_name.charAt(0) : null}
								src={deleteUserData.user_avatar_url.px_48x48}
								width={26}
								heading={deleteUserData.name ? deleteUserData.name : null}
								subheading={deleteUserData.source ? deleteUserData.source : null}
							/>
						}
					/>
				</Modal>
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id, together_id } } = props
	const plan_id = id ? id.split('-')[0] : null
	return {
		plan: getPlanById(state, plan_id),
		participants: getParticipantsUsers(state),
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		subscriptions: getSubscriptionsModel(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

ParticipantsView.propTypes = {
	plan: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(ParticipantsView)
