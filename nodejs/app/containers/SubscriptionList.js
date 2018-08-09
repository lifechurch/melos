import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import customGet from '@youversion/api-redux/lib/customHelpers/get'
// models / selectors
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations, getParticipantsUsers } from '@youversion/api-redux/lib/models'
// utils
import calcTodayVsStartDt from '@youversion/utils/lib/readingPlans/calcTodayVsStartDt'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
// components
import List from '../components/List'
import Modal from '../components/Modal'
import ShareLink from '../components/ShareLink'
import Placeholder from '../components/placeholders/MediaListItemPlaceholder'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../widgets/TogetherInvitationActions'
import InvitationString from '../widgets/InvitationString'
import ProgressBar from '../components/ProgressBar'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'

class SubscriptionList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inviteId: null
		}
	}

	componentDidMount() {
		const { auth } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		// get any invites we have
		this.getInvitations()
		// get actual subscriptions
		this.getSubs({ page: 1 })
	}

	shouldComponentUpdate(nextProps) {
		const { subscriptions, invitations } = this.props
		if (
			subscriptions.byId
			&& subscriptions.byId.length < 1
			&& nextProps.subscriptions.byId.length < 1
			&& invitations
			&& invitations.length < 1
			&& nextProps.invitations.length < 1
		) {
			return false
		}
		return true
	}

	getSubs = ({ page = null }) => {
		const { dispatch, auth, subscriptions, readingPlans, participants, serverLanguageTag } = this.props
		return dispatch(plansAPI.actions.subscriptions.get({ order: 'desc', page }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						if (
							!(
								sub.plan_id in readingPlans.byId
								&& participants
								&& participants.filter({ together_id: sub.together_id, idOnly: true }).length > 0
							)
						) {
							dispatch(planView({
								plan_id: sub.plan_id,
								together_id: sub.together_id,
								auth,
								serverLanguageTag
							}))
						}
						// get share link for a plan that starts in the future
						if (sub.together_id && calcTodayVsStartDt(sub.start_dt).isInFuture) {
							customGet({
								actionName: 'together',
								pathvars: {
									id: sub.together_id,
								},
								params: {
									auth: true,
								},
								dispatch,
								actions: plansAPI.actions,
								auth,
							})
						}
						if (!(id in subscriptions.byId && 'days' in subscriptions.byId[id])) {
							// get progress for progress bar
							customGet({
								actionName: 'progress',
								pathvars: {
									id,
									page: '*',
									fields: 'days'
								},
								params: {
									auth: true,
								},
								dispatch,
								actions: plansAPI.actions,
								auth,
							})
						}
					})
				}
			}
		})
	}

	getInvitations = () => {
		const { dispatch, auth, readingPlans, participants, serverLanguageTag } = this.props
		return dispatch(plansAPI.actions.togethers.get({ status: 'invited' }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = subs.map
				if (ids && ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						if (!(sub.plan_id in readingPlans.byId && id in participants.byTogetherId)) {
							dispatch(planView({
								plan_id: sub.plan_id,
								together_id: id,
								auth,
								serverLanguageTag
							}))
						}
					})
				}
			}
		})
	}

	loadMore = () => {
		const { subscriptions } = this.props
		if (subscriptions && subscriptions.next_page) {
			this.getSubs({ page: subscriptions.next_page })
		}
	}

	renderListItem = ({ plan_id, together_id, start_dt, subscription_id = null }) => {
		const {
			language_tag,
			readingPlans,
			invitations,
			subscriptions,
			localizedLink
		} = this.props
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null
		const sub = (subscription_id && subscription_id in subscriptions.byId) ? subscriptions.byId[subscription_id] : null

		let link, src, subContent, dayString, progress, titleString, isInFuture
		if (start_dt && plan && 'id' in plan) {
			isInFuture = calcTodayVsStartDt(start_dt).isInFuture
			src = plan.images
				? selectImageFromList({ images: plan.images, width: 160, height: 160 }).url
				: null
			progress = (
				<div style={{ padding: '5px 0', width: '50px' }}>
					<ProgressBar
						percentComplete={
							sub && sub.overall
								? sub.overall.completion_percentage
								: 0
						}
						color='gray'
					/>
				</div>
			)

			titleString = plan.name[language_tag] || plan.name.default

			// plans together have different strings
			if (together_id) {
				if (invitations.indexOf(together_id) > -1) {
					dayString = <PlanStartString start_dt={start_dt} />
					titleString = <InvitationString together_id={together_id} />
				}
			} else {
				let day = moment().diff(moment(start_dt, 'YYYY-MM-DD'), 'days') + 1
				if (day > plan.total_days) {
					day = plan.total_days
				}
				dayString = (
					<FormattedMessage
						id='plans.which day in plan'
						values={{ day, total: plan.total_days }}
					/>
				)
			}
			if (isInFuture) {
				dayString = <PlanStartString start_dt={start_dt} />
			}

			link = localizedLink(Routes.plans({}))
			// if this is a subscription, link to it
			if (subscription_id) {
				link = localizedLink(
					Routes.subscription({
						username: this.username,
						plan_id: plan.id,
						slug: plan.slug,
						subscription_id,
					})
				)
			// otherwise it's an invitation where we want more info
			} else {
				link = localizedLink(
					Routes.togetherInvitation({
						plan_id: plan.id,
						slug: plan.slug,
						together_id,
					}))
			}

			subContent = (
				<div>
					{ sub && !isInFuture && progress }
					<div style={{ padding: '5px 0' }}>
						{
							together_id
								&& (
									<ParticipantsAvatarList
										together_id={together_id}
										plan_id={plan_id}
										avatarWidth={26}
										statusFilter={['accepted', 'host']}
									/>
								)
						}
					</div>
					{ dayString }
				</div>
			)
		}

		return (
			<PlanListItem
				key={`${plan_id}.${subscription_id}`}
				src={src}
				name={titleString}
				link={link}
				subContent={subContent}
			/>
		)
	}


	render() {
		const { subscriptions, together, invitations, participants } = this.props
		const { inviteId } = this.state

		const plansList = []
		// build list of invitations
		if (invitations && together && together.allIds.length > 0) {
			invitations.forEach((id) => {
				const resource = together.byId[id]
				if (resource && resource.plan_id) {
					plansList.push(
						<div key={`${id}.${resource.plan_id}`}>
							{
								this.renderListItem({
									plan_id: resource.plan_id,
									together_id: id,
									start_dt: resource.start_dt,
								})
							}
							<TogetherInvitationActions
								together_id={id}
								handleActionComplete={() => {
									this.getInvitations()
									this.getSubs({ page: 1 })
								}}
							/>
						</div>
					)
				}
			})
		}
		// build list of subscriptions
		if (subscriptions && subscriptions.allIds.length > 0) {
			subscriptions.allIds.forEach((id) => {
				const sub = subscriptions.byId[id]
				if (sub && sub.plan_id && !sub.completed_dt) {
					const authIsHost = participants.isAuthHost(sub.together_id)
					const isInFuture = sub.together_id
						&& calcTodayVsStartDt(sub.start_dt).isInFuture

					plansList.push(
						<div key={id}>
							{
								this.renderListItem({
									plan_id: sub.plan_id,
									together_id: sub.together_id,
									start_dt: sub.start_dt,
									subscription_id: id,
								})
							}
							<div className='button-actions vertical-center'>
								{
									// show host actions on a together that starts in the future
									isInFuture
										&& authIsHost
										&& (
											<a
												tabIndex={0}
												className='yv-green-link'
												onClick={() => {
													this.setState({ inviteId: sub.together_id })
													this.modal.handleOpen()
												}}
											>
												<FormattedMessage id='invite others' />
											</a>
										)
								}
							</div>
						</div>
					)
				}
				return null
			})
		}

		let content = (
			<Placeholder
				height='80px'
				width='80px'
				duplicate={5}
				className='subscription'
				lineSpacing='15px'
				textHeight='10px'
				borderRadius='5px'
			/>
		)
		if (plansList.length > 0) {
			content = plansList
		} else if (plansList.length < 1 && !subscriptions.loading) {
			content = <FormattedMessage id='plans.you have no plans' />
		}

		return (
			<div>
				<List customClass='subscription-list' loadMore={this.loadMore}>
					{ content	}
				</List>
				<Modal
					ref={(ref) => { this.modal = ref }}
					customClass='large-5 medium-8 small-11'
					handleCloseCallback={() => {
						this.setState({ inviteId: null })
					}}
				>
					{ inviteId && <ShareLink together_id={inviteId} /> }
				</Modal>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		together: getTogetherModel(state),
		invitations: getTogetherInvitations(state),
		participants: getParticipantsUsers(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

SubscriptionList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	invitations: PropTypes.array,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
}

SubscriptionList.defaultProps = {
	invitations: null,
}

export default connect(mapStateToProps, null)(SubscriptionList)
